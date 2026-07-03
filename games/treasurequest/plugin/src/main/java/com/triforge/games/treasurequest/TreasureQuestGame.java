package com.triforge.games.treasurequest;

import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EcsWorld;
import com.triforge.engine.ecs.Entity;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.ecs.SystemScheduler;
import com.triforge.engine.game.Game;
import com.triforge.engine.match.MatchConfig;
import com.triforge.engine.match.MatchController;
import com.triforge.engine.loop.GameLoop;
import com.triforge.engine.match.MatchPhase;
import com.triforge.engine.match.MatchPhaseMachine;
import com.triforge.engine.room.RoomHost;
import com.triforge.engine.snapshot.EntitySnapshotWriter;
import com.triforge.engine.sync.DeltaService;
import com.triforge.engine.sync.InterestFilter;
import com.triforge.engine.sync.PassThroughInterestFilter;
import com.triforge.engine.sync.StandardDeltaService;
import com.triforge.games.treasurequest.components.PositionComponent;
import com.triforge.games.treasurequest.components.QuestAvatarComponent;
import com.triforge.games.treasurequest.pvp.DuelManager;
import com.triforge.games.treasurequest.pvp.EncounterDetector;
import com.triforge.games.treasurequest.pvp.EncounterManager;
import com.triforge.games.treasurequest.pvp.EncounterManager.AvatarView;
import com.triforge.games.treasurequest.checkpoint.CheckpointState;
import com.triforge.games.treasurequest.checkpoint.CheckpointZoneDetector;
import com.triforge.games.treasurequest.content.Checkpoint;
import com.triforge.games.treasurequest.content.ContentSource;
import com.triforge.games.treasurequest.content.QuestContent;
import com.triforge.games.treasurequest.content.QuestMap;
import com.triforge.games.treasurequest.content.Rect;
import com.triforge.games.treasurequest.content.TreasureQuestContentStore;
import com.triforge.games.treasurequest.entities.AvatarEntityFactory;
import com.triforge.games.treasurequest.input.RoomInputProcessor;
import com.triforge.games.treasurequest.items.Inventory;
import com.triforge.games.treasurequest.items.ItemEffects;
import com.triforge.games.treasurequest.items.ItemUseValidator;
import com.triforge.games.treasurequest.items.QuestItemType;
import com.triforge.games.treasurequest.quiz.QuizPromptBuilder;
import com.triforge.games.treasurequest.quiz.QuizScorer;
import com.triforge.games.treasurequest.quiz.QuizSession;
import com.triforge.games.treasurequest.scoring.ComboStreak;
import com.triforge.games.treasurequest.scoring.Leaderboard;
import com.triforge.games.treasurequest.scoring.PowerCalculator;
import com.triforge.games.treasurequest.state.ExpeditionState;
import com.triforge.games.treasurequest.sync.QuestMapSnapshotService;
import com.triforge.games.treasurequest.systems.MapCollisionSystem;
import com.triforge.games.treasurequest.systems.MovementSystem;
import com.triforge.games.treasurequest.systems.WorldBoundsCollisionSystem;
import com.triforge.games.treasurequest.world.WorldBounds;
import com.triforge.protocol.proto.GameEvent;
import com.triforge.protocol.proto.GameEventType;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.InputCommand;
import com.triforge.protocol.proto.ItemType;
import com.triforge.protocol.proto.JoinResponse;
import com.triforge.protocol.proto.InventoryUpdate;
import com.triforge.protocol.proto.ItemUse;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.MapSnapshot;
import com.triforge.protocol.proto.MatchResult;
import com.triforge.protocol.proto.ChallengeResponse;
import com.triforge.protocol.proto.DuelSubmit;
import com.triforge.protocol.proto.ExpeditionComplete;
import com.triforge.protocol.proto.HintReveal;
import com.triforge.protocol.proto.PlayerStateUpdate;
import com.triforge.protocol.proto.QuizOutcome;
import com.triforge.protocol.proto.QuizPrompt;
import com.triforge.protocol.proto.QuizResult;
import com.triforge.protocol.proto.QuizSubmit;
import com.triforge.protocol.proto.RoomLobbySnapshot;
import com.triforge.protocol.proto.TreasureQuestMessage;
import io.netty.channel.Channel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

/**
 * TreasureQuest gameplay: lobby + match phases, avatar movement on the quest map, and snapshot sync.
 * Checkpoints, quizzes, and PvP are layered on in later tasks (see plan-001).
 */
public final class TreasureQuestGame implements Game {

    private static final Logger logger = LoggerFactory.getLogger(TreasureQuestGame.class);

    private RoomHost host;
    private final TreasureQuestLobby lobby = new TreasureQuestLobby();
    private MatchPhaseMachine matchPhase = new MatchPhaseMachine(MatchConfig.defaults());
    private final QuestContent content;
    private final QuestMap questMap;
    private final WorldBounds worldBounds;
    private final float defaultSpawnX;
    private final float defaultSpawnY;
    private final String startCheckpointId;
    private final EcsWorld ecsWorld = new EcsWorld();
    private final DeltaService deltaService = new StandardDeltaService();
    private final RoomInputProcessor inputProcessor = new RoomInputProcessor();
    private final SystemScheduler systemScheduler;
    private final CheckpointZoneDetector zoneDetector;
    private final EncounterDetector encounterDetector;
    private final DuelManager duelManager;
    private final EncounterManager encounterManager;

