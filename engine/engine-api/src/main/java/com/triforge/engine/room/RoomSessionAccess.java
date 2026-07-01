package com.triforge.engine.room;

import io.netty.channel.Channel;

/** Session registry surface exposed by a room host to the active game plugin. */
public interface RoomSessionAccess {

    long nextPlayerId();

    void register(long playerId, Channel channel);

    void unregister(long playerId);

    boolean isConnected(long playerId);
}
