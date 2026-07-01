package com.triforge.server.transport.netty;

import com.triforge.server.application.room.GameRoom;
import com.triforge.server.application.room.RoomRegistry;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.InputCommand;
import com.triforge.protocol.proto.JoinRequest;
import com.triforge.protocol.proto.LobbyCommand;
import com.triforge.protocol.proto.MessageEnvelope;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Objects;

@ChannelHandler.Sharable
public final class CommandDispatcher extends SimpleChannelInboundHandler<MessageEnvelope> {
    private static final Logger logger = LoggerFactory.getLogger(CommandDispatcher.class);

    private final RoomRegistry roomRegistry;

    public CommandDispatcher(RoomRegistry roomRegistry) {
        this.roomRegistry = Objects.requireNonNull(roomRegistry, "roomRegistry");
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, MessageEnvelope envelope) throws Exception {
        String roomId = envelope.getRoomId();
        if (roomId == null || roomId.isBlank()) {
            logger.warn("Received MessageEnvelope with missing or blank roomId");
            return;
        }

        GameMessage gameMsg;
        try {
            gameMsg = GameMessage.parseFrom(envelope.getPayload());
        } catch (Exception e) {
            logger.error("Failed to parse GameMessage payload inside MessageEnvelope", e);
            return;
        }

        GameRoom room = roomRegistry.getOrCreate(roomId);

        switch (gameMsg.getContentCase()) {
            case JOINREQUEST:
                JoinRequest joinReq = gameMsg.getJoinRequest();
                String name = joinReq.getPlayerName();
                room.enqueueCommand(() -> room.handleJoinRequest(name, ctx.channel()));
                break;

            case INPUTCOMMAND:
                Long playerId = ctx.channel().attr(GameRoom.PLAYER_ID_KEY).get();
                if (playerId == null) {
                    logger.warn("Received input command from channel without playerId in room '{}'", roomId);
                    return;
                }
                InputCommand input = gameMsg.getInputCommand();
                room.enqueueCommand(() -> room.queueInputCommand(playerId, input));
                break;

            case LOBBYCOMMAND:
                Long lobbyPlayerId = ctx.channel().attr(GameRoom.PLAYER_ID_KEY).get();
                if (lobbyPlayerId == null) {
                    logger.warn("Received lobby command from channel without playerId in room '{}'", roomId);
                    return;
                }
                LobbyCommand lobbyCommand = gameMsg.getLobbyCommand();
                room.enqueueCommand(() -> room.handleLobbyCommand(lobbyPlayerId, lobbyCommand));
                break;

            default:
                logger.warn("Received unhandled game message content case: {}", gameMsg.getContentCase());
                break;
        }
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        Long playerId = ctx.channel().attr(GameRoom.PLAYER_ID_KEY).get();
        String roomId = ctx.channel().attr(GameRoom.ROOM_ID_KEY).get();

        if (playerId != null && roomId != null) {
            roomRegistry.get(roomId).ifPresent(room -> {
                room.enqueueCommand(() -> room.handleLeaveRequest(playerId));
                logger.info("Enqueued leave cleanup command for playerId={} in room '{}' due to channel inactivity", playerId, roomId);
            });
        }
        super.channelInactive(ctx);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        logger.error("Exception in CommandDispatcher pipeline", cause);
        ctx.close();
    }
}
