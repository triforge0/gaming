package com.triforge.games.bugminer;

import com.triforge.protocol.proto.*;
import java.util.ArrayList;
import java.util.List;

public class BugMinerBoard {
    public long playerA;
    public long playerB;

    public ChallengeInstance challengeA;
    public ChallengeInstance challengeB;
    public BattleArena battleArena;

    private final FairModeConfig fairMode = new FairModeConfig();
    private float playCountdown = 0f;
    private boolean paused = false;
    private Long matchWinnerId = null;
    private String matchEndReason = null;
    private final List<BugMinerClientEvent> pendingEvents = new ArrayList<>();

    private static final float COUNTDOWN_SECONDS = 3f;

    public FairModeConfig fairMode() {
        return fairMode;
    }

    public void init(long pA, long pB) {
        this.playerA = pA;
        this.playerB = pB;
        challengeA = null;
        challengeB = null;
        battleArena = null;
    }

    public void beginFreeMode() {
        challengeA = new ChallengeInstance(playerB, playerA, fairMode.levelId);
        challengeB = new ChallengeInstance(playerA, playerB, fairMode.levelId);
        battleArena = null;
        playCountdown = 0f;
    }

    public void beginFairMode(String roomId) {
        challengeA = new ChallengeInstance(playerB, playerA, fairMode.levelId);
        challengeB = new ChallengeInstance(playerA, playerB, fairMode.levelId);
        battleArena = null;
        List<PlacedItem> layout = FairLayoutBuilder.build(fairMode.levelId, roomId);
        challengeA.applyFairLayout(fairMode.levelId, fairMode.timeLimit, layout);
        challengeB.applyFairLayout(fairMode.levelId, fairMode.timeLimit, layout);
        startPlayCountdown();
    }

    public void beginBattleMode(String roomId) {
        List<PlacedItem> layout = BattleLayoutBuilder.build(fairMode.levelId, roomId);
        battleArena = new BattleArena(playerA, playerB, fairMode.levelId, fairMode.timeLimit, layout);
        challengeA = null;
        challengeB = null;
        startPlayCountdown();
    }

    public void startPlayCountdown() {
        playCountdown = COUNTDOWN_SECONDS;
    }

    public void onSetupLocked() {
        if (isAutoSetupMode()) return;
        if (challengeA != null && challengeB != null
                && challengeA.setupLocked() && challengeB.setupLocked()) {
            startPlayCountdown();
        }
    }

    public void tickPlayCountdown(float deltaSec) {
        if (playCountdown > 0f) {
            playCountdown = Math.max(0f, playCountdown - deltaSec);
        }
    }

    public boolean isGameplayActive() {
        return playCountdown <= 0f && isReadyToPlay();
    }

    private boolean isReadyToPlay() {
        if (battleArena != null) return true;
        if (isAutoSetupMode()) {
            return challengeA != null && challengeB != null;
        }
        return challengeA != null && challengeB != null
                && challengeA.setupLocked() && challengeB.setupLocked();
    }

    public int playCountdownSeconds() {
        return (int) Math.ceil(playCountdown);
    }

    public void tick(float deltaSec, boolean isPlaying) {
        if (!paused) {
            tickPlayCountdown(deltaSec);
        }
        if (!isPlaying || !isGameplayActive() || paused) return;

        if (battleArena != null) {
            battleArena.tick(deltaSec, true);
            pendingEvents.addAll(battleArena.drainEvents());
            return;
        }
        if (challengeA != null) {
            challengeA.tick(deltaSec, true);
            pendingEvents.addAll(challengeA.drainEvents());
            if (hasDecisiveOutcome()) return;
        }
        if (challengeB != null) {
            challengeB.tick(deltaSec, true);
            pendingEvents.addAll(challengeB.drainEvents());
        }
    }

    boolean hasDecisiveOutcome() {
        if (challengeA == null || challengeB == null) return false;
        String reasonA = challengeA.endReason();
        String reasonB = challengeB.endReason();
        return "target".equals(reasonA) || "target".equals(reasonB)
                || "poison".equals(reasonA) || "poison".equals(reasonB);
    }

