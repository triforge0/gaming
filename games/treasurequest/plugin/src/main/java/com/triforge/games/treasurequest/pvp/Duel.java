package com.triforge.games.treasurequest.pvp;

import com.triforge.games.treasurequest.content.Question;
import com.triforge.protocol.proto.DuelSubmit;

import java.util.List;
import java.util.Objects;

/** Active duel between two players until both submit or the deadline passes. */
public final class Duel {

    private final String duelId;
    private final long lowerPlayerId;
    private final long higherPlayerId;
    private final List<Question> questions;
    private final long deadlineTick;

    private DuelSubmit lowerSubmit;
    private DuelSubmit higherSubmit;

    Duel(
            String duelId,
            long lowerPlayerId,
            long higherPlayerId,
            List<Question> questions,
            long deadlineTick
    ) {
        if (lowerPlayerId == higherPlayerId) {
            throw new IllegalArgumentException("Duel requires two distinct players");
        }
        this.duelId = Objects.requireNonNull(duelId, "duelId");
        this.lowerPlayerId = Math.min(lowerPlayerId, higherPlayerId);
        this.higherPlayerId = Math.max(lowerPlayerId, higherPlayerId);
        this.questions = List.copyOf(Objects.requireNonNull(questions, "questions"));
        if (this.questions.isEmpty()) {
            throw new IllegalArgumentException("Duel requires at least one question");
        }
        this.deadlineTick = deadlineTick;
    }

    public String duelId() {
        return duelId;
    }

    public long lowerPlayerId() {
        return lowerPlayerId;
    }

    public long higherPlayerId() {
        return higherPlayerId;
    }

    public List<Question> questions() {
        return questions;
    }

    public long deadlineTick() {
        return deadlineTick;
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
        throw new IllegalArgumentException("Player " + playerId + " is not in duel " + duelId);
    }

    public boolean isExpired(long tick) {
        return tick > deadlineTick;
    }

    public boolean hasSubmitted(long playerId) {
        if (playerId == lowerPlayerId) {
            return lowerSubmit != null;
        }
        if (playerId == higherPlayerId) {
            return higherSubmit != null;
        }
        return false;
    }

    public boolean bothSubmitted() {
        return lowerSubmit != null && higherSubmit != null;
    }

    public DuelSubmit submitFor(long playerId) {
        if (playerId == lowerPlayerId) {
            return lowerSubmit;
        }
        if (playerId == higherPlayerId) {
            return higherSubmit;
        }
        return null;
    }

    public void recordSubmit(long playerId, DuelSubmit submit) {
        Objects.requireNonNull(submit, "submit");
        if (playerId == lowerPlayerId) {
            lowerSubmit = submit;
            return;
        }
        if (playerId == higherPlayerId) {
            higherSubmit = submit;
            return;
        }
        throw new IllegalArgumentException("Player " + playerId + " is not in duel " + duelId);
    }
}
