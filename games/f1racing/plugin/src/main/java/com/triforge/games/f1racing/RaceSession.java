package com.triforge.games.f1racing;

import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.match.MatchPhaseMachine;
import com.triforge.games.f1racing.ai.BotDriverAI;
import com.triforge.games.f1racing.replay.ReplayDriverMeta;
import com.triforge.games.f1racing.replay.ReplayRecorder;
import com.triforge.games.f1racing.components.CarKinematicsComponent;
import com.triforge.games.f1racing.components.DriverComponent;
import com.triforge.games.f1racing.entities.CarEntityFactory;
import com.triforge.games.f1racing.physics.ArcadeVehiclePhysics;
import com.triforge.games.f1racing.physics.VehicleInput;
import com.triforge.games.f1racing.physics.VehicleState;
import com.triforge.games.f1racing.race.CheckpointDetector;
import com.triforge.games.f1racing.race.LapCounter;
import com.triforge.games.f1racing.race.RaceStandings;
import com.triforge.games.f1racing.track.StartGridSlot;
import com.triforge.games.f1racing.track.TrackDefinition;
import com.triforge.protocol.proto.F1CollisionMode;
import com.triforge.protocol.proto.F1Message;
import com.triforge.protocol.proto.F1QualifyingResult;
import com.triforge.protocol.proto.F1StandingUpdate;
import com.triforge.protocol.proto.F1VehicleInput;
import com.triforge.protocol.proto.GameMessage;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Authoritative race simulation for spawned cars. */
public final class RaceSession {

    private final TrackDefinition track;
    private final ArcadeVehiclePhysics physics;
    private final CheckpointDetector checkpointDetector;
    private final RaceStandings standings = new RaceStandings();
    private final Map<Long, VehicleState> vehicleStates = new LinkedHashMap<>();
    private final Map<Long, LapCounter> lapCounters = new LinkedHashMap<>();
    private final Map<Long, VehicleInput> inputs = new HashMap<>();
    private final Map<Long, Long> playerEntities = new LinkedHashMap<>();
    private final Map<Long, Long> sessionStartTick = new HashMap<>();
    private final int targetLaps;
    private final BotDriverAI botDriverAI;
    private F1Lobby lobby;
    private F1CollisionMode collisionMode = F1CollisionMode.F1_COLLISION_ON;

    public RaceSession(TrackDefinition track, int targetLaps) {
        this.track = track;
        this.targetLaps = targetLaps;
        this.physics = new ArcadeVehiclePhysics(track);
        this.checkpointDetector = new CheckpointDetector(track);
        this.botDriverAI = new BotDriverAI(physics.spline(), track.trackWidth());
    }

    public void bindLobby(F1Lobby lobby) {
        this.lobby = lobby;
    }

    public void setCollisionMode(F1CollisionMode collisionMode) {
        if (collisionMode != null && collisionMode != F1CollisionMode.UNRECOGNIZED) {
            this.collisionMode = collisionMode;
        }
    }

    public Map<Long, Long> playerEntities() {
        return playerEntities;
    }

    public long playerEntityId(long playerId) {
        return playerEntities.getOrDefault(playerId, 0L);
    }

    public void spawnGrid(EntityManager entities, ComponentManager components, long tick) {
        spawnGrid(entities, components, tick, null);
    }

    public void spawnGrid(
            EntityManager entities,
            ComponentManager components,
            long tick,
            List<Long> playerOrder
    ) {
        clear(entities, components);
        List<StartGridSlot> grid = track.startGrid();
        List<F1Lobby.Player> roster = orderedPlayers(playerOrder);
        int slot = 0;
        for (F1Lobby.Player player : roster) {
            StartGridSlot gridSlot = grid.get(Math.min(slot, grid.size() - 1));
            long entityId = CarEntityFactory.spawn(
                    entities,
                    components,
                    player.playerId(),
                    player.displayName(),
                    player.bot(),
                    player.loadout(),
                    gridSlot);
            playerEntities.put(player.playerId(), entityId);
            vehicleStates.put(player.playerId(), new VehicleState(gridSlot.x(), gridSlot.y(), gridSlot.z(), gridSlot.yaw()));
            lapCounters.put(player.playerId(), new LapCounter(track.checkpoints().size(), targetLaps, tick));
            sessionStartTick.put(player.playerId(), tick);
            inputs.put(player.playerId(), VehicleInput.NEUTRAL);
            slot++;
        }
    }

