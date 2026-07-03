package com.triforge.games.treasurequest.pvp;

import com.triforge.engine.loop.GameLoop;
import com.triforge.games.treasurequest.components.QuestAvatarComponent;
import com.triforge.games.treasurequest.content.DuelQuestionPicker;
import com.triforge.games.treasurequest.content.ExpeditionConfig;
import com.triforge.games.treasurequest.content.Question;
import com.triforge.games.treasurequest.content.QuizCatalog;
import com.triforge.protocol.proto.DuelPrompt;
import com.triforge.protocol.proto.DuelResult;
import com.triforge.protocol.proto.DuelSubmit;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.QuizQuestionProto;
import com.triforge.protocol.proto.TreasureQuestMessage;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.BiConsumer;
import java.util.function.LongFunction;

/** Runs active PvP duels: prompts, submissions, deadlines, steal resolution. */
public final class DuelManager {

    private final QuizCatalog quizCatalog;
    private final ExpeditionConfig config;
    private final LongFunction<Integer> powerByPlayer;
    private final Map<String, Duel> activeDuels = new HashMap<>();
    private final Map<Long, String> duelIdByPlayer = new HashMap<>();

    public DuelManager(QuizCatalog quizCatalog, ExpeditionConfig config, LongFunction<Integer> powerByPlayer) {
        this.quizCatalog = Objects.requireNonNull(quizCatalog, "quizCatalog");
        this.config = Objects.requireNonNull(config, "config");
        this.powerByPlayer = Objects.requireNonNull(powerByPlayer, "powerByPlayer");
    }

    public void clear() {
        activeDuels.clear();
        duelIdByPlayer.clear();
    }

