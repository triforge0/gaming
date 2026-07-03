package com.triforge.games.treasurequest.pvp;

import java.util.Objects;

/** Pending challenge between two players until accept, decline, timeout, or separation. */
public final class Encounter {

    private final String encounterId;
    private final long lowerPlayerId;
    private final long higherPlayerId;
    private final long offerDeadlineTick;

    private boolean lowerAccepted;
    private boolean higherAccepted;
    private boolean lowerDeclined;
    private boolean higherDeclined;

    Encounter(String encounterId, long playerA, long playerB, long offerDeadlineTick) {
        if (playerA == playerB) {
            throw new IllegalArgumentException("Encounter requires two distinct players");
        }
        this.encounterId = Objects.requireNonNull(encounterId, "encounterId");
        if (playerA < playerB) {
            this.lowerPlayerId = playerA;
            this.higherPlayerId = playerB;
        } else {
            this.lowerPlayerId = playerB;
            this.higherPlayerId = playerA;
        }
        this.offerDeadlineTick = offerDeadlineTick;
    }

    public String encounterId() {
        return encounterId;
    }

    public long lowerPlayerId() {
        return lowerPlayerId;
    }

    public long higherPlayerId() {
        return higherPlayerId;
    }

    public long offerDeadlineTick() {
        return offerDeadlineTick;
    }

    public boolean hasPlayer(long playerId) {
        return playerId == lowerPlayerId || playerId == higherPlayerId;
    }

    public long opponentOf(long playerId) {
        if (playerId == lowerPlayerId) {
            return higherPlayerId;
        }
        if (playerId == higherPlayerId) {
            return lowerPlayerId;
        }
        throw new IllegalArgumentException("Player " + playerId + " is not in encounter " + encounterId);
    }

    public boolean bothAccepted() {
        return lowerAccepted && higherAccepted;
    }

    public boolean anyDeclined() {
        return lowerDeclined || higherDeclined;
    }

    public boolean isExpired(long tick) {
        return tick > offerDeadlineTick;
    }

    public void accept(long playerId) {
        if (playerId == lowerPlayerId) {
            lowerAccepted = true;
            return;
        }
        if (playerId == higherPlayerId) {
            higherAccepted = true;
            return;
        }
        throw new IllegalArgumentException("Player " + playerId + " is not in encounter " + encounterId);
    }

    public void decline(long playerId) {
        if (playerId == lowerPlayerId) {
            lowerDeclined = true;
            return;
        }
        if (playerId == higherPlayerId) {
            higherDeclined = true;
            return;
        }
        throw new IllegalArgumentException("Player " + playerId + " is not in encounter " + encounterId);
    }

    static String pairKey(long playerA, long playerB) {
        long lower = Math.min(playerA, playerB);
        long higher = Math.max(playerA, playerB);
        return lower + ":" + higher;
    }
}
