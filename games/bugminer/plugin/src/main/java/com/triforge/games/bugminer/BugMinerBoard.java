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
        tickPlayCountdown(deltaSec);
        if (!isPlaying || !isGameplayActive()) return;

        if (battleArena != null) {
            battleArena.tick(deltaSec, true);
            pendingEvents.addAll(battleArena.drainEvents());
            return;
        }
        if (challengeA != null) {
            challengeA.tick(deltaSec, true);
            pendingEvents.addAll(challengeA.drainEvents());
        }
        if (challengeB != null) {
            challengeB.tick(deltaSec, true);
            pendingEvents.addAll(challengeB.drainEvents());
        }
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
        if (!isGameplayActive()) return false;
        if (battleArena != null) return battleArena.fireHook(playerId);
        ChallengeInstance c = getChallengePlaying(playerId);
        return c != null && c.fireHook(playerId);
    }

    public BugMinerBoardState getState() {
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
        for (BugMinerClientEvent event : pendingEvents) {
            builder.addEvents(event.toProto());
        }
        pendingEvents.clear();
        return builder.build();
    }
}
