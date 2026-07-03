package com.triforge.games.tankarena;

import com.triforge.engine.room.RoomHost;
import com.triforge.games.tankarena.input.RoomInputProcessor;
import com.triforge.games.tankarena.match.TankArenaMatchController;
import com.triforge.engine.game.Game;
import com.triforge.engine.snapshot.EntitySnapshotWriter;
import com.triforge.games.tankarena.entities.TankEntityFactory;
import com.triforge.games.tankarena.components.CanControlComponent;
import com.triforge.games.tankarena.components.PlayerComponent;
import com.triforge.games.tankarena.components.PositionComponent;
import com.triforge.games.tankarena.components.VisionComponent;
import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EcsWorld;
import com.triforge.engine.ecs.Entity;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.ecs.SystemScheduler;
import com.triforge.games.tankarena.map.GameMap;
import com.triforge.games.tankarena.map.HeadquartersDefinition;
import com.triforge.games.tankarena.map.HqPlacement;
import com.triforge.games.tankarena.map.MapConfig;
import com.triforge.games.tankarena.map.MatchHeadquarters;
import com.triforge.games.tankarena.map.SpawnRegionResolver;
import com.triforge.games.tankarena.map.TileType;
import com.triforge.games.tankarena.systems.CollisionSystem;
import com.triforge.games.tankarena.systems.FogOfWarSystem;
import com.triforge.games.tankarena.systems.MapCollisionSystem;
import com.triforge.games.tankarena.systems.MovementSystem;
import com.triforge.games.tankarena.systems.ShootingSystem;
import com.triforge.games.tankarena.systems.TankTankCollisionSystem;
import com.triforge.games.tankarena.systems.WorldBoundsCollisionSystem;
import com.triforge.games.tankarena.vision.FogOfWarCalculator;
import com.triforge.games.tankarena.vision.RoomVisionState;
import com.triforge.games.tankarena.world.WorldBounds;
import com.triforge.games.tankarena.match.LobbyCommandOutcome;
import com.triforge.games.tankarena.match.LobbyRejectReason;
import com.triforge.games.tankarena.match.LobbyPlayer;
import com.triforge.engine.match.MatchConfig;
import com.triforge.engine.match.MatchController;
import com.triforge.engine.match.MatchPhase;
import com.triforge.games.tankarena.match.MatchProtoMapper;
import com.triforge.games.tankarena.match.MatchStatsTracker;
import com.triforge.games.tankarena.match.SpawnRegion;
import com.triforge.games.tankarena.match.Team;
import com.triforge.games.tankarena.match.TeamSetup;
import com.triforge.protocol.proto.Direction;
import com.triforge.protocol.proto.GameEvent;
import com.triforge.protocol.proto.GameEventType;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.InputCommand;
import com.triforge.protocol.proto.JoinResponse;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.TileChange;
import com.triforge.engine.sync.DeltaService;
import com.triforge.engine.sync.StandardDeltaService;
import com.triforge.engine.sync.InterestFilter;
import com.triforge.games.tankarena.sync.TankArenaInterestFilter;
import com.triforge.games.tankarena.sync.TankArenaMapSnapshotService;
import com.triforge.games.tankarena.sync.TankArenaTileBaselineSync;
import com.triforge.protocol.proto.MapSnapshot;
import com.triforge.protocol.proto.MatchPhaseUpdate;
import com.triforge.protocol.proto.MatchResult;
import com.triforge.protocol.proto.RoomLobbySnapshot;
import io.netty.channel.Channel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

/** Tank Arena gameplay: ECS simulation, lobby/match flow, and tank-specific rules. */
public final class TankArenaGame implements Game {
    private static final Logger logger = LoggerFactory.getLogger(TankArenaGame.class);

    static final int RESPAWN_DELAY_TICKS = 180;