    private final Map<Long, Entity> playerEntities = new ConcurrentHashMap<>();
    private final Map<Long, CheckpointState> checkpointStates = new ConcurrentHashMap<>();
    private final Map<Long, QuizSession> activeQuizSessions = new ConcurrentHashMap<>();
    private final Map<Long, ExpeditionState> expeditionStates = new ConcurrentHashMap<>();
    private final Map<Long, Inventory> inventories = new ConcurrentHashMap<>();
    private final Map<Long, ComboStreak> comboStreaks = new ConcurrentHashMap<>();
    private List<Leaderboard.Entry> lastLeaderboardEntries = List.of();

    public TreasureQuestGame() {
        this(TreasureQuestContentStore.current());
    }

    TreasureQuestGame(QuestContent content) {
        this.content = Objects.requireNonNull(content, "content");
        this.questMap = content.map();
        this.worldBounds = WorldBounds.fromMap(questMap);
        this.startCheckpointId = questMap.checkpoints().start().id();
        Rect startZone = questMap.checkpoints().start().zone();
        this.defaultSpawnX = startZone.centerWorldX(questMap.tileSize());
        this.defaultSpawnY = startZone.centerWorldY(questMap.tileSize());
        this.systemScheduler = new SystemScheduler()
                .add(new MovementSystem())
                .add(new WorldBoundsCollisionSystem(worldBounds))
                .add(new MapCollisionSystem(questMap));
        this.zoneDetector = new CheckpointZoneDetector(questMap);
        this.encounterDetector = new EncounterDetector(content.config(), questMap.tileSize());
        this.duelManager = new DuelManager(content.quizzes(), content.config(), this::playerPower);
        this.encounterManager = new EncounterManager(encounterDetector, duelManager);
    }

    boolean playerInDuel(long playerId) {
        QuestAvatarComponent avatar = avatarFor(playerId);
        return avatar != null && avatar.inDuel();
    }

    boolean playerShielded(long playerId) {
        QuestAvatarComponent avatar = avatarFor(playerId);
        return avatar != null && avatar.shielded();
    }

    boolean playerPvpCooldown(long playerId) {
        QuestAvatarComponent avatar = avatarFor(playerId);
        return avatar != null && avatar.pvpCooldown();
    }

    boolean playerStealImmune(long playerId) {
        QuestAvatarComponent avatar = avatarFor(playerId);
        return avatar != null && avatar.stealImmune();
    }

    void grantItemForTest(long playerId, ItemType item, int count) {
        inventories.computeIfAbsent(playerId, ignored -> Inventory.empty()).grant(item, count);
    }

    void setPlayerShielded(long playerId, boolean shielded) {
        QuestAvatarComponent avatar = avatarFor(playerId);
        if (avatar == null) {
            return;
        }
        if (shielded) {
            long until = host().currentTick() + protectionDurationTicks(content.config().shieldSecs());
            avatar.grantShieldUntil(until);
            avatar.refreshProtection(host().currentTick());
        } else {
            avatar.grantShieldUntil(0);
            avatar.refreshProtection(host().currentTick());
        }
    }

    void setPlayerScore(long playerId, int score) {
        QuestAvatarComponent avatar = avatarFor(playerId);
        if (avatar != null) {
            avatar.setScore(score);
        }
    }

    DuelManager duelManager() {
        return duelManager;
    }

    CheckpointState checkpointState(long playerId) {
        return checkpointStates.getOrDefault(playerId, CheckpointState.UNAVAILABLE);
    }

    int playerScore(long playerId) {
        QuestAvatarComponent avatar = avatarFor(playerId);
        return avatar != null ? avatar.score() : 0;
    }

    int playerPower(long playerId) {
        return PowerCalculator.compute(
                playerScore(playerId),
                inventories.get(playerId),
                comboStreak(playerId).value(),
                content.config());
    }

    ComboStreak comboStreak(long playerId) {
        return comboStreaks.computeIfAbsent(playerId, ignored -> new ComboStreak());
    }

    int playerCheckpointsCleared(long playerId) {
        QuestAvatarComponent avatar = avatarFor(playerId);
        return avatar != null ? avatar.checkpointsCleared() : 0;
    }

    String currentCheckpoint(long playerId) {
        QuestAvatarComponent avatar = avatarFor(playerId);
        return avatar != null ? avatar.currentCheckpoint() : "";
    }

    boolean bossCleared(long playerId) {
        ExpeditionState expedition = expeditionStates.get(playerId);
        return expedition != null && expedition.bossCleared();
    }

    void teleportAvatar(long playerId, float x, float y) {
        Entity entity = playerEntities.get(playerId);
        if (entity == null) {
            return;
        }
        PositionComponent position = componentManager().get(entity, PositionComponent.class);
        if (position != null) {
            position.set(x, y);
        }
        refreshExpeditionZones(playerId);
    }

    QuestMap questMap() {
        return questMap;
    }

    @Override
    public void bind(RoomHost host) {
        this.host = Objects.requireNonNull(host, "host");
    }

    private RoomHost host() {
        if (host == null) {
            throw new IllegalStateException("TreasureQuestGame not bound to a room host");
        }
        return host;
    }

    @Override
    public void stop() {
        inputProcessor.clear();
        playerEntities.clear();
        checkpointStates.clear();
        activeQuizSessions.clear();
        expeditionStates.clear();
        inventories.clear();
        comboStreaks.clear();
        lastLeaderboardEntries = List.of();
        encounterManager.clear();
        duelManager.clear();
        ecsWorld.entityManager().clear();
        ecsWorld.componentManager().clear();
    }