    /**
     * Re-baseline race and lap timing to {@code tick}. Cars are spawned on the grid when the
     * countdown begins (so clients can render them and lock the camera), but physics stays frozen
     * until "GO". Calling this at GO ensures the countdown seconds are not counted against lap or
     * total race times.
     */
    public void markRaceStart(long tick) {
        for (long playerId : new ArrayList<>(lapCounters.keySet())) {
            lapCounters.put(playerId, new LapCounter(track.checkpoints().size(), targetLaps, tick));
            sessionStartTick.put(playerId, tick);
        }
    }

    public F1QualifyingResult buildQualifyingResult() {
        return QualifyingGrid.build(lobby, lapCounters);
    }

    private List<F1Lobby.Player> orderedPlayers(List<Long> playerOrder) {
        if (playerOrder == null || playerOrder.isEmpty()) {
            return lobby.playersSnapshot();
        }
        Map<Long, F1Lobby.Player> byId = new LinkedHashMap<>();
        for (F1Lobby.Player player : lobby.playersSnapshot()) {
            byId.put(player.playerId(), player);
        }
        List<F1Lobby.Player> ordered = new ArrayList<>(byId.size());
        for (long playerId : playerOrder) {
            F1Lobby.Player player = byId.remove(playerId);
            if (player != null) {
                ordered.add(player);
            }
        }
        ordered.addAll(byId.values());
        return ordered;
    }

    public void queueInput(long playerId, F1VehicleInput proto) {
        if (!vehicleStates.containsKey(playerId)) {
            return;
        }
        inputs.put(playerId, new VehicleInput(
                proto.getSteer(),
                proto.getThrottle(),
                proto.getBrake(),
                proto.getHandbrake(),
                proto.getNitro(),
                proto.getResetCar()));
    }

    public F1StandingUpdate tick(long tick, EntityManager entities, ComponentManager components) {
        applyBotInputs();
        List<Long> ids = new ArrayList<>(vehicleStates.keySet());
        for (long playerId : ids) {
            VehicleState state = vehicleStates.get(playerId);
            VehicleInput input = inputs.getOrDefault(playerId, VehicleInput.NEUTRAL);
            physics.tick(state, input, collisionMode);
            LapCounter lap = lapCounters.get(playerId);
            lap.updatePosition(state.x(), state.y(), checkpointDetector, tick, MatchPhaseMachine.TICKS_PER_SECOND);
        }

        for (int i = 0; i < ids.size(); i++) {
            for (int j = i + 1; j < ids.size(); j++) {
                ArcadeVehiclePhysics.resolveCarCarCollision(
                        vehicleStates.get(ids.get(i)),
                        vehicleStates.get(ids.get(j)),
                        collisionMode);
            }
        }

        syncComponents(entities, components);

        List<RaceStandings.CarProgress> progress = new ArrayList<>();
        for (long playerId : ids) {
            VehicleState state = vehicleStates.get(playerId);
            LapCounter lap = lapCounters.get(playerId);
            var projection = physics.spline().project(state.x(), state.y());
            long start = sessionStartTick.getOrDefault(playerId, tick);
            long finishMs = lap.finishTimeMs(MatchPhaseMachine.TICKS_PER_SECOND);
            long totalMs = finishMs >= 0L
                    ? finishMs
                    : Math.max(0L, (tick - start) * 1000L / MatchPhaseMachine.TICKS_PER_SECOND);
            F1Lobby.Player player = lobby == null ? null : lobby.player(playerId).orElse(null);
            progress.add(new RaceStandings.CarProgress(
                    playerId,
                    player == null ? "Driver" : player.displayName(),
                    lap.lap(),
                    lap.nextCheckpointIndex(),
                    projection.alongDistance(),
                    totalMs,
                    lap.bestLapMs(),
                    lap.lastLapMs(),
                    lap.finished(),
                    player != null && player.bot()));
        }

        List<com.triforge.protocol.proto.F1StandingEntry> sorted = standings.sort(progress);
        applyRacePositions(sorted, entities, components);
        return F1StandingUpdate.newBuilder().addAllEntries(sorted).build();
    }

