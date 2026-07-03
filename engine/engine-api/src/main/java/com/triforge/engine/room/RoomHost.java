package com.triforge.engine.room;

/** Callback surface from the room shell into infrastructure the active game plugin needs. */
public interface RoomHost {

    String roomId();

    String roomName();

    long currentTick();

    RoomSessionAccess sessions();

    RoomBroadcastAccess broadcaster();

    /** Called by the game plugin after join once the display name is registered. */
    default void notifyPlayerJoined(long playerId) {
    }

    /** Called by the game plugin when an in-room match begins. */
    default void notifyMatchStarted() {
    }
}
