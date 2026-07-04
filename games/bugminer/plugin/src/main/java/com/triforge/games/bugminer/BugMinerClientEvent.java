package com.triforge.games.bugminer;

/** Client-side game feedback (mirrors standalone socket game:event payloads). */
public final class BugMinerClientEvent {
    public final String eventType;
    public long playerId;
    public long playerAId;
    public long playerBId;
    public long thiefId;
    public long victimId;
    public String itemId;
    public int value;

    public BugMinerClientEvent(String eventType) {
        this.eventType = eventType;
    }

    public com.triforge.protocol.proto.BugMinerClientEvent toProto() {
        com.triforge.protocol.proto.BugMinerClientEvent.Builder b =
                com.triforge.protocol.proto.BugMinerClientEvent.newBuilder()
                        .setEventType(eventType);
        if (playerId > 0) b.setPlayerId(playerId);
        if (playerAId > 0) b.setPlayerAId(playerAId);
        if (playerBId > 0) b.setPlayerBId(playerBId);
        if (thiefId > 0) b.setThiefId(thiefId);
        if (victimId > 0) b.setVictimId(victimId);
        if (itemId != null) b.setItemId(itemId);
        if (value != 0) b.setValue(value);
        return b.build();
    }
}