    private RoomHost host;
    private final GameMap gameMap;
    private final MapConfig mapConfig;
    private final WorldBounds worldBounds;
    private final float defaultSpawnX;
    private final float defaultSpawnY;
    private final RoomVisionState visionState;
    private final FogOfWarCalculator fogOfWarCalculator;
    private final MatchHeadquarters matchHeadquarters;
    private final CollisionSystem collisionSystem;
    private final SpawnRegionResolver spawnResolver = new SpawnRegionResolver();
    private final MatchStatsTracker statsTracker = new MatchStatsTracker();
    private TankArenaMatchController matchController = new TankArenaMatchController(MatchConfig.defaults());
    private final DeltaService deltaService = new StandardDeltaService();
    private final TankArenaInterestFilter interestFilter;
    private final RoomInputProcessor inputProcessor = new RoomInputProcessor();

    private volatile boolean skipLobby = false;

    private final EntityManager entityManager;
    private final ComponentManager componentManager;
    private final SystemScheduler systemScheduler;

    private final Map<Long, Entity> playerEntities = new ConcurrentHashMap<>();
    private final Map<Long, String> playerNames = new ConcurrentHashMap<>();
    private final Map<Long, PendingRespawn> pendingRespawns = new ConcurrentHashMap<>();
    private final List<TileChange> pendingTileChanges = new ArrayList<>();
    private final List<TileChange> pendingHqTileChanges = new ArrayList<>();

    public TankArenaGame(GameMap gameMap) {
        this.gameMap = Objects.requireNonNull(gameMap, "gameMap");
        this.mapConfig = MapConfig.DEFAULT;
        this.worldBounds = WorldBounds.fromMap(gameMap);
        this.defaultSpawnX = gameMap.tileCenterX(gameMap.width() / 2);
        this.defaultSpawnY = gameMap.tileCenterY(Math.max(1, gameMap.height() / 4));
        this.visionState = new RoomVisionState(gameMap);
        this.interestFilter = new TankArenaInterestFilter(visionState, gameMap, mapConfig);
        this.deltaService.bindTileSync(new TankArenaTileBaselineSync());
        this.fogOfWarCalculator = new FogOfWarCalculator(gameMap, mapConfig, visionState);
        this.matchHeadquarters = new MatchHeadquarters(gameMap);
        EcsWorld ecsWorld = new EcsWorld();
        this.entityManager = ecsWorld.entityManager();
        this.componentManager = ecsWorld.componentManager();
        this.collisionSystem = new CollisionSystem(
                gameMap,
                matchHeadquarters,
                this::handleTankHit,
                this::handleHqHit
        );
        this.systemScheduler = new SystemScheduler()
                .add(new MovementSystem(gameMap))
                .add(new WorldBoundsCollisionSystem(worldBounds))
                .add(new MapCollisionSystem(gameMap, mapConfig))
                .add(new TankTankCollisionSystem())
                .add(new ShootingSystem(worldBounds, this::onBulletFired))
                .add(collisionSystem)
                .add(new FogOfWarSystem(fogOfWarCalculator));
    }

    @Override
    public void bind(RoomHost host) {
        this.host = Objects.requireNonNull(host, "host");
    }

    private RoomHost host() {
        if (host == null) {
            throw new IllegalStateException("TankArenaGame not bound to a room host");
        }
        return host;
    }

    public float defaultSpawnX() {
        return defaultSpawnX;
    }

    public float defaultSpawnY() {
        return defaultSpawnY;
    }

    public GameMap gameMap() {
        return gameMap;
    }

    public MapConfig mapConfig() {
        return mapConfig;
    }

    public RoomVisionState visionState() {
        return visionState;
    }

    @Override
    public EntityManager entityManager() {
        return entityManager;
    }

    @Override
    public ComponentManager componentManager() {
        return componentManager;
    }

    @Override
    public DeltaService deltaService() {
        return deltaService;
    }

    @Override
    public EntitySnapshotWriter snapshotWriter() {
        return TankArenaSnapshotWriter.INSTANCE;
    }

    @Override
    public InterestFilter interestFilter() {
        return interestFilter;
    }

    @Override
    public MapSnapshot toMapSnapshot() {
        return TankArenaMapSnapshotService.toProto(gameMap);
    }

    @Override
    public RoomLobbySnapshot toLobbySnapshot(RoomHost host) {
        return matchController.toLobbySnapshot(host.roomId(), host.roomName());
    }

