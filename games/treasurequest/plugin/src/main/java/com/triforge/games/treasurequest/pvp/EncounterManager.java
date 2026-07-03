package com.triforge.games.treasurequest.pvp;

import com.triforge.games.treasurequest.components.PositionComponent;
import com.triforge.games.treasurequest.components.QuestAvatarComponent;
import com.triforge.protocol.proto.ChallengeResponse;
import com.triforge.protocol.proto.EncounterOffer;
import com.triforge.protocol.proto.EncounterState;
import com.triforge.protocol.proto.GameMessage;
import com.triforge.protocol.proto.TreasureQuestMessage;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.BiConsumer;
import java.util.function.Function;
import java.util.function.LongFunction;

/** Tracks proximity encounter offers and challenge responses until a duel starts. */
public final class EncounterManager {

    public record AvatarView(QuestAvatarComponent avatar, PositionComponent position) {
    }

    private final EncounterDetector detector;
    private final DuelManager duelManager;
    private final Map<String, Encounter> encounters = new HashMap<>();
    private final Map<String, String> pairToEncounterId = new HashMap<>();
    private int nextEncounterSeq;

    public EncounterManager(EncounterDetector detector, DuelManager duelManager) {
        this.detector = Objects.requireNonNull(detector, "detector");
        this.duelManager = Objects.requireNonNull(duelManager, "duelManager");
    }

    public void clear() {
        encounters.clear();
        pairToEncounterId.clear();
        nextEncounterSeq = 0;
    }

    public Optional<Encounter> encounterForPlayer(long playerId) {
        for (Encounter encounter : encounters.values()) {
            if (encounter.hasPlayer(playerId)) {
                return Optional.of(encounter);
            }
        }
        return Optional.empty();
    }

    public void onTick(
            long tick,
            List<Long> playerIds,
            LongFunction<AvatarView> avatarView,
            LongFunction<QuestAvatarComponent> avatarComponents,
            Function<Long, Boolean> inActiveQuiz,
            BiConsumer<Long, GameMessage> sendTo,
            Runnable rebroadcastPlayerStates
    ) {
        refreshActiveEncounters(tick, avatarView, avatarComponents, sendTo, rebroadcastPlayerStates);
        if (!detector.shouldScan(tick)) {
            return;
        }
        detector.markScanned(tick);
        offerNewEncounters(tick, playerIds, avatarView, inActiveQuiz, sendTo);
    }

    public void handleChallengeResponse(
            long playerId,
            ChallengeResponse response,
            long tick,
            LongFunction<AvatarView> avatarView,
            LongFunction<QuestAvatarComponent> avatarComponents,
            Function<Long, Boolean> inActiveQuiz,
            BiConsumer<Long, GameMessage> sendTo,
            Runnable rebroadcastPlayerStates
    ) {
        Encounter encounter = encounters.get(response.getEncounterId());
        if (encounter == null || !encounter.hasPlayer(playerId)) {
            return;
        }
        if (encounter.isExpired(tick)) {
            cancelEncounter(encounter, EncounterState.ENC_CANCELLED, avatarView, sendTo);
            return;
        }

        AvatarView self = avatarView.apply(playerId);
        AvatarView opponent = avatarView.apply(encounter.opponentOf(playerId));
        if (!pairStillValid(
                self,
                opponent,
                inActiveQuiz.apply(playerId),
                inActiveQuiz.apply(encounter.opponentOf(playerId)))) {
            cancelEncounter(encounter, EncounterState.ENC_CANCELLED, avatarView, sendTo);
            return;
        }

        if (response.getAccept()) {
            encounter.accept(playerId);
            notifyOfferState(encounter, EncounterState.ENC_ACCEPTED, avatarView, sendTo);
            if (encounter.bothAccepted()) {
                startDuel(encounter, tick, avatarComponents, sendTo, rebroadcastPlayerStates);
            }
            return;
        }

        encounter.decline(playerId);
        cancelEncounter(encounter, EncounterState.ENC_DECLINED, avatarView, sendTo);
    }

