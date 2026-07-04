package com.triforge.games.bugminer;

import com.triforge.protocol.proto.*;
import java.util.ArrayList;
import java.util.List;

public class BugMinerBoard {
    public long playerA;
    public long playerB;
    
    // Player A plays, Player B designs
    public ChallengeInstance challengeA;
    
    // Player B plays, Player A designs
    public ChallengeInstance challengeB;
    
    public BugMinerBoard() {
    }

    public void init(long pA, long pB) {
        this.playerA = pA;
        this.playerB = pB;
        
        challengeA = new ChallengeInstance(pB, pA, "easy-mine");
        challengeB = new ChallengeInstance(pA, pB, "easy-mine");
    }
    
    public void tick(float deltaSec, boolean isPlaying) {
        if (challengeA != null) challengeA.tick(deltaSec, isPlaying);
        if (challengeB != null) challengeB.tick(deltaSec, isPlaying);
    }
    
    public ChallengeInstance getChallengeForPlayer(long playerId) {
        if (challengeA != null && challengeA.designerId == playerId) return challengeB; // player is designer, so they interact with B's challenge
        if (challengeB != null && challengeB.designerId == playerId) return challengeA;
        return null;
    }
    
    public ChallengeInstance getChallengePlaying(long playerId) {
        if (challengeA != null && challengeA.playerId == playerId) return challengeA;
        if (challengeB != null && challengeB.playerId == playerId) return challengeB;
        return null;
    }

    public BugMinerBoardState getState() {
        BugMinerBoardState.Builder builder = BugMinerBoardState.newBuilder();
        if (challengeA != null) builder.setForPlayerA(challengeA.toProto());
        if (challengeB != null) builder.setForPlayerB(challengeB.toProto());
        return builder.build();
    }
}