    @Override
    public MatchResult toMatchResult(MatchController matchController) {
        return MatchResult.newBuilder()
                .setWinningTeam(MatchProtoMapper.toProto(statsTracker.winningTeam()))
                .setRedScore(statsTracker.teamKills(Team.RED))
                .setBlueScore(statsTracker.teamKills(Team.BLUE))
                .addAllStats(statsTracker.toProtoStats())
                .setMatchDurationMs(matchController.config().matchDurationMs())
                .build();
    }

    @Override
    public TankArenaMatchController matchController() {
        return matchController;
    }

    @Override
    public MatchPhase matchPhase() {
        return matchController.phase();
    }

    @Override
    public Game skipLobby(boolean skip) {
        this.skipLobby = skip;
        return this;
    }

    @Override
    public Game matchConfig(MatchConfig config) {
        this.matchController = new TankArenaMatchController(config);
        return this;
    }

    @Override
    public void stop() {
        inputProcessor.clear();
        entityManager.clear();
        componentManager.clear();
        systemScheduler.clear();
        playerEntities.clear();
        playerNames.clear();
        pendingRespawns.clear();
        visionState.clear();
    }

    private boolean gameplayActive() {
        return skipLobby || (matchController.phase() == MatchPhase.PLAYING && matchController.matchTicksRemaining() > 0);
    }

    @Override
    public void handleJoinRequest(String requestedName, Channel channel) {
        if (matchController.phase() == MatchPhase.PLAYING) {
            rejectJoinDuringMatch(channel);
            return;
        }

        long playerId = host().sessions().nextPlayerId();
        String displayName = LobbyPlayer.isValidName(requestedName) ? requestedName.trim() : ("Player-" + playerId);
        boolean isHost = matchController.playerCount() == 0;

        matchController.putPlayer(LobbyPlayer.joining(playerId, displayName, isHost));
        if (isHost) {
            matchController.setHostPlayerId(playerId);
        }
        host().sessions().register(playerId, channel);
        host().sessions().setDisplayName(playerId, displayName);
        JoinResponse response = host().broadcaster().joinResponseBuilder(
                playerId,
                this,
                matchController.toLobbySnapshot(host().roomId(), host().roomName())
        ).build();
        host().broadcaster().sendJoinResponse(channel, response);
        host().broadcaster().broadcastLobbySnapshot(host(), this);
        host().notifyPlayerJoined(playerId);
        logger.info("Player '{}' joined lobby of room '{}' as playerId={} (host={})",
                displayName, host().roomId(), playerId, isHost);
    }

    @Override
    public void handleLeaveRequest(long playerId) {
        host().sessions().unregister(playerId);
        matchController.removePlayer(playerId);
        destroyPlayerEntity(playerId);
        inputProcessor.remove(playerId);
        playerNames.remove(playerId);
        pendingRespawns.remove(playerId);
        visionState.removePlayer(playerId);
        host().broadcaster().broadcastLobbySnapshot(host(), this);
    }