    @Override
    public void onTick(long tick) {
        if (matchPhase.phase() == MatchPhase.PLAYING) {
            inputProcessor.process(playerEntities, componentManager());
            runSystemsUpdate(tick);
            refreshAvatarProtection(tick);
            refreshExpeditionLocks(tick);
            updateCheckpointZones();
            expireQuizSessions(tick);
            updateEncounters(tick);
            checkTreasureWin();
            host().broadcaster().broadcastStateSync(this, tick, Collections.emptyList());
            tickMatchTimer();
        } else if (matchPhase.phase() == MatchPhase.COUNTDOWN) {
            tickCountdownPhase();
        } else if (matchPhase.phase() == MatchPhase.ENDED) {
            tickScoreboardPhase();
        }
    }

    private void runSystemsUpdate(long tick) {
        try {
            systemScheduler.update(tick, entityManager(), componentManager());
        } catch (Exception e) {
            logger.error("Error executing ECS systems update on room '{}' tick {}", host().roomId(), tick, e);
        }
    }

    @Override
    public void handleJoinRequest(String requestedName, Channel channel) {
        if (matchPhase.phase() == MatchPhase.PLAYING) {
            JoinResponse response = host().broadcaster()
                    .rejectedJoinResponseBuilder(toLobbySnapshot(host()))
                    .build();
            host().broadcaster().sendJoinResponse(channel, response);
            return;
        }

        long playerId = host().sessions().nextPlayerId();
        String displayName = TreasureQuestLobby.isValidName(requestedName)
                ? requestedName.trim()
                : TreasureQuestLobby.defaultName(playerId);
        boolean isHost = lobby.playerCount() == 0;

        lobby.addPlayer(playerId, displayName, isHost);
        host().sessions().register(playerId, channel);

        RoomLobbySnapshot snapshot = toLobbySnapshot(host());
        JoinResponse response = host().broadcaster()
                .joinResponseBuilder(playerId, this, snapshot)
                .build();
        host().broadcaster().sendJoinResponse(channel, response);
        host().broadcaster().broadcastLobbySnapshot(host(), this);

        logger.info("Player '{}' joined TreasureQuest room '{}' as playerId={} (host={})",
                displayName, host().roomId(), playerId, isHost);
    }

    @Override
    public void handleLeaveRequest(long playerId) {
        host().sessions().unregister(playerId);
        lobby.removePlayer(playerId);
        destroyPlayerEntity(playerId);
        inputProcessor.remove(playerId);
        checkpointStates.remove(playerId);
        activeQuizSessions.remove(playerId);
        expeditionStates.remove(playerId);
        inventories.remove(playerId);
        comboStreaks.remove(playerId);
        encounterManager.onPlayerLeave(playerId);
        duelManager.onPlayerLeave(playerId);
        host().broadcaster().broadcastLobbySnapshot(host(), this);
    }

    @Override
    public void handleLobbyCommand(long playerId, LobbyCommand command) {
        if (matchPhase.phase() != MatchPhase.LOBBY) {
            return;
        }

        boolean applied = switch (command.getActionCase()) {
            case SETNAME -> lobby.setDisplayName(playerId, command.getSetName().getDisplayName());
            case SETREADY -> lobby.setReady(playerId, command.getSetReady().getReady());
            case STARTMATCH -> {
                if (lobby.isHost(playerId) && lobby.canStartMatch(matchPhase.phase())) {
                    beginCountdown();
                }
                yield false;
            }
            case SETTEAM, SETSPAWN, SETTEAMSETUP, ACTION_NOT_SET -> false;
        };

        if (applied) {
            host().broadcaster().broadcastLobbySnapshot(host(), this);
            if (lobby.canStartMatch(matchPhase.phase()) && lobby.playerCount() >= 2 && lobby.allReady()) {
                beginCountdown();
            }
        }
    }

    @Override
    public void queueInputCommand(long playerId, InputCommand input) {
        if (matchPhase.phase() != MatchPhase.PLAYING) {
            return;
        }
        inputProcessor.queue(playerId, input);
    }

    /** Handles client → server TreasureQuest messages (quiz, duel, items). */
    public void handleTreasureQuestMessage(long playerId, TreasureQuestMessage message) {
        if (matchPhase.phase() != MatchPhase.PLAYING) {
            return;
        }
        switch (message.getContentCase()) {
            case INTERACT -> handleInteract(playerId, message.getInteract());
            case QUIZSUBMIT -> handleQuizSubmit(playerId, message.getQuizSubmit());
            case CHALLENGERESPONSE -> handleChallengeResponse(playerId, message.getChallengeResponse());
            case DUELSUBMIT -> handleDuelSubmit(playerId, message.getDuelSubmit());
            case ITEMUSE -> handleItemUse(playerId, message.getItemUse());
            case QUIZRESULT, HINTREVEAL, ENCOUNTEROFFER, DUELPROMPT, DUELRESULT, INVENTORYUPDATE, LEADERBOARD,
                 EXPEDITIONCOMPLETE, PLAYERSTATEUPDATE, CONTENT_NOT_SET -> {
            }
        }
    }

    @Override
    public EntityManager entityManager() {
        return ecsWorld.entityManager();
    }

    @Override
    public ComponentManager componentManager() {
        return ecsWorld.componentManager();
    }

    @Override
    public DeltaService deltaService() {
        return deltaService;
    }

    @Override
    public EntitySnapshotWriter snapshotWriter() {
        return QuestSnapshotWriter.INSTANCE;
    }

    @Override
    public InterestFilter interestFilter() {
        return PassThroughInterestFilter.INSTANCE;
    }

    @Override
    public MapSnapshot toMapSnapshot() {
        return QuestMapSnapshotService.toProto(questMap);
    }

    @Override
    public RoomLobbySnapshot toLobbySnapshot(RoomHost host) {
        return lobby.toSnapshot(
                host.roomId(),
                host.roomName(),
                matchPhase.phase(),
                lobby.canStartMatch(matchPhase.phase()));
    }

