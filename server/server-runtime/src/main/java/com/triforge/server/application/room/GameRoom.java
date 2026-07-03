package com.triforge.server.application.room;

import com.triforge.engine.game.Game;
import com.triforge.engine.game.GamePlugin;
import com.triforge.engine.game.GamePlugins;
import com.triforge.games.treasurequest.TreasureQuestGame;
import com.triforge.engine.ecs.ComponentManager;
import com.triforge.engine.ecs.EntityManager;
import com.triforge.engine.loop.GameLoop;
import com.triforge.engine.match.MatchConfig;
import com.triforge.engine.match.MatchController;
import com.triforge.engine.match.MatchPhase;
import com.triforge.protocol.proto.InputCommand;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.engine.room.RoomBroadcastAccess;
import com.triforge.engine.room.RoomHost;
import com.triforge.engine.room.RoomSessionAccess;
import com.triforge.server.application.room.chat.RoomChatService;
import com.triforge.engine.sync.DeltaService;
import io.netty.channel.Channel;
import io.netty.util.AttributeKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.LongConsumer;

/**
 * Generic room shell: one thread, command queue, session registry, and tick loop. Gameplay is
 * delegated to a pluggable {@link Game} loaded from a {@link GamePlugin}.
 */
public final class GameRoom implements AutoCloseable, RoomHost {
    private static final Logger logger = LoggerFactory.getLogger(GameRoom.class);

    public static final AttributeKey<Long> PLAYER_ID_KEY = RoomSessionManager.PLAYER_ID_KEY;
    public static final AttributeKey<String> ROOM_ID_KEY = RoomSessionManager.ROOM_ID_KEY;

    private final String roomId;
    private volatile String roomName;
    private final GamePlugin plugin;
    private final RoomCommandQueue commandQueue;
    private final RoomExecutor roomExecutor;
    private final GameLoop gameLoop;
    private final LongConsumer tickHandler;
    private final AtomicBoolean running = new AtomicBoolean(false);
    private final RoomSessionManager sessionManager;
    private final Game game;
    private final RoomBroadcaster broadcaster;
    private final RoomChatService chatService;

    public static Builder builder(String roomId) {
        return new Builder(roomId);
    }

    public GameRoom(String roomId) {
        this(builder(roomId));
    }

    public GameRoom(String roomId, LongConsumer tickHandler) {
        this(builder(roomId).tickHandler(tickHandler));
    }

    public GameRoom(String roomId, GamePlugin plugin, LongConsumer tickHandler) {
        this(builder(roomId).plugin(plugin).tickHandler(tickHandler));
    }

    /**
     * @param gameConfig plugin-specific room config (e.g. a custom map); {@code null} uses plugin defaults
     */
    public GameRoom(String roomId, GamePlugin plugin, Object gameConfig, LongConsumer tickHandler) {
        this(builder(roomId).plugin(plugin).gameConfig(gameConfig).tickHandler(tickHandler));
    }

    private GameRoom(Builder builder) {
        this.roomId = Objects.requireNonNull(builder.roomId, "roomId");
        this.roomName = builder.roomName != null ? builder.roomName : builder.roomId;
        this.plugin = builder.plugin != null ? builder.plugin : GamePlugins.defaultPlugin();
        this.tickHandler = builder.tickHandler != null ? builder.tickHandler : tick -> {
        };
        this.commandQueue = new RoomCommandQueue();
        this.roomExecutor = new RoomExecutor(roomId);
        this.sessionManager = new RoomSessionManager(roomId);
        this.game = plugin.createGame(builder.gameConfig);
        this.game.bind(this);
        if (builder.matchConfig != null) {
            game.matchConfig(builder.matchConfig);
        }
        if (builder.skipLobby) {
            game.skipLobby(true);
        }
        this.gameLoop = new GameLoop(this::onTick);
        this.broadcaster = new RoomBroadcaster(
                roomId,
                sessionManager,
                this::currentTick,
                game
        );
        this.chatService = new RoomChatService(broadcaster, sessionManager, this::currentTick);
    }

    public static final class Builder {
        private final String roomId;
        private String roomName;
        private GamePlugin plugin;
        private Object gameConfig;
        private LongConsumer tickHandler;
        private MatchConfig matchConfig;
        private boolean skipLobby;

        private Builder(String roomId) {
            this.roomId = Objects.requireNonNull(roomId, "roomId");
        }

        public Builder roomName(String roomName) {
            this.roomName = Objects.requireNonNull(roomName, "roomName");
            return this;
        }

        public Builder plugin(GamePlugin plugin) {
            this.plugin = Objects.requireNonNull(plugin, "plugin");
            return this;
        }

        public Builder gameConfig(Object gameConfig) {
            this.gameConfig = gameConfig;
            return this;
        }

        public Builder tickHandler(LongConsumer tickHandler) {
            this.tickHandler = Objects.requireNonNull(tickHandler, "tickHandler");
            return this;
        }

        public Builder matchConfig(MatchConfig matchConfig) {
            this.matchConfig = Objects.requireNonNull(matchConfig, "matchConfig");
            return this;
        }

