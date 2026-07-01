package com.triforge.engine.room;

/** Callback surface from the room shell into infrastructure the active game plugin needs. */
public interface RoomHost {

    String roomId();

    String roomName();

    long currentTick();

    RoomSessionAccess sessions();

    RoomBroadcastAccess broadcaster();
}