    @Override
    public MatchResult toMatchResult(MatchController matchController) {
        return MatchResult.newBuilder()
                .setMatchDurationMs(matchController.config().matchDurationMs())
                .build();
    }

    @Override
    public MatchController matchController() {
        return matchPhase;
    }

    @Override
    public MatchPhase matchPhase() {
        return matchPhase.phase();
    }

    @Override
    public Game skipLobby(boolean skip) {
        return this;
    }

    @Override
    public Game matchConfig(MatchConfig config) {
        matchPhase = new MatchPhaseMachine(config);
        return this;
    }

    @Override
    public void tickCountdownPhase() {
        int before = matchPhase.countdownSecondsRemaining();
        matchPhase.tickCountdown();
        int after = matchPhase.countdownSecondsRemaining();
        if (after != before && after > 0) {
            host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        }
        if (matchPhase.countdownFinished()) {
            startMatch();
        }
    }

    private void startMatch() {
        matchPhase.startMatch();
        spawnLobbyPlayers();
        host().broadcaster().broadcastGameEvent(lifecycleEvent(GameEventType.MATCH_STARTED));
        host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        host().broadcaster().broadcastFullSnapshot(this, host().currentTick());
        deltaService.syncBaseline(this);
        refreshLeaderboardIfChanged();
        logger.info("TreasureQuest match started in room '{}' ({} players)",
                host().roomId(), lobby.playerCount());
    }

    private void spawnLobbyPlayers() {
        checkpointStates.clear();
        activeQuizSessions.clear();
        expeditionStates.clear();
        inventories.clear();
        comboStreaks.clear();
        lastLeaderboardEntries = List.of();
        encounterManager.clear();
        duelManager.clear();
        int index = 0;
        for (TreasureQuestLobby.Player player : lobby.players()) {
            float offsetX = (index % 2) * questMap.tileSize() * 0.25f;
            float offsetY = (index / 2) * questMap.tileSize() * 0.25f;
            spawnPlayerAvatar(
                    player.playerId(),
                    player.displayName(),
                    defaultSpawnX + offsetX,
                    defaultSpawnY + offsetY);
            expeditionStates.put(player.playerId(), ExpeditionState.start(startCheckpointId));
            inventories.put(player.playerId(), Inventory.empty());
            comboStreaks.put(player.playerId(), new ComboStreak());
            index++;
        }
        updateCheckpointZones();
    }

    Entity spawnPlayerAvatar(long playerId, String displayName, float x, float y) {
        Entity avatar = AvatarEntityFactory.avatar(entityManager(), componentManager())
                .at(x, y)
                .player(playerId, displayName, startCheckpointId)
                .build();
        playerEntities.put(playerId, avatar);
        return avatar;
    }

    @Override
    public void tickMatchTimer() {
        matchPhase.tickMatch();
        if (matchPhase.matchTicksRemaining() % MatchPhaseMachine.TICKS_PER_SECOND == 0) {
            host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        }
        if (matchPhase.matchTimeExpired()) {
            endMatchOnTimeCap();
        }
    }

    private void endMatchOnTimeCap() {
        if (matchPhase.phase() != MatchPhase.PLAYING) {
            return;
        }
        long leaderId = playerEntities.keySet().stream()
                .max(Comparator.comparingInt(this::playerCheckpointsCleared)
                        .thenComparingInt(this::playerPower)
                        .thenComparingInt(this::playerScore))
                .orElse(0L);
        if (leaderId != 0L) {
            QuestAvatarComponent leader = avatarFor(leaderId);
            if (leader != null) {
                broadcastExpeditionComplete(leaderId, leader.name());
            }
        }
        endMatch();
    }

    private void endMatch() {
        if (matchPhase.phase() != MatchPhase.PLAYING) {
            return;
        }
        broadcastFinalLeaderboard();
        matchPhase.endMatch();
        despawnAllEntities();
        host().broadcaster().broadcastGameEvent(lifecycleEvent(GameEventType.MATCH_ENDED));
        host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        host().broadcaster().broadcastMatchResult(matchPhase, this);
        logger.info("TreasureQuest match ended in room '{}'", host().roomId());
    }

    @Override
    public void tickScoreboardPhase() {
        matchPhase.tickScoreboard();
        if (matchPhase.scoreboardFinished()) {
            matchPhase.returnToLobby();
            lobby.resetAllReady();
            host().broadcaster().broadcastLobbySnapshot(host(), this);
            logger.info("TreasureQuest room '{}' returned to lobby", host().roomId());
        }
    }

    private void beginCountdown() {
        matchPhase.startCountdown();
        host().broadcaster().broadcastLobbySnapshot(host(), this);
        host().broadcaster().broadcastGameEvent(lifecycleEvent(GameEventType.MATCH_COUNTDOWN));
        host().broadcaster().broadcastMatchPhaseUpdate(matchPhase, this);
        logger.info("TreasureQuest room '{}' entering countdown ({} players)",
                host().roomId(), lobby.playerCount());
    }

    private void despawnAllEntities() {
        playerEntities.clear();
        checkpointStates.clear();
        activeQuizSessions.clear();
        expeditionStates.clear();
        encounterManager.clear();
        duelManager.clear();
        inputProcessor.clear();
        entityManager().clear();
        componentManager().clear();
        deltaService.syncBaseline(this);
    }

    private void destroyPlayerEntity(long playerId) {
        Entity entity = playerEntities.remove(playerId);
        if (entity == null) {
            return;
        }
        entityManager().destroy(entity);
        deltaService.removeEntity(entity.id());
    }