    @Override
    public void handleLobbyCommand(long playerId, LobbyCommand command) {
        if (command.getActionCase() == LobbyCommand.ActionCase.STARTMATCH) {
            handleStartRequest(playerId);
            return;
        }

        LobbyCommandOutcome outcome = switch (command.getActionCase()) {
            case SETNAME -> matchController.setDisplayName(playerId, command.getSetName().getDisplayName());
            case SETTEAM -> matchController.setTeam(playerId, MatchProtoMapper.toDomain(command.getSetTeam().getTeam()));
            case SETSPAWN -> matchController.setSpawnRegion(playerId,
                    MatchProtoMapper.toDomain(command.getSetSpawn().getRegion()));
            case SETTEAMSETUP -> {
                var setup = command.getSetTeamSetup();
                yield matchController.setTeamSetup(
                        playerId,
                        MatchProtoMapper.toDomain(setup.getSpawnRegion()),
                        MatchProtoMapper.toDomain(setup.getHqRegion()));
            }
            case SETREADY -> matchController.setReady(playerId, command.getSetReady().getReady());
            case STARTMATCH, ACTION_NOT_SET -> LobbyCommandOutcome.reject(LobbyRejectReason.NOT_IN_LOBBY_PHASE);
        };

        if (outcome.applied()) {
            if (command.getActionCase() == LobbyCommand.ActionCase.SETNAME) {
                host().sessions().setDisplayName(playerId, matchController.player(playerId).displayName());
            }
            if (command.getActionCase() == LobbyCommand.ActionCase.SETTEAMSETUP
                    || command.getActionCase() == LobbyCommand.ActionCase.SETSPAWN) {
                applyConfiguredHeadquarters();
                host().broadcaster().broadcastMapSnapshot(this);
            }
            host().broadcaster().broadcastLobbySnapshot(host(), this);
            if (matchController.canStartMatch()) {
                beginCountdown();
            }
        } else {
            logger.debug("Rejected lobby command {} from playerId={} in room '{}' (phase={}, reason={})",
                    command.getActionCase(), playerId, host().roomId(),
                    matchController.phase(), outcome.reason());
            host().broadcaster().sendTo(playerId, GameMessage.newBuilder()
                    .setLobbyCommandRejected(com.triforge.protocol.proto.LobbyCommandRejected.newBuilder()
                            .setPlayerId(playerId)
                            .setReason(MatchProtoMapper.toProto(outcome.reason()))
                            .build())
                    .build());
        }
    }

    private void handleStartRequest(long playerId) {
        if (matchController.isHost(playerId) && matchController.canStartMatch()) {
            beginCountdown();
        } else {
            logger.debug("Ignored start request from playerId={} in room '{}' (host={}, canStart={})",
                    playerId, host().roomId(), matchController.isHost(playerId), matchController.canStartMatch());
        }
    }

    private void beginCountdown() {
        matchController.startCountdown();
        host().broadcaster().broadcastLobbySnapshot(host(), this);
        host().broadcaster().broadcastGameEvent(matchLifecycleEvent(GameEventType.MATCH_COUNTDOWN));
        host().broadcaster().broadcastMatchPhaseUpdate(matchController, this);
        logger.info("Room '{}' entering countdown ({} players)", host().roomId(), matchController.playerCount());
    }

    @Override
    public void tickCountdownPhase() {
        int before = matchController.countdownSecondsRemaining();
        matchController.tickCountdown();
        int after = matchController.countdownSecondsRemaining();
        if (after != before && after > 0) {
            host().broadcaster().broadcastMatchPhaseUpdate(matchController, this);
        }
        if (matchController.countdownTicksRemaining() == 0) {
            startMatch();
        }
    }

    private void startMatch() {
        matchController.startMatch();
        applyConfiguredHeadquarters();
        spawnLobbyPlayers();
        host().broadcaster().broadcastGameEvent(matchLifecycleEvent(GameEventType.MATCH_STARTED));
        host().broadcaster().broadcastMatchPhaseUpdate(matchController, this);
        host().broadcaster().broadcastFullSnapshot(this, host().currentTick());
        host().notifyMatchStarted();
        deltaService.syncBaseline(this);
        logger.info("Match started in room '{}' ({} players)", host().roomId(), matchController.playerCount());
    }

    private void spawnLobbyPlayers() {
        for (LobbyPlayer player : matchController.players()) {
            SpawnRegion region = matchController.spawnRegionForPlayer(player);
            SpawnRegionResolver.SpawnPoint spawn = spawnResolver.resolve(gameMap, region, mapConfig);
            Entity tank = spawnPlayerTank(
                    player.playerId(),
                    player.displayName(),
                    PlayerComponent.DEFAULT_LIVES,
                    spawn.x(),
                    spawn.y(),
                    player.team());
            playerNames.put(player.playerId(), player.displayName());
            statsTracker.register(player.playerId(), player.displayName(), player.team());
            recomputePlayerVision(player.playerId(), tank);
        }
    }

    @Override
    public void tickMatchTimer() {
        matchController.tickMatch();
        if (matchController.matchTicksRemaining() % TankArenaMatchController.TICKS_PER_SECOND == 0) {
            host().broadcaster().broadcastMatchPhaseUpdate(matchController, this);
        }
        if (matchController.matchTimeExpired()) {
            endMatch();
        }
    }