        public Builder skipLobby(boolean skip) {
            this.skipLobby = skip;
            return this;
        }

        public GameRoom build() {
            return new GameRoom(this);
        }
    }

    public GamePlugin plugin() {
        return plugin;
    }

    public Game game() {
        return game;
    }

    @Override
    public RoomSessionAccess sessions() {
        return sessionManager;
    }

    @Override
    public RoomBroadcastAccess broadcaster() {
        return broadcaster;
    }

    public RoomSessionManager sessionManager() {
        return sessionManager;
    }

    public RoomBroadcaster roomBroadcaster() {
        return broadcaster;
    }

    @Override
    public String roomId() {
        return roomId;
    }

    @Override
    public String roomName() {
        return roomName;
    }

    public GameRoom roomName(String name) {
        this.roomName = Objects.requireNonNull(name, "name");
        return this;
    }

    public RoomCommandQueue commandQueue() {
        return commandQueue;
    }

    public EntityManager entityManager() {
        return game.entityManager();
    }

    public ComponentManager componentManager() {
        return game.componentManager();
    }

    public DeltaService deltaService() {
        return game.deltaService();
    }

    public MatchController matchController() {
        return game.matchController();
    }

    public MatchPhase matchPhase() {
        return game.matchPhase();
    }

    GameRoom matchConfig(MatchConfig config) {
        game.matchConfig(config);
        return this;
    }

    public GameRoom skipLobby(boolean skip) {
        game.skipLobby(skip);
        return this;
    }

    public boolean isRunning() {
        return running.get();
    }

    public boolean hasRegisteredClients() {
        return sessionManager.hasClients();
    }

    public int connectedClientCount() {
        return sessionManager.connectedCount();
    }

    @Override
    public long currentTick() {
        return gameLoop.currentTick();
    }

    public void enqueueCommand(Runnable command) {
        commandQueue.offer(command);
    }

    public void start() {
        if (!running.compareAndSet(false, true)) {
            return;
        }
        logger.info("Starting room '{}' simulation loop thread (plugin={})", roomId, plugin.id());
        if (!gameLoop.start()) {
            running.set(false);
            throw new IllegalStateException("Game loop already running for room '" + roomId + "'");
        }
        roomExecutor.start(gameLoop);
    }

    public void stop() {
        if (!running.compareAndSet(true, false)) {
            return;
        }
        logger.info("Stopping room '{}' simulation loop thread", roomId);
        gameLoop.stop();
        roomExecutor.stop();
        commandQueue.clear();
        game.stop();
        sessionManager.clear();
    }

    @Override
    public void close() {
        stop();
    }

    public void handleJoinRequest(String requestedName, Channel channel) {
        game.handleJoinRequest(requestedName, channel);
    }

    public void handleLeaveRequest(long playerId) {
        String name = sessionManager.displayNameOf(playerId);
        game.handleLeaveRequest(playerId);
        chatService.announce(name + " left the room");
    }

    @Override
    public void notifyPlayerJoined(long playerId) {
        chatService.announce(sessionManager.displayNameOf(playerId) + " joined the room");
    }

    @Override
    public void notifyMatchStarted() {
        chatService.announce("Match started");
    }

    public void handleChatCommand(long playerId, String text) {
        chatService.handle(playerId, text);
    }

    public void handleLobbyCommand(long playerId, LobbyCommand command) {
        game.handleLobbyCommand(playerId, command);
    }

    void tickCountdownPhase() {
        game.tickCountdownPhase();
    }

    void tickMatchTimer() {
        game.tickMatchTimer();
    }

    void tickScoreboardPhase() {
        game.tickScoreboardPhase();
    }

    public void queueInputCommand(long playerId, InputCommand input) {
        game.queueInputCommand(playerId, input);
    }

    public void queueTreasureQuestMessage(long playerId, com.triforge.protocol.proto.TreasureQuestMessage message) {
        if (game instanceof TreasureQuestGame treasureQuest) {
            treasureQuest.handleTreasureQuestMessage(playerId, message);
        }
    }

    /** Generic seam for plugin-owned {@link com.triforge.protocol.proto.GameMessage} arms. */
    public void queueGameMessage(long playerId, com.triforge.protocol.proto.GameMessage message) {
        game.handleGameMessage(playerId, message);
    }

    private void onTick(long tick) {
        drainAndRunCommands(tick);
        game.onTick(tick);
        notifyTickHandler(tick);
    }

    private void drainAndRunCommands(long tick) {
        List<Runnable> commands = commandQueue.drainAll();
        for (Runnable command : commands) {
            try {
                command.run();
            } catch (Exception e) {
                logger.error("Error executing room command on room '{}' tick {}", roomId, tick, e);
            }
        }
    }

    private void notifyTickHandler(long tick) {
        try {
            tickHandler.accept(tick);
        } catch (Exception e) {
            logger.error("Error executing tickHandler on room '{}' tick {}", roomId, tick, e);
        }
    }
}