    private GameEvent lifecycleEvent(GameEventType type) {
        return GameEvent.newBuilder().setType(type).build();
    }

    @Override
    public long playerEntityId(long playerId) {
        Entity entity = playerEntities.get(playerId);
        return entity != null ? entity.id() : -1L;
    }

    @Override
    public void viewerPosition(long playerId, float[] out) {
        out[0] = defaultSpawnX;
        out[1] = defaultSpawnY;

        Entity entity = playerEntities.get(playerId);
        if (entity == null) {
            return;
        }
        PositionComponent position = componentManager().get(entity, PositionComponent.class);
        if (position != null) {
            out[0] = position.x();
            out[1] = position.y();
        }
    }

    private void updateCheckpointZones() {
        for (Map.Entry<Long, Entity> entry : playerEntities.entrySet()) {
            refreshExpeditionZones(entry.getKey());
        }
    }

    private void refreshExpeditionZones(long playerId) {
        Entity entity = playerEntities.get(playerId);
        if (entity == null) {
            return;
        }
        QuestAvatarComponent avatar = componentManager().get(entity, QuestAvatarComponent.class);
        PositionComponent position = componentManager().get(entity, PositionComponent.class);
        if (avatar == null || position == null) {
            return;
        }

        updateBranchSelection(playerId, avatar, position);

        CheckpointState previous = checkpointStates.getOrDefault(playerId, CheckpointState.UNAVAILABLE);
        CheckpointState next = resolveCheckpointState(playerId, avatar, position);
        if (next == previous) {
            return;
        }

        checkpointStates.put(playerId, next);
        if (next == CheckpointState.AVAILABLE) {
            sendPlayerStateUpdate(playerId, avatar);
        }
    }

    private void updateBranchSelection(long playerId, QuestAvatarComponent avatar, PositionComponent position) {
        ExpeditionState expedition = expeditionStates.get(playerId);
        if (expedition == null) {
            return;
        }

        String current = avatar.currentCheckpoint();
        Checkpoint currentCheckpoint = questMap.checkpoints().get(current);
        long tick = host().currentTick();
        if (currentCheckpoint != null
                && expedition.canAttempt(current, currentCheckpoint, tick)
                && zoneDetector.isInCurrentCheckpointZone(
                        questMap.checkpoints(), current, position.x(), position.y())) {
            return;
        }

        for (String checkpointId : expedition.unlockedTargets()) {
            Checkpoint checkpoint = questMap.checkpoints().get(checkpointId);
            if (checkpoint == null) {
                continue;
            }
            if (!zoneDetector.isInCheckpointZone(checkpoint, position.x(), position.y())) {
                continue;
            }
            if (!checkpointId.equals(current)) {
                avatar.setCurrentCheckpoint(checkpointId);
                sendPlayerStateUpdate(playerId, avatar);
            }
            return;
        }
    }

    private CheckpointState resolveCheckpointState(
            long playerId,
            QuestAvatarComponent avatar,
            PositionComponent position
    ) {
        ExpeditionState expedition = expeditionStates.get(playerId);
        Checkpoint checkpoint = questMap.checkpoints().get(avatar.currentCheckpoint());
        long tick = host().currentTick();
        if (expedition == null
                || checkpoint == null
                || !expedition.canAttempt(avatar.currentCheckpoint(), checkpoint, tick)) {
            return CheckpointState.UNAVAILABLE;
        }

        CheckpointState current = checkpointStates.getOrDefault(playerId, CheckpointState.UNAVAILABLE);
        if (current == CheckpointState.OPENED) {
            return zoneDetector.isInCurrentCheckpointZone(
                    questMap.checkpoints(), avatar.currentCheckpoint(), position.x(), position.y())
                    ? CheckpointState.OPENED
                    : CheckpointState.UNAVAILABLE;
        }

        if (!zoneDetector.isInCurrentCheckpointZone(
                questMap.checkpoints(), avatar.currentCheckpoint(), position.x(), position.y())) {
            return CheckpointState.UNAVAILABLE;
        }
        return CheckpointState.AVAILABLE;
    }

    private void handleInteract(long playerId, com.triforge.protocol.proto.InteractCommand command) {
        if (checkpointStates.getOrDefault(playerId, CheckpointState.UNAVAILABLE) != CheckpointState.AVAILABLE) {
            return;
        }

        Entity entity = playerEntities.get(playerId);
        if (entity == null) {
            return;
        }

        QuestAvatarComponent avatar = componentManager().get(entity, QuestAvatarComponent.class);
        PositionComponent position = componentManager().get(entity, PositionComponent.class);
        if (avatar == null || position == null) {
            return;
        }

        String currentId = avatar.currentCheckpoint();
        if (!command.getCheckpointId().isEmpty() && !command.getCheckpointId().equals(currentId)) {
            return;
        }
        ExpeditionState expedition = expeditionStates.get(playerId);
        Checkpoint currentCheckpoint = questMap.checkpoints().get(currentId);
        long tick = host().currentTick();
        if (expedition == null
                || currentCheckpoint == null
                || !expedition.canAttempt(currentId, currentCheckpoint, tick)) {
            return;
        }

        if (!zoneDetector.isInCurrentCheckpointZone(
                questMap.checkpoints(), currentId, position.x(), position.y())) {
            return;
        }

        Checkpoint checkpoint = questMap.checkpoints().get(currentId);
        if (checkpoint == null) {
            return;
        }

        var quiz = content.quizzes().get(checkpoint.quizId());
        if (quiz == null) {
            logger.warn("Missing quiz '{}' for checkpoint '{}' in room '{}'",
                    checkpoint.quizId(), currentId, host().roomId());
            return;
        }

        QuizSession session = QuizSession.start(
                playerId, quiz, checkpoint, host().currentTick(), avatar.speedMultiplier());
        activeQuizSessions.put(playerId, session);
        QuizPrompt prompt = QuizPromptBuilder.build(quiz, checkpoint, session.deadlineTick());
        host().broadcaster().sendTo(playerId, GameMessage.newBuilder()
                .setTq(TreasureQuestMessage.newBuilder().setQuizPrompt(prompt).build())
                .build());

        checkpointStates.put(playerId, CheckpointState.OPENED);
    }

