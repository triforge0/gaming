package com.triforge.games.tankarena.match;

/** Result of applying a lobby-side mutation in {@link TankArenaMatchController}. */
public record LobbyCommandOutcome(boolean applied, LobbyRejectReason reason) {

    public LobbyCommandOutcome {
        if (applied && reason != LobbyRejectReason.NONE) {
            throw new IllegalArgumentException("applied outcome must use reason NONE");
        }
        if (!applied && reason == LobbyRejectReason.NONE) {
            throw new IllegalArgumentException("rejected outcome must specify a reason");
        }
    }

    public static LobbyCommandOutcome ok() {
        return new LobbyCommandOutcome(true, LobbyRejectReason.NONE);
    }

    public static LobbyCommandOutcome reject(LobbyRejectReason reason) {
        return new LobbyCommandOutcome(false, reason);
    }
}