    private void endMatch() {
        endMatch(null);
    }

    private void endMatch(Team hqWinner) {
        if (matchController.phase() != MatchPhase.PLAYING) {
            return;
        }
        if (hqWinner != null && hqWinner.isPlayable()) {
            statsTracker.setWinnerOverride(hqWinner);
        }
        matchController.endMatch();
        despawnAllEntities();
        host().broadcaster().broadcastGameEvent(matchLifecycleEvent(GameEventType.MATCH_ENDED));
        host().broadcaster().broadcastMatchPhaseUpdate(matchController, this);
        host().broadcaster().broadcastMatchResult(matchController, this);
        logger.info("Match ended in room '{}' (winner={})", host().roomId(), statsTracker.winningTeam());
    }

    @Override
    public void tickScoreboardPhase() {
        matchController.tickScoreboard();
        if (matchController.scoreboardFinished()) {
            returnToLobby();
        }
    }

    private void returnToLobby() {
        matchController.returnToLobby();
        statsTracker.reset();
        host().broadcaster().broadcastLobbySnapshot(host(), this);
        host().broadcaster().broadcastMatchPhaseUpdate(matchController, this);
        logger.info("Room '{}' returned to lobby", host().roomId());
    }

    private void despawnAllEntities() {
        playerEntities.clear();
        pendingRespawns.clear();
        inputProcessor.clear();
        entityManager.clear();
        componentManager.clear();
        deltaService.syncBaseline(this);
    }

    @Override
    public void queueInputCommand(long playerId, InputCommand input) {
        if (!gameplayActive()) {
            return;
        }
        inputProcessor.queue(playerId, input);
    }

    public Entity spawnPlayerTank(long playerId, String playerName) {
        return spawnPlayerTank(playerId, playerName, PlayerComponent.DEFAULT_LIVES);
    }

    public Entity spawnPlayerTank(long playerId, String playerName, int lives) {
        return spawnPlayerTank(playerId, playerName, lives, defaultSpawnX, defaultSpawnY, Team.NONE);
    }

    public Entity spawnPlayerTank(long playerId, String playerName, int lives, float x, float y, Team team) {
        Entity tank = TankEntityFactory.tank(entityManager, componentManager)
                .at(x, y)
                .direction(Direction.UP)
                .player(playerId, playerName, lives, team)
                .withInput()
                .controllable()
                .onTerrain(gameMap)
                .vision(mapConfig, gameMap.tileSize())
                .build();
        playerEntities.put(playerId, tank);
        return tank;
    }

    private void recomputePlayerVision(long playerId, Entity tank) {
        PositionComponent position = componentManager.get(tank, PositionComponent.class);
        VisionComponent vision = componentManager.get(tank, VisionComponent.class);
        if (position != null && vision != null) {
            fogOfWarCalculator.recomputePlayer(playerId, position, vision);
        }
    }

    public Entity playerEntity(long playerId) {
        return playerEntities.get(playerId);
    }

    @Override
    public long playerEntityId(long playerId) {
        Entity entity = playerEntities.get(playerId);
        return entity != null ? entity.id() : -1L;
    }

    private void rejectJoinDuringMatch(Channel channel) {
        JoinResponse response = host().broadcaster().rejectedJoinResponseBuilder(
                matchController.toLobbySnapshot(host().roomId(), host().roomName())
        ).build();
        host().broadcaster().sendJoinResponse(channel, response);
        logger.info("Rejected join to room '{}' — match in progress", host().roomId());
    }

    private void destroyPlayerEntity(long playerId) {
        Entity entity = playerEntities.remove(playerId);
        if (entity == null) {
            return;
        }
        entityManager.destroy(entity);
        deltaService.removeEntity(entity.id());
        logger.info("Cleaned up player entity {} (playerId={}) from room '{}'", entity.id(), playerId, host().roomId());
    }

    private void killPlayerTank(long playerId, Entity tank) {
        CanControlComponent control = componentManager.get(tank, CanControlComponent.class);
        if (control != null) {
            control.setControllable(false);
        }
        playerEntities.remove(playerId);
        entityManager.destroy(tank);
        deltaService.removeEntity(tank.id());
        logger.info("Player tank destroyed: entityId={}, playerId={}, room='{}'", tank.id(), playerId, host().roomId());
    }