    private void handleQuizSubmit(long playerId, QuizSubmit submit) {
        QuizSession session = activeQuizSessions.get(playerId);
        if (session == null || !session.quizId().equals(submit.getQuizId())) {
            return;
        }
        if (session.isExpired(host().currentTick())) {
            return;
        }

        var quiz = content.quizzes().get(session.quizId());
        if (quiz == null) {
            return;
        }

        completeQuizAttempt(playerId, session, QuizScorer.score(quiz, submit, session, host().currentTick()));
    }

    private void expireQuizSessions(long tick) {
        for (Map.Entry<Long, QuizSession> entry : List.copyOf(activeQuizSessions.entrySet())) {
            QuizSession session = entry.getValue();
            if (!session.isExpired(tick)) {
                continue;
            }
            var quiz = content.quizzes().get(session.quizId());
            if (quiz == null) {
                activeQuizSessions.remove(entry.getKey());
                continue;
            }
            QuizSubmit emptySubmit = QuizSubmit.newBuilder().setQuizId(session.quizId()).build();
            completeQuizAttempt(entry.getKey(), session, QuizScorer.score(quiz, emptySubmit, session, tick));
        }
    }

    private void completeQuizAttempt(long playerId, QuizSession session, QuizScorer.Result result) {
        Entity entity = playerEntities.get(playerId);
        if (entity == null) {
            activeQuizSessions.remove(playerId);
            return;
        }

        QuestAvatarComponent avatar = componentManager().get(entity, QuestAvatarComponent.class);
        PositionComponent position = componentManager().get(entity, PositionComponent.class);
        if (avatar == null) {
            activeQuizSessions.remove(playerId);
            return;
        }

        Checkpoint checkpoint = questMap.checkpoints().get(session.checkpointId());
        if (checkpoint == null) {
            activeQuizSessions.remove(playerId);
            return;
        }

        int pointsEarned = result.pointsEarned();
        QuizOutcome outcome;
        ExpeditionState expedition = expeditionStates.get(playerId);
        if (expedition == null) {
            activeQuizSessions.remove(playerId);
            return;
        }

        if (result.passed()) {
            comboStreak(playerId).onQuizPass();
            int rewardBonus = checkpoint.reward().bonusPoints();
            pointsEarned += rewardBonus;
            avatar.setScore(avatar.score() + pointsEarned);
            avatar.setCheckpointsCleared(avatar.checkpointsCleared() + 1);
            expedition.onCheckpointPassed(checkpoint);
            if (checkpoint.next().size() == 1) {
                avatar.setCurrentCheckpoint(checkpoint.next().getFirst());
            }
            outcome = QuizOutcome.QUIZ_PASS;
            grantQuizShield(avatar, host().currentTick());
            grantRewardItem(playerId, checkpoint.reward().item());
            sendHintReveal(playerId, checkpoint);
            sendPlayerStateUpdate(playerId, avatar);
        } else {
            comboStreak(playerId).onQuizFail();
            outcome = QuizOutcome.QUIZ_FAIL;
        }

        sendQuizResult(playerId, session.quizId(), outcome, result, pointsEarned, avatar.score());
        activeQuizSessions.remove(playerId);
        checkpointStates.put(playerId, resolveCheckpointStateAfterQuiz(playerId, avatar, position, result.passed()));
        refreshLeaderboardIfChanged();
    }

    private CheckpointState resolveCheckpointStateAfterQuiz(
            long playerId,
            QuestAvatarComponent avatar,
            PositionComponent position,
            boolean passed
    ) {
        if (position == null) {
            return CheckpointState.UNAVAILABLE;
        }
        if (passed) {
            refreshExpeditionZones(playerId);
            return checkpointStates.getOrDefault(playerId, CheckpointState.UNAVAILABLE);
        }
        ExpeditionState expedition = expeditionStates.get(playerId);
        Checkpoint checkpoint = questMap.checkpoints().get(avatar.currentCheckpoint());
        if (expedition != null
                && checkpoint != null
                && expedition.canAttempt(avatar.currentCheckpoint(), checkpoint, host().currentTick())
                && zoneDetector.isInCurrentCheckpointZone(
                        questMap.checkpoints(), avatar.currentCheckpoint(), position.x(), position.y())) {
            return CheckpointState.AVAILABLE;
        }
        return CheckpointState.UNAVAILABLE;
    }

    private void checkTreasureWin() {
        for (Map.Entry<Long, Entity> entry : playerEntities.entrySet()) {
            long playerId = entry.getKey();
            ExpeditionState expedition = expeditionStates.get(playerId);
            if (expedition == null || !expedition.treasureAccessible(host().currentTick())) {
                continue;
            }

            QuestAvatarComponent avatar = componentManager().get(entry.getValue(), QuestAvatarComponent.class);
            PositionComponent position = componentManager().get(entry.getValue(), PositionComponent.class);
            if (avatar == null || position == null) {
                continue;
            }

            Rect treasureZone = questMap.treasure().zone();
            if (zoneDetector.avatarOverlapsZone(treasureZone, position.x(), position.y())) {
                completeExpedition(playerId, avatar);
                return;
            }
        }
    }