    public void onPlayerLeave(long playerId) {
        Iterator<Map.Entry<String, Encounter>> iterator = encounters.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<String, Encounter> entry = iterator.next();
            if (entry.getValue().hasPlayer(playerId)) {
                pairToEncounterId.remove(Encounter.pairKey(
                        entry.getValue().lowerPlayerId(),
                        entry.getValue().higherPlayerId()));
                iterator.remove();
            }
        }
    }

    private void offerNewEncounters(
            long tick,
            List<Long> playerIds,
            LongFunction<AvatarView> avatarView,
            Function<Long, Boolean> inActiveQuiz,
            BiConsumer<Long, GameMessage> sendTo
    ) {
        for (int i = 0; i < playerIds.size(); i++) {
            long playerA = playerIds.get(i);
            AvatarView viewA = avatarView.apply(playerA);
            if (!isEligible(viewA, inActiveQuiz.apply(playerA))) {
                continue;
            }
            for (int j = i + 1; j < playerIds.size(); j++) {
                long playerB = playerIds.get(j);
                if (pairToEncounterId.containsKey(Encounter.pairKey(playerA, playerB))) {
                    continue;
                }
                AvatarView viewB = avatarView.apply(playerB);
                if (!isEligible(viewB, inActiveQuiz.apply(playerB))) {
                    continue;
                }
                if (!detector.withinRadius(
                        viewA.position().x(),
                        viewA.position().y(),
                        viewB.position().x(),
                        viewB.position().y())) {
                    continue;
                }
                createOffer(playerA, playerB, tick, avatarView, sendTo);
            }
        }
    }

    private void refreshActiveEncounters(
            long tick,
            LongFunction<AvatarView> avatarView,
            LongFunction<QuestAvatarComponent> avatarComponents,
            BiConsumer<Long, GameMessage> sendTo,
            Runnable rebroadcastPlayerStates
    ) {
        List<Encounter> snapshot = new ArrayList<>(encounters.values());
        for (Encounter encounter : snapshot) {
            if (encounter.isExpired(tick)) {
                cancelEncounter(encounter, EncounterState.ENC_CANCELLED, avatarView, sendTo);
                continue;
            }
            if (encounter.anyDeclined()) {
                cancelEncounter(encounter, EncounterState.ENC_DECLINED, avatarView, sendTo);
                continue;
            }
            AvatarView lower = avatarView.apply(encounter.lowerPlayerId());
            AvatarView higher = avatarView.apply(encounter.higherPlayerId());
            if (!pairStillInRadius(lower, higher)) {
                cancelEncounter(encounter, EncounterState.ENC_CANCELLED, avatarView, sendTo);
                continue;
            }
            if (encounter.bothAccepted()) {
                startDuel(encounter, tick, avatarComponents, sendTo, rebroadcastPlayerStates);
            }
        }
    }

    private void createOffer(
            long playerA,
            long playerB,
            long tick,
            LongFunction<AvatarView> avatarView,
            BiConsumer<Long, GameMessage> sendTo
    ) {
        String encounterId = "enc-" + playerA + "-" + playerB + "-" + (++nextEncounterSeq);
        long deadline = tick + EncounterDetector.offerDurationTicks();
        Encounter encounter = new Encounter(encounterId, playerA, playerB, deadline);
        encounters.put(encounterId, encounter);
        pairToEncounterId.put(Encounter.pairKey(playerA, playerB), encounterId);
        notifyOfferState(encounter, EncounterState.ENC_OFFERED, avatarView, sendTo);
    }

    private void startDuel(
            Encounter encounter,
            long tick,
            LongFunction<QuestAvatarComponent> avatarComponents,
            BiConsumer<Long, GameMessage> sendTo,
            Runnable rebroadcastPlayerStates
    ) {
        removeEncounter(encounter);
        duelManager.startDuel(
                encounter.encounterId(),
                encounter.lowerPlayerId(),
                encounter.higherPlayerId(),
                tick,
                avatarComponents,
                sendTo,
                rebroadcastPlayerStates);
    }

    private void cancelEncounter(
            Encounter encounter,
            EncounterState state,
            LongFunction<AvatarView> avatarView,
            BiConsumer<Long, GameMessage> sendTo
    ) {
        notifyOfferState(encounter, state, avatarView, sendTo);
        removeEncounter(encounter);
    }

    private void removeEncounter(Encounter encounter) {
        encounters.remove(encounter.encounterId());
        pairToEncounterId.remove(Encounter.pairKey(encounter.lowerPlayerId(), encounter.higherPlayerId()));
    }

    private void notifyOfferState(
            Encounter encounter,
            EncounterState state,
            LongFunction<AvatarView> avatarView,
            BiConsumer<Long, GameMessage> sendTo
    ) {
        sendOffer(encounter.lowerPlayerId(), encounter, encounter.higherPlayerId(), avatarView, state, sendTo);
        sendOffer(encounter.higherPlayerId(), encounter, encounter.lowerPlayerId(), avatarView, state, sendTo);
    }

    private static void sendOffer(
            long toPlayerId,
            Encounter encounter,
            long opponentPlayerId,
            LongFunction<AvatarView> avatarView,
            EncounterState state,
            BiConsumer<Long, GameMessage> sendTo
    ) {
        AvatarView opponent = avatarView.apply(opponentPlayerId);
        String opponentName = opponent.avatar() != null ? opponent.avatar().name() : "Explorer";
        EncounterOffer offer = EncounterOffer.newBuilder()
                .setEncounterId(encounter.encounterId())
                .setOpponentPlayerId(opponentPlayerId)
                .setOpponentName(opponentName)
                .setState(state)
                .setDeadlineTick(encounter.offerDeadlineTick())
                .build();
        sendTo.accept(toPlayerId, GameMessage.newBuilder()
                .setTq(TreasureQuestMessage.newBuilder().setEncounterOffer(offer).build())
                .build());
    }

    private boolean pairStillInRadius(AvatarView lower, AvatarView higher) {
        if (lower == null || higher == null || lower.position() == null || higher.position() == null) {
            return false;
        }
        return detector.withinRadius(
                lower.position().x(),
                lower.position().y(),
                higher.position().x(),
                higher.position().y());
    }

    private static boolean isEligible(AvatarView view, boolean inActiveQuiz) {
        return view != null
                && view.position() != null
                && EncounterDetector.isEligible(view.avatar(), inActiveQuiz);
    }

    private static boolean pairStillValid(
            AvatarView self,
            AvatarView opponent,
            boolean selfInQuiz,
            boolean opponentInQuiz
    ) {
        return isEligible(self, selfInQuiz) && isEligible(opponent, opponentInQuiz);
    }
}