    public Optional<Duel> duelForPlayer(long playerId) {
        String duelId = duelIdByPlayer.get(playerId);
        if (duelId == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(activeDuels.get(duelId));
    }

    public void startDuel(
            String duelId,
            long playerA,
            long playerB,
            long tick,
            LongFunction<QuestAvatarComponent> avatars,
            BiConsumer<Long, GameMessage> sendTo,
            Runnable rebroadcastPlayerStates
    ) {
        long lowerId = Math.min(playerA, playerB);
        long higherId = Math.max(playerA, playerB);
        QuestAvatarComponent lower = avatars.apply(lowerId);
        QuestAvatarComponent higher = avatars.apply(higherId);
        if (lower == null || higher == null) {
            return;
        }

        lower.setInDuel(true);
        higher.setInDuel(true);

        long deadline = tick + (long) config.duelTimeLimitSecs() * GameLoop.TPS;
        List<Question> questions = DuelQuestionPicker.pick(quizCatalog, config.duelQuestionCount(), duelId);
        Duel duel = new Duel(duelId, lowerId, higherId, questions, deadline);
        activeDuels.put(duelId, duel);
        duelIdByPlayer.put(lowerId, duelId);
        duelIdByPlayer.put(higherId, duelId);

        sendDuelPrompt(lowerId, higherId, higher.name(), duel, sendTo);
        sendDuelPrompt(higherId, lowerId, lower.name(), duel, sendTo);
        rebroadcastPlayerStates.run();
    }

    public void onTick(
            long tick,
            LongFunction<QuestAvatarComponent> avatars,
            BiConsumer<Long, GameMessage> sendTo,
            Runnable rebroadcast
    ) {
        for (Duel duel : List.copyOf(activeDuels.values())) {
            if (duel.bothSubmitted() || duel.isExpired(tick)) {
                completeDuel(duel, tick, avatars, sendTo, rebroadcast);
            }
        }
    }

    public void handleSubmit(
            long playerId,
            DuelSubmit submit,
            long tick,
            LongFunction<QuestAvatarComponent> avatars,
            BiConsumer<Long, GameMessage> sendTo,
            Runnable rebroadcast
    ) {
        Duel duel = activeDuels.get(submit.getDuelId());
        if (duel == null || !duel.hasPlayer(playerId)) {
            return;
        }
        if (duel.hasSubmitted(playerId) || duel.isExpired(tick)) {
            return;
        }
        duel.recordSubmit(playerId, submit);
        if (duel.bothSubmitted()) {
            completeDuel(duel, tick, avatars, sendTo, rebroadcast);
        }
    }

    public void onPlayerLeave(long playerId) {
        String duelId = duelIdByPlayer.remove(playerId);
        if (duelId == null) {
            return;
        }
        Duel duel = activeDuels.remove(duelId);
        if (duel != null) {
            duelIdByPlayer.remove(duel.lowerPlayerId());
            duelIdByPlayer.remove(duel.higherPlayerId());
        }
    }

    private void completeDuel(
            Duel duel,
            long tick,
            LongFunction<QuestAvatarComponent> avatars,
            BiConsumer<Long, GameMessage> sendTo,
            Runnable rebroadcast
    ) {
        QuestAvatarComponent lower = avatars.apply(duel.lowerPlayerId());
        QuestAvatarComponent higher = avatars.apply(duel.higherPlayerId());
        if (lower == null || higher == null) {
            removeDuel(duel);
            return;
        }

        DuelSubmit lowerSubmit = duel.submitFor(duel.lowerPlayerId());
        if (lowerSubmit == null) {
            lowerSubmit = DuelSubmit.newBuilder().setDuelId(duel.duelId()).build();
        }
        DuelSubmit higherSubmit = duel.submitFor(duel.higherPlayerId());
        if (higherSubmit == null) {
            higherSubmit = DuelSubmit.newBuilder().setDuelId(duel.duelId()).build();
        }

        int lowerCorrect = DuelScorer.score(duel.questions(), lowerSubmit, tick, duel.deadlineTick()).correctCount();
        int higherCorrect = DuelScorer.score(duel.questions(), higherSubmit, tick, duel.deadlineTick()).correctCount();

        int lowerPoints = lower.score();
        int higherPoints = higher.score();
        DuelScorer.Outcome outcome = DuelScorer.resolve(
                duel.lowerPlayerId(),
                duel.higherPlayerId(),
                lowerCorrect,
                higherCorrect,
                lowerPoints,
                higherPoints,
                powerByPlayer.apply(duel.lowerPlayerId()),
                powerByPlayer.apply(duel.higherPlayerId()),
                config.stealPct());

        lower.setScore(lowerPoints + outcome.lowerScoreDelta());
        higher.setScore(higherPoints + outcome.higherScoreDelta());
        lower.setInDuel(false);
        higher.setInDuel(false);
        applyPostDuelProtection(tick, outcome, lower, higher);

        publishResult(duel.lowerPlayerId(), duel, outcome, lowerCorrect, higherCorrect, lower.score(), sendTo);
        publishResult(duel.higherPlayerId(), duel, outcome, higherCorrect, lowerCorrect, higher.score(), sendTo);
        removeDuel(duel);
        rebroadcast.run();
    }

    private void publishResult(
            long viewerId,
            Duel duel,
            DuelScorer.Outcome outcome,
            int yourCorrect,
            int opponentCorrect,
            int totalScore,
            BiConsumer<Long, GameMessage> sendTo
    ) {
        int scoreDelta = viewerId == duel.lowerPlayerId()
                ? outcome.lowerScoreDelta()
                : outcome.higherScoreDelta();
        DuelResult result = DuelResult.newBuilder()
                .setDuelId(duel.duelId())
                .setWinnerPlayerId(outcome.winnerPlayerId())
                .setTie(outcome.tie())
                .setYourCorrect(yourCorrect)
                .setOpponentCorrect(opponentCorrect)
                .setScoreDelta(scoreDelta)
                .setTotalScore(totalScore)
                .build();
        sendTo.accept(viewerId, GameMessage.newBuilder()
                .setTq(TreasureQuestMessage.newBuilder().setDuelResult(result).build())
                .build());
    }

    private void removeDuel(Duel duel) {
        activeDuels.remove(duel.duelId());
        duelIdByPlayer.remove(duel.lowerPlayerId());
        duelIdByPlayer.remove(duel.higherPlayerId());
    }

    private void applyPostDuelProtection(
            long tick,
            DuelScorer.Outcome outcome,
            QuestAvatarComponent lower,
            QuestAvatarComponent higher
    ) {
        if (outcome.tie()) {
            return;
        }
        QuestAvatarComponent winner = outcome.winnerPlayerId() == lower.playerId() ? lower : higher;
        QuestAvatarComponent loser = outcome.winnerPlayerId() == lower.playerId() ? higher : lower;
        winner.grantPvpCooldownUntil(tick + protectionDurationTicks(config.pvpCooldownSecs()));
        loser.grantStealImmunityUntil(tick + protectionDurationTicks(config.stealImmunitySecs()));
        winner.refreshProtection(tick);
        loser.refreshProtection(tick);
    }

    private static long protectionDurationTicks(int seconds) {
        return (long) seconds * GameLoop.TPS;
    }

    private static void sendDuelPrompt(
            long toPlayerId,
            long opponentPlayerId,
            String opponentName,
            Duel duel,
            BiConsumer<Long, GameMessage> sendTo
    ) {
        DuelPrompt.Builder builder = DuelPrompt.newBuilder()
                .setDuelId(duel.duelId())
                .setOpponentPlayerId(opponentPlayerId)
                .setOpponentName(opponentName)
                .setDeadlineTick(duel.deadlineTick());
        for (Question question : duel.questions()) {
            builder.addQuestions(toWireQuestion(question));
        }
        sendTo.accept(toPlayerId, GameMessage.newBuilder()
                .setTq(TreasureQuestMessage.newBuilder().setDuelPrompt(builder.build()).build())
                .build());
    }

    private static QuizQuestionProto toWireQuestion(Question question) {
        return QuizQuestionProto.newBuilder()
                .setQuestionId(question.id())
                .setText(question.text())
                .addAllOptions(question.options())
                .setTimeLimitSec(question.timeLimitSec())
                .setPoints(question.points())
                .build();
    }
}