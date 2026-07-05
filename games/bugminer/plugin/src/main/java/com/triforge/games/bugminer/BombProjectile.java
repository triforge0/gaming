package com.triforge.games.bugminer;

import com.triforge.protocol.proto.BugMinerBombProjectile;

public class BombProjectile {
    public String id;
    public long ownerId;
    public long targetPlayerId;
    public float x;
    public float y;
    public float vx;
    public float vy;
    public float ttl;

    public BombProjectile(
            String id,
            long ownerId,
            long targetPlayerId,
            float x,
            float y,
            float vx,
            float vy,
            float ttl) {
        this.id = id;
        this.ownerId = ownerId;
        this.targetPlayerId = targetPlayerId;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.ttl = ttl;
    }

    public BugMinerBombProjectile toProto() {
        return BugMinerBombProjectile.newBuilder()
                .setId(id)
                .setOwnerId(ownerId)
                .setTargetPlayerId(targetPlayerId)
                .setX(x)
                .setY(y)
                .setVx(vx)
                .setVy(vy)
                .setTtl(ttl)
                .build();
    }
}