    public ChallengeInstance getChallengeForPlayer(long playerId) {
        if (challengeA != null && challengeA.designerId == playerId) return challengeA;
        if (challengeB != null && challengeB.designerId == playerId) return challengeB;
        return null;
    }

    public ChallengeInstance getChallengePlaying(long playerId) {
        if (challengeA != null && challengeA.playerId == playerId) return challengeA;
        if (challengeB != null && challengeB.playerId == playerId) return challengeB;
        return null;
    }

    public boolean isFairModeActive() {
        return fairMode.enabled && !fairMode.battle;
    }

    public boolean isBattleModeActive() {
        return fairMode.enabled && fairMode.battle;
    }

    public boolean isAutoSetupMode() {
        return fairMode.enabled;
    }

    public boolean fireHook(long playerId) {
        if (paused || !isGameplayActive()) return false;
        if (battleArena != null) return battleArena.fireHook(playerId);
        ChallengeInstance c = getChallengePlaying(playerId);
        return c != null && c.fireHook(playerId);
    }

    public void setPaused(boolean value) {
        this.paused = value;
    }

    public boolean isPaused() {
        return paused;
    }

    public void setMatchOutcome(Long winnerId, String endReason) {
        this.matchWinnerId = winnerId;
        this.matchEndReason = endReason;
    }

    public void clearMatchOutcome() {
        matchWinnerId = null;
        matchEndReason = null;
    }

    public void resetForLobby() {
        challengeA = null;
        challengeB = null;
        battleArena = null;
        playCountdown = 0f;
        paused = false;
        clearMatchOutcome();
        pendingEvents.clear();
    }

    public Long resolveDualWinner() {
        if (battleArena != null) {
            return battleArena.winnerId();
        }
        if (challengeA == null || challengeB == null) return null;
        if ("target".equals(challengeA.endReason())) return challengeA.playerId;
        if ("target".equals(challengeB.endReason())) return challengeB.playerId;
        if ("poison".equals(challengeA.endReason())) return challengeB.playerId;
        if ("poison".equals(challengeB.endReason())) return challengeA.playerId;
        if (challengeA.isFinished() && challengeB.isFinished()) {
            if (challengeA.score() > challengeB.score()) return challengeA.playerId;
            if (challengeB.score() > challengeA.score()) return challengeB.playerId;
            return null;
        }
        return null;
    }

    public String resolveDualEndReason() {
        if (battleArena != null && battleArena.isFinished()) {
            return battleArena.toProto().getEndReason();
        }
        if (challengeA == null || challengeB == null) return null;
        if ("target".equals(challengeA.endReason()) || "target".equals(challengeB.endReason())) return "target";
        if ("poison".equals(challengeA.endReason()) || "poison".equals(challengeB.endReason())) return "poison";
        if (challengeA.isFinished() && challengeB.isFinished()) return "timeout";
        return null;
    }

    public BugMinerBoardState getState() {
        Long winner = matchWinnerId != null ? matchWinnerId : resolveDualWinner();
        String endReason = matchEndReason != null ? matchEndReason : resolveDualEndReason();

        BugMinerBoardState.Builder builder = BugMinerBoardState.newBuilder();
        if (challengeA != null) builder.setForPlayerA(challengeA.toProto());
        if (challengeB != null) builder.setForPlayerB(challengeB.toProto());
        if (battleArena != null) builder.setBattle(battleArena.toProto());
        builder.setFairMode(BugMinerFairModeConfig.newBuilder()
                .setEnabled(fairMode.enabled)
                .setBattle(fairMode.battle)
                .setLevelId(fairMode.levelId)
                .setTimeLimit(fairMode.timeLimit)
                .build());
        builder.setPlayCountdown(playCountdownSeconds());
        builder.setPaused(paused);
        if (winner != null) builder.setWinnerId(winner);
        if (endReason != null) builder.setMatchEndReason(endReason);
        for (BugMinerClientEvent event : pendingEvents) {
            builder.addEvents(event.toProto());
        }
        pendingEvents.clear();
        return builder.build();
    }
}