    private void completeExpedition(long winnerId, QuestAvatarComponent winner) {
        broadcastExpeditionComplete(winnerId, winner.name());
        endMatch();
        logger.info("TreasureQuest expedition complete in room '{}' — winner={} ({})",
                host().roomId(), winnerId, winner.name());
    }

    private void broadcastExpeditionComplete(long winnerId, String winnerName) {
        for (TreasureQuestLobby.Player player : lobby.players()) {
            ExpeditionComplete complete = ExpeditionComplete.newBuilder()
                    .setWinnerPlayerId(winnerId)
                    .setWinnerName(winnerName)
                    .setYouWon(player.playerId() == winnerId)
                    .build();
            host().broadcaster().sendTo(player.playerId(), GameMessage.newBuilder()
                    .setTq(TreasureQuestMessage.newBuilder().setExpeditionComplete(complete).build())
                    .build());
        }
    }

    private QuestAvatarComponent avatarFor(long playerId) {
        Entity entity = playerEntities.get(playerId);
        if (entity == null) {
            return null;
        }
        return componentManager().get(entity, QuestAvatarComponent.class);
    }

    private void sendQuizResult(
            long playerId,
            String quizId,
            QuizOutcome outcome,
            QuizScorer.Result result,
            int pointsEarned,
            int totalScore
    ) {
        QuizResult quizResult = QuizResult.newBuilder()
                .setQuizId(quizId)
                .setOutcome(outcome)
                .setCorrectCount(result.correctCount())
                .setTotalQuestions(result.totalQuestions())
                .setPointsEarned(pointsEarned)
                .setTotalScore(totalScore)
                .build();
        host().broadcaster().sendTo(playerId, GameMessage.newBuilder()
                .setTq(TreasureQuestMessage.newBuilder().setQuizResult(quizResult).build())
                .build());
    }

    private void sendHintReveal(long playerId, Checkpoint checkpoint) {
        int tileSize = questMap.tileSize();
        HintReveal hintReveal = HintReveal.newBuilder()
                .setText(checkpoint.hint())
                .addAllNextCheckpointIds(checkpoint.next())
                .setX(checkpoint.zone().centerWorldX(tileSize))
                .setY(checkpoint.zone().centerWorldY(tileSize))
                .build();
        host().broadcaster().sendTo(playerId, GameMessage.newBuilder()
                .setTq(TreasureQuestMessage.newBuilder().setHintReveal(hintReveal).build())
                .build());
    }

    private void sendPlayerStateUpdate(long playerId, QuestAvatarComponent avatar) {
        Inventory inventory = inventories.getOrDefault(playerId, Inventory.empty());
        PlayerStateUpdate update = PlayerStateUpdate.newBuilder()
                .setScore(avatar.score())
                .setCurrentCheckpoint(avatar.currentCheckpoint())
                .setCheckpointsCleared(avatar.checkpointsCleared())
                .setShielded(avatar.shielded())
                .setPvpCooldown(avatar.pvpCooldown())
                .setStealImmune(avatar.stealImmune())
                .addAllInventory(inventory.toProto())
                .build();
        host().broadcaster().sendTo(playerId, GameMessage.newBuilder()
                .setTq(TreasureQuestMessage.newBuilder().setPlayerStateUpdate(update).build())
                .build());
    }

    private void sendInventoryUpdate(long playerId) {
        Inventory inventory = inventories.getOrDefault(playerId, Inventory.empty());
        InventoryUpdate update = InventoryUpdate.newBuilder()
                .addAllItems(inventory.toProto())
                .build();
        host().broadcaster().sendTo(playerId, GameMessage.newBuilder()
                .setTq(TreasureQuestMessage.newBuilder().setInventoryUpdate(update).build())
                .build());
    }

    private void grantRewardItem(long playerId, String rewardItemId) {
        if (rewardItemId == null || rewardItemId.isBlank()) {
            return;
        }
        try {
            QuestItemType itemType = QuestItemType.fromRewardId(rewardItemId);
            Inventory inventory = inventories.computeIfAbsent(playerId, ignored -> Inventory.empty());
            inventory.grant(itemType.protoType(), 1);
            sendInventoryUpdate(playerId);
            QuestAvatarComponent avatar = avatarFor(playerId);
            if (avatar != null) {
                sendPlayerStateUpdate(playerId, avatar);
            }
        } catch (IllegalArgumentException e) {
            logger.warn("Unknown reward item '{}' in room '{}'", rewardItemId, host().roomId());
        }
    }

    private void handleItemUse(long playerId, ItemUse itemUse) {
        ItemType item = itemUse.getItem();
        long targetPlayerId = itemUse.getTargetPlayerId();
        Inventory inventory = inventories.get(playerId);
        QuestAvatarComponent avatar = avatarFor(playerId);
        if (inventory == null || avatar == null) {
            return;
        }

        String validationError = ItemUseValidator.validate(
                item,
                playerId,
                targetPlayerId,
                inventory,
                avatar.inDuel(),
                playerEntities.keySet());
        if (validationError != null) {
            logger.debug("Rejected item use from playerId={} in room '{}': {}",
                    playerId, host().roomId(), validationError);
            return;
        }
        if (item == ItemType.ITEM_TREASURE_LOCK && expeditionStates.get(targetPlayerId) == null) {
            return;
        }

        if (!inventory.consume(item)) {
            return;
        }

        long tick = host().currentTick();
        ExpeditionState effectTarget = switch (item) {
            case ITEM_TREASURE_LOCK -> expeditionStates.get(targetPlayerId);
            default -> expeditionStates.get(playerId);
        };

        ItemEffects.apply(item, new ItemEffects.ItemUseContext(
                tick,
                avatar,
                effectTarget,
                item == ItemType.ITEM_FAKE_MAP || item == ItemType.ITEM_TREASURE_LOCK
                        ? targetPlayerId
                        : playerId,
                content.config(),
                questMap,
                this::sendHintRevealToPlayer));

        sendInventoryUpdate(playerId);
        sendPlayerStateUpdate(playerId, avatar);
        if (item == ItemType.ITEM_TREASURE_LOCK) {
            refreshExpeditionZones(targetPlayerId);
        }
        refreshLeaderboardIfChanged();
    }

