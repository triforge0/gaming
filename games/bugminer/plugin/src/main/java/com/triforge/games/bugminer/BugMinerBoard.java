package com.triforge.games.bugminer;

import com.triforge.protocol.proto.*;
import java.util.List;

public class BugMinerBoard {
    public long playerA;
    public long playerB;

    public ChallengeInstance challengeA;
    public ChallengeInstance challengeB;
    public BattleArena battleArena;

    private final FairModeConfig fairMode = new FairModeConfig();

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
        challengeA = new ChallengeInstance(pB, pA, fairMode.levelId);
        challengeB = new ChallengeInstance(pA, pB, fairMode.levelId);
        battleArena = null;
    }

    public void beginFairMode(String roomId) {
        challengeA = new ChallengeInstance(pB, pA, fairMode.levelId);
        challengeB = new ChallengeInstance(pA, pB, fairMode.levelId);
        battleArena = null;
        challengeA.setLevel(fairMode.levelId);
        challengeA.setTimeLimit(fairMode.timeLimit);
        challengeA.autoArrangeSeeded(challengeA.designerId, roomId.hashCode());
        List<PlacedItem> layout = challengeA.copyItemsLayout();
        challengeB.applyFairLayout(fairMode.levelId, fairMode.timeLimit, layout);
    }

    public void beginBattleMode(String roomId) {
        List<PlacedItem> layout = BattleLayoutBuilder.build(fairMode.levelId, roomId);
        battleArena = new BattleArena(playerA, playerB, fairMode.levelId, fairMode.timeLimit, layout);
        challengeA = null;
        challengeB = null;
    }

    public void tick(float deltaSec, boolean isPlaying) {
        if (battleArena != null) {
            battleArena.tick(deltaSec, isPlaying);
            return;
        }
        if (challengeA != null) challengeA.tick(deltaSec, isPlaying);
        if (challengeB != null) challengeB.tick(deltaSec, isPlaying);
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
        return builder.build();
    }
}