    private void handleTankHit(CollisionSystem.TankHit hit) {
        long victimId = hit.playerId();
        long shooterId = resolvePlayerIdByEntity(hit.shooterEntityId());
        Team victimTeam = teamOf(hit.tank());

        killPlayerTank(victimId, hit.tank());
        long tick = host().currentTick();
        statsTracker.recordDamage(shooterId, victimId, tick);
        List<Long> assistIds = statsTracker.recordKill(shooterId, victimId, tick);
        host().broadcaster().broadcastGameEvent(playerEvent(
                GameEventType.PLAYER_DEATH,
                victimId,
                hit.tank().id(),
                hit.livesRemaining(),
                shooterId > 0 ? shooterId : 0L,
                assistIds));

        if (hit.livesRemaining() > 0) {
            pendingRespawns.put(victimId, new PendingRespawn(
                    tick + RESPAWN_DELAY_TICKS,
                    playerNames.get(victimId),
                    hit.livesRemaining(),
                    respawnRegionFor(victimId),
                    victimTeam
            ));
        }
    }

    private void handleHqHit(CollisionSystem.HqHit hit) {
        GameEvent.Builder builder = gameEventBuilder(
                hit.destroyed() ? GameEventType.HQ_DESTROYED : GameEventType.HQ_DAMAGED)
                .setLivesRemaining(hit.hpRemaining());
        if (hit.victimTeam().isPlayable()) {
            builder.setTeam(MatchProtoMapper.toProto(hit.victimTeam()));
        }
        host().broadcaster().broadcastGameEvent(builder.build());
        if (hit.destroyed()) {
            clearHeadquartersTiles(hit.victimTeam(), pendingHqTileChanges);
            endMatch(hit.shooterTeam());
        }
    }

    private void clearHeadquartersTiles(Team team, List<TileChange> out) {
        for (HeadquartersDefinition hq : gameMap.headquarters()) {
            if (hq.team() != team) {
                continue;
            }
            for (int tileY = hq.minTileY(); tileY <= hq.maxTileY(); tileY++) {
                for (int tileX = hq.minTileX(); tileX <= hq.maxTileX(); tileX++) {
                    if (gameMap.setTile(tileX, tileY, TileType.EMPTY)) {
                        out.add(TileChange.newBuilder()
                                .setX(tileX)
                                .setY(tileY)
                                .setTile(com.triforge.protocol.proto.TileType.EMPTY)
                                .build());
                    }
                }
            }
        }
    }

    private void onBulletFired(long shooterEntityId) {
        statsTracker.recordShotFired(resolvePlayerIdByEntity(shooterEntityId));
    }

    private long resolvePlayerIdByEntity(long entityId) {
        PlayerComponent player = componentManager.get(entityId, PlayerComponent.class);
        return player != null ? player.playerId() : -1L;
    }

    private Team teamOf(Entity tank) {
        PlayerComponent player = componentManager.get(tank, PlayerComponent.class);
        return player != null ? player.team() : Team.NONE;
    }

    private SpawnRegion respawnRegionFor(long playerId) {
        LobbyPlayer lobbyPlayer = matchController.player(playerId);
        return lobbyPlayer != null
                ? matchController.spawnRegionForPlayer(lobbyPlayer)
                : SpawnRegion.UNSPECIFIED;
    }

    private void applyConfiguredHeadquarters() {
        gameMap.clearTeamHeadquarters(Team.RED);
        gameMap.clearTeamHeadquarters(Team.BLUE);
        for (TeamSetup setup : matchController.teamSetups()) {
            if (setup.isComplete()) {
                gameMap.replaceTeamHeadquarters(
                        HqPlacement.forCorner(gameMap, setup.team(), setup.hqRegion()));
            }
        }
        matchHeadquarters.syncFromMap(gameMap);
    }