    public boolean allFinished() {
        return !lapCounters.isEmpty() && lapCounters.values().stream().allMatch(LapCounter::finished);
    }

    public GameMessage standingsMessage(F1StandingUpdate update) {
        return GameMessage.newBuilder()
                .setF1(F1Message.newBuilder().setStandings(update))
                .build();
    }

    public void clear(EntityManager entities, ComponentManager components) {
        for (long entityId : playerEntities.values()) {
            entities.destroyId(entityId);
        }
        playerEntities.clear();
        vehicleStates.clear();
        lapCounters.clear();
        inputs.clear();
        sessionStartTick.clear();
        botDriverAI.reset();
    }

    void sampleReplay(
            ReplayRecorder recorder,
            long tick,
            EntityManager entities,
            ComponentManager components
    ) {
        if (lobby == null) {
            return;
        }
        Map<Long, ReplayDriverMeta> drivers = new HashMap<>();
        for (var entry : playerEntities.entrySet()) {
            long playerId = entry.getKey();
            F1Lobby.Player player = lobby.player(playerId).orElse(null);
            String displayName = player == null ? "Driver" : player.displayName();
            boolean bot = player != null && player.bot();
            String carId = "formula-modern";
            String color = "#e10600";
            int index = entities.indexOf(entry.getValue());
            if (index >= 0) {
                DriverComponent driver = components.getAt(index, DriverComponent.class);
                if (driver != null) {
                    carId = driver.carId();
                    color = driver.primaryColor();
                }
            }
            drivers.put(playerId, new ReplayDriverMeta(displayName, bot, carId, color));
        }
        recorder.sample(tick, playerEntities, vehicleStates, drivers);
    }

    private void applyBotInputs() {
        if (lobby == null) {
            return;
        }
        for (F1Lobby.Player player : lobby.playersSnapshot()) {
            if (!player.bot() || !vehicleStates.containsKey(player.playerId())) {
                continue;
            }
            VehicleState state = vehicleStates.get(player.playerId());
            inputs.put(player.playerId(), botDriverAI.compute(player.playerId(), state));
        }
    }

    private void syncComponents(EntityManager entities, ComponentManager components) {
        for (var entry : playerEntities.entrySet()) {
            long playerId = entry.getKey();
            long entityId = entry.getValue();
            int index = entities.indexOf(entityId);
            if (index < 0) {
                continue;
            }
            CarKinematicsComponent kinematics = components.getAt(index, CarKinematicsComponent.class);
            if (kinematics == null) {
                continue;
            }
            VehicleState state = vehicleStates.get(playerId);
            LapCounter lap = lapCounters.get(playerId);
            kinematics.syncFrom(state);
            kinematics.setCurrentLap(lap.lap());
        }
    }

    private void applyRacePositions(
            List<com.triforge.protocol.proto.F1StandingEntry> sorted,
            EntityManager entities,
            ComponentManager components
    ) {
        for (var entry : sorted) {
            Long entityId = playerEntities.get(entry.getPlayerId());
            if (entityId == null) {
                continue;
            }
            int index = entities.indexOf(entityId);
            if (index < 0) {
                continue;
            }
            CarKinematicsComponent kinematics = components.getAt(index, CarKinematicsComponent.class);
            if (kinematics != null) {
                kinematics.setRacePosition(entry.getPosition());
            }
        }
    }
}