    private void sendHintRevealToPlayer(long playerId, HintReveal hint) {
        host().broadcaster().sendTo(playerId, GameMessage.newBuilder()
                .setTq(TreasureQuestMessage.newBuilder().setHintReveal(hint).build())
                .build());
    }

    private void refreshExpeditionLocks(long tick) {
        for (ExpeditionState expedition : expeditionStates.values()) {
            expedition.refreshAccessLock(tick);
        }
    }

    private void updateEncounters(long tick) {
        duelManager.onTick(
                tick,
                this::questAvatarFor,
                (toPlayerId, message) -> host().broadcaster().sendTo(toPlayerId, message),
                this::rebroadcastAllPlayerStates);
        if (playerEntities.size() < 2) {
            return;
        }
        List<Long> playerIds = List.copyOf(playerEntities.keySet());
        encounterManager.onTick(
                tick,
                playerIds,
                this::avatarView,
                this::questAvatarFor,
                id -> activeQuizSessions.containsKey(id),
                (toPlayerId, message) -> host().broadcaster().sendTo(toPlayerId, message),
                this::rebroadcastAllPlayerStates);
    }

    private void handleChallengeResponse(long playerId, ChallengeResponse response) {
        encounterManager.handleChallengeResponse(
                playerId,
                response,
                host().currentTick(),
                this::avatarView,
                this::questAvatarFor,
                id -> activeQuizSessions.containsKey(id),
                (toPlayerId, message) -> host().broadcaster().sendTo(toPlayerId, message),
                this::rebroadcastAllPlayerStates);
    }

    private void handleDuelSubmit(long playerId, DuelSubmit submit) {
        duelManager.handleSubmit(
                playerId,
                submit,
                host().currentTick(),
                this::questAvatarFor,
                (toPlayerId, message) -> host().broadcaster().sendTo(toPlayerId, message),
                this::rebroadcastAllPlayerStates);
    }

    private QuestAvatarComponent questAvatarFor(long playerId) {
        return avatarFor(playerId);
    }

    private void refreshAvatarProtection(long tick) {
        for (Entity entity : playerEntities.values()) {
            QuestAvatarComponent avatar = componentManager().get(entity, QuestAvatarComponent.class);
            if (avatar != null) {
                avatar.refreshProtection(tick);
            }
        }
    }

    private void grantQuizShield(QuestAvatarComponent avatar, long tick) {
        avatar.grantShieldUntil(tick + protectionDurationTicks(content.config().shieldSecs()));
        avatar.refreshProtection(tick);
    }

    private static long protectionDurationTicks(int seconds) {
        return (long) seconds * GameLoop.TPS;
    }

    private AvatarView avatarView(long playerId) {
        Entity entity = playerEntities.get(playerId);
        if (entity == null) {
            return new AvatarView(null, null);
        }
        return new AvatarView(
                componentManager().get(entity, QuestAvatarComponent.class),
                componentManager().get(entity, PositionComponent.class));
    }

    private void rebroadcastAllPlayerStates() {
        for (Map.Entry<Long, Entity> entry : playerEntities.entrySet()) {
            QuestAvatarComponent avatar = componentManager().get(entry.getValue(), QuestAvatarComponent.class);
            if (avatar != null) {
                sendPlayerStateUpdate(entry.getKey(), avatar);
            }
        }
        refreshLeaderboardIfChanged();
    }

    private void refreshLeaderboardIfChanged() {
        if (matchPhase.phase() != MatchPhase.PLAYING) {
            return;
        }
        List<Leaderboard.Entry> current = buildRankedEntries();
        if (!Leaderboard.orderChanged(lastLeaderboardEntries, current)) {
            return;
        }
        lastLeaderboardEntries = current;
        broadcastLeaderboard(Leaderboard.toProto(current, false));
    }

    private void broadcastFinalLeaderboard() {
        List<Leaderboard.Entry> current = buildRankedEntries();
        lastLeaderboardEntries = current;
        broadcastLeaderboard(Leaderboard.toProto(current, true));
    }

    private List<Leaderboard.Entry> buildRankedEntries() {
        List<Leaderboard.PlayerStanding> standings = new ArrayList<>();
        for (Map.Entry<Long, Entity> entry : playerEntities.entrySet()) {
            QuestAvatarComponent avatar = componentManager().get(entry.getValue(), QuestAvatarComponent.class);
            if (avatar == null) {
                continue;
            }
            long playerId = entry.getKey();
            standings.add(new Leaderboard.PlayerStanding(
                    playerId,
                    avatar.name(),
                    playerPower(playerId),
                    avatar.score(),
                    avatar.checkpointsCleared()));
        }
        return Leaderboard.rank(standings);
    }

    private void broadcastLeaderboard(com.triforge.protocol.proto.Leaderboard leaderboard) {
        GameMessage message = GameMessage.newBuilder()
                .setTq(TreasureQuestMessage.newBuilder().setLeaderboard(leaderboard).build())
                .build();
        for (long playerId : playerEntities.keySet()) {
            host().broadcaster().sendTo(playerId, message);
        }
    }
}