    private void processRespawns(long tick) {
        Iterator<Map.Entry<Long, PendingRespawn>> iterator = pendingRespawns.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<Long, PendingRespawn> entry = iterator.next();
            if (tick < entry.getValue().respawnAtTick()) {
                continue;
            }
            iterator.remove();

            long playerId = entry.getKey();
            if (!host().sessions().isConnected(playerId)) {
                continue;
            }

            String playerName = entry.getValue().playerName();
            if (playerName == null) {
                playerName = "Player-" + playerId;
            }

            PendingRespawn respawn = entry.getValue();
            SpawnRegionResolver.SpawnPoint spawn = spawnResolver.resolve(gameMap, respawn.spawnRegion(), mapConfig);
            Entity tank = spawnPlayerTank(playerId, playerName, respawn.livesRemaining(),
                    spawn.x(), spawn.y(), respawn.team());
            recomputePlayerVision(playerId, tank);
            host().broadcaster().broadcastGameEvent(playerEvent(
                    GameEventType.PLAYER_RESPAWN, playerId, tank.id(), respawn.livesRemaining(), 0L, List.of()));
            logger.info("Respawned playerId={} as entityId={} in room '{}'", playerId, tank.id(), host().roomId());
        }
    }

    @Override
    public void onTick(long tick) {
        if (gameplayActive()) {
            inputProcessor.process(playerEntities, componentManager);
            runSystemsUpdate(tick);
            pendingTileChanges.clear();
            collisionSystem.drainTileChanges(pendingTileChanges);
            pendingTileChanges.addAll(pendingHqTileChanges);
            pendingHqTileChanges.clear();
            processRespawns(tick);
            host().broadcaster().broadcastStateSync(this, tick, pendingTileChanges);
        } else if (matchController.phase() == MatchPhase.COUNTDOWN) {
            tickCountdownPhase();
        } else if (matchController.phase() == MatchPhase.ENDED) {
            tickScoreboardPhase();
        }
        if (matchController.phase() == MatchPhase.PLAYING) {
            tickMatchTimer();
        }
    }

    private void runSystemsUpdate(long tick) {
        try {
            systemScheduler.update(tick, entityManager, componentManager);
        } catch (Exception e) {
            logger.error("Error executing ECS systems update on room '{}' tick {}", host().roomId(), tick, e);
        }
    }

    @Override
    public void viewerPosition(long playerId, float[] out) {
        out[0] = defaultSpawnX;
        out[1] = defaultSpawnY;

        Entity entity = playerEntities.get(playerId);
        if (entity == null) {
            return;
        }
        PositionComponent position = componentManager.get(entity, PositionComponent.class);
        if (position == null) {
            return;
        }
        out[0] = position.x();
        out[1] = position.y();
    }

    @Override
    public void enrichMatchPhaseUpdate(MatchPhaseUpdate.Builder builder, MatchController matchController) {
        builder.setRedHqHp(headquartersHp(Team.RED));
        builder.setBlueHqHp(headquartersHp(Team.BLUE));
    }

    private int headquartersHp(Team team) {
        return matchHeadquarters.hp(team);
    }

    private GameEvent matchLifecycleEvent(GameEventType type) {
        return gameEventBuilder(type).build();
    }

    private GameEvent playerEvent(
            GameEventType type,
            long playerId,
            long entityId,
            int livesRemaining,
            long killerPlayerId,
            List<Long> assistPlayerIds
    ) {
        GameEvent.Builder builder = gameEventBuilder(type)
                .setPlayerId(playerId)
                .setEntityId(entityId)
                .setLivesRemaining(livesRemaining);
        if (killerPlayerId > 0) {
            builder.setKillerPlayerId(killerPlayerId);
        }
        if (assistPlayerIds != null && !assistPlayerIds.isEmpty()) {
            builder.addAllAssistPlayerIds(assistPlayerIds);
        }
        return builder.build();
    }

    private GameEvent.Builder gameEventBuilder(GameEventType type) {
        return GameEvent.newBuilder()
                .setType(type)
                .setTick(host().currentTick());
    }

    private record PendingRespawn(long respawnAtTick, String playerName, int livesRemaining,
                                  SpawnRegion spawnRegion, Team team) {
    }
}
