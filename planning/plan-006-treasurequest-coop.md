# Implementation Plan — TreasureQuest → Co-op Exploration

> **In-place transform of the existing `treasurequest` plugin** from a competitive
> individual quiz-race into a **cooperative, party-shared quest**. No new plugin, no new
> module. The competitive/PvP game is retired; the whole room becomes one party that shares
> quest progression, inventory, and a single shared victory.

## Overview

### The pivot
Originally scoped as a new `questworld` plugin. Decision changed: build the co-op exploration
game **by transforming TreasureQuest itself**. TreasureQuest already provides the exact
mechanic we want — a checkpoint **graph** you traverse, gated by **quizzes (puzzles)**, ending
at a **treasure**. The only thing that makes it "competitive" is that all state is
**per-player** and the win is an **individual race**. Flip those two things and it is already
a co-op quest.

### What TreasureQuest is today (the starting point)
`TreasureQuestGame` (1224 lines) runs a per-player competitive expedition:
- **Per-player state** keyed by `playerId`: `expeditionStates` (checkpoint unlock/clear DAG),
  `inventories`, `checkpointStates`, `activeQuizSessions`, `comboStreaks`.
- **Individual race win**: `checkTreasureWin()` → first player to reach the treasure zone
  (after clearing the boss) wins; `endMatchOnTimeCap()` ranks players on a timer.
- **Full PvP layer**: `pvp/` (`EncounterManager`, `DuelManager`, `EncounterDetector`,
  `Duel`, `Encounter`, `DuelScorer`), `scoring/` (`Leaderboard`, `PowerCalculator`,
  `ComboStreak`), plus PvP avatar state (`shielded`, `pvpCooldown`, `stealImmune`, `inDuel`)
  and griefing items (`FAKE_MAP`, `TREASURE_LOCK`).

### Target: co-op
- **One shared party = the whole room's match.** A single shared `ExpeditionState` and a
  single shared `Inventory`. When **any** member clears a checkpoint quiz, the party's
  progression advances and newly unlocked checkpoints open for everyone.
- **Shared victory.** When the party has cleared the boss and **any** member reaches the
  treasure, **everyone wins together** (no individual winner).
- **PvP deleted.** No encounters, duels, steal, shields, cooldowns, leaderboard, or
  power/combo scoring. Griefing items removed.

### What stays (reused as-is)
Avatar movement + collision (`MovementSystem`, `WorldBoundsCollisionSystem`,
`MapCollisionSystem`, `AvatarEntityFactory`, `input/RoomInputProcessor`), the ECS/snapshot
sync path, the `QuestMap` + checkpoint graph + treasure zone content, the **quiz engine**
(`QuizSession`, `QuizScorer`, `QuizPromptBuilder`) as the puzzle mechanic, the content store,
and lobby/match phases.

### MVP-0 scope (this plan)
The smallest transform that yields a playable co-op quest:
- The whole room is one party; **shared** expedition + inventory.
- Any member clearing a checkpoint quiz advances the party; unlocks open for all.
- Party roster + shared progress + shared inventory broadcast to every member.
- Reaching the treasure = **shared win** for the whole party.
- Team chat: reuse existing room chat (plan-002).

### Explicit non-goals (Future Work)
Dedicated NPC dialogue objects, an explicit "collect N stones" quest authored as new content
(the checkpoint graph already delivers the loop), task-splitting between members, multiple
parties per room, cross-restart persistence, and art polish. All are additive on the seams
this plan establishes; none require reworking it.

---

## Architecture Decisions

### AD-1 — One shared party = the room match; state in a `PartyState` object
- Replace the per-player maps (`expeditionStates`, `inventories`, and the competitive
  `comboStreaks`) with a **single shared `PartyState`** owned by the game for the duration of
  a match. `checkpointStates` and `activeQuizSessions` stay **per-player** (each avatar
  physically stands in a zone and solves a quiz individually) — but their *results* mutate the
  shared `PartyState`.
- `PartyState` is a real object, not scattered fields. v1 has exactly one instance per room.
  Multi-party-per-room is future work but the container shape makes it additive (mirrors
  oanquan's "multi-table rooms are future work").

### AD-2 — Hybrid state unchanged: spatial in ECS, progression in services
- Avatar position/orientation stay in ECS components riding `EntityProto` delta-sync (no
  change — TreasureQuest already does this).
- Shared progression/inventory live in the plain-Java `PartyState`, broadcast via the `tq`
  message arm. Quiz sessions remain event-driven services. (Consistent with the current
  design; we are only collapsing per-player → shared.)

### AD-3 — In-memory only (unchanged)
- TreasureQuest already persists nothing; a match dies with the room. Co-op keeps this. No
  persistence work in v1. (If added later, `PartyState` is the single serialization seam.)

### AD-4 — Wire: extend the existing `tq` arm, keep the current seam
- Keep routing through `TreasureQuestMessage` (`GameMessage.tq`) and the existing
  `queueTreasureQuestMessage` → `handleTreasureQuestMessage` path. **No new `GameMessage`
  arm**, no new `CommandDispatcher` case.
- Add co-op messages to `TreasureQuestMessage`: a **party roster** and a **shared quest/party
  state** broadcast. Reuse existing `QuizPrompt`/`QuizResult`/`HintReveal`/`InventoryUpdate`
  where they still apply (the quiz mechanic is unchanged).
- **Deprecate, don't delete, PvP proto arms** (`encounterOffer`, `duelPrompt`, `duelResult`,
  `challengeResponse`, `duelSubmit`, `leaderboard`) — proto3 lets them sit unused. Removing
  proto fields + regenerating TS is churn deferred to an optional cleanup task.

### AD-5 — Content is data (unchanged)
- The world/checkpoint/quiz content keeps loading from the existing `TreasureQuestContentStore`
  / `QuestMap` / `QuizCatalog`. No content-schema change for MVP. Adding NPC dialogue objects
  later extends this store (future work).

---

## Wire Contract (proto additions)

Added to `TreasureQuestMessage` in `proto/envelope.proto`; regenerate Java + TS
(`npm run proto` in `frontend/shared-ui`). Prefixed enum names stay unique file-wide.

```proto
// server → all party members: roster of the room's single co-op party.
message TQParty {
  repeated TQPartyMember members = 1;
}
message TQPartyMember {
  uint64 playerId = 1;
  string name = 2;
  bool isHost = 3;
}

// server → all party members: authoritative shared expedition progress.
// Replaces the per-player race framing; everyone sees the same numbers.
message TQPartyProgress {
  repeated string clearedCheckpoints = 1;
  repeated string unlockedCheckpoints = 2;
  bool bossCleared = 3;
  int32 partyScore = 4;                  // sum of members' quiz points (co-op tally)
  repeated InventoryItemProto sharedInventory = 5;
}

// server → all: the party won together (reached the treasure).
message TQPartyVictory {
  repeated TQContribution contributions = 1;  // per-member breakdown for the win screen
  uint64 matchDurationMs = 2;
}
message TQContribution {
  uint64 playerId = 1;
  string name = 2;
  int32 checkpointsCleared = 3;
  int32 score = 4;
}
```

Add these three arms to the `TreasureQuestMessage` oneof (next free field numbers):
`TQParty party = 16; TQPartyProgress partyProgress = 17; TQPartyVictory partyVictory = 18;`

---

## Task List

All work is inside `games/treasurequest/plugin` (Java) and `games/treasurequest/frontend`.
Tasks are ordered so the game **compiles and tests pass after every task**. We transform the
shared mechanic first, then delete the competitive layers, so the "keep" set is always green.

### Task 1: Characterize the "keep" set before touching anything
#### Description
Confirm/add tests pinning the mechanics we intend to **preserve** through the transform:
avatar movement + world-bounds/map collision, checkpoint zone detection + graph advance on
quiz pass, and quiz scoring. These are the safety net; the competitive tests
(`DuelFlowTest`, `EncounterInteractionTest`, `LeaderboardBroadcastTest`, `PvpProtectionTest`,
`PowerCalculatorTest`, `LeaderboardTest`, `DuelScorerTest`, `EncounterDetectorTest`) are
**not** preserved — they get deleted with their classes in Tasks 5–6.
#### Acceptance Criteria
- [ ] A test pins: quiz pass → `ExpeditionState.onCheckpointPassed` unlocks `next()`.
- [ ] A test pins: movement + bounds/map collision keep an avatar in-map.
- [ ] `mvn -pl games/treasurequest/plugin test` green on current code.
#### Verification
- [ ] Run the module tests; the keep-set tests exist and pass against un-transformed code.
#### Dependencies
None.
#### Files
`games/treasurequest/plugin/src/test/**` (new/confirmed keep-set tests).
#### Scope
Tests only; no production change.

### Task 2: Introduce `PartyState`; make expedition + inventory shared
#### Description
Add a `party/PartyState` holding one shared `ExpeditionState`, one shared `Inventory`, and a
running `partyScore`. In `TreasureQuestGame`, replace the per-player `expeditionStates`,
`inventories`, and `comboStreaks` maps with the single `PartyState` (created in
`spawnLobbyPlayers`, cleared in `stop`/`despawnAllEntities`). Rewire all reads/writes:
- `spawnLobbyPlayers`: start **one** shared expedition at `startCheckpointId`, one empty
  shared inventory.
- `completeQuizAttempt`: a member's pass advances the **shared** expedition, grants reward
  into the **shared** inventory, and adds points to `partyScore`. Newly unlocked checkpoints
  become available to **every** player's `refreshExpeditionZones`.
- `refreshExpeditionZones` / `resolveCheckpointState` / `handleInteract`: read the shared
  expedition instead of `expeditionStates.get(playerId)`.
#### Acceptance Criteria
- [ ] Two players: player A clears checkpoint X → player B's `unlockedTargets` now includes
      X's `next()` (shared unlock).
- [ ] Reward item from any member's pass lands in the one shared inventory.
- [ ] `mvn -pl games/treasurequest/plugin test` green (keep-set + new sharing test).
#### Verification
- [ ] New unit test drives two players and asserts shared progression + inventory.
#### Dependencies
Task 1.
#### Files
`.../party/PartyState.java`, `TreasureQuestGame.java` (field + method rewiring).
#### Scope
Sharing only. PvP/scoring still present but now read a shared inventory where relevant;
do **not** delete them yet.

### Task 3: Shared win condition; drop individual ranking
#### Description
Rewrite the endgame for co-op:
- `checkTreasureWin`: use the **shared** expedition's `treasureAccessible`; when any member
  overlaps the treasure zone, trigger a **party victory** (not an individual winner).
- Replace `broadcastExpeditionComplete(winner)` with a `TQPartyVictory` broadcast to all
  members (per-member `TQContribution` breakdown; every client shows "You won").
- `endMatchOnTimeCap`: remove leader ranking; on the time cap the party simply fails/partial
  (broadcast final progress, end match). No `PowerCalculator`/leaderboard involved.
#### Acceptance Criteria
- [ ] Any member reaching the treasure (boss cleared) ends the match as a **shared** win;
      all clients receive `TQPartyVictory`.
- [ ] Time cap ends the match without an individual winner or leaderboard.
- [ ] `mvn -pl games/treasurequest/plugin test` green.
#### Verification
- [ ] Unit test: shared expedition boss-cleared + treasure overlap → party victory to all.
#### Dependencies
Task 2.
#### Files
`TreasureQuestGame.java`, proto (`TQPartyVictory`), regenerated sources.
#### Scope
Win/lose flow only.

### Task 4: Party roster + shared-progress broadcast
#### Description
Broadcast co-op state:
- On join/leave and match start, broadcast `TQParty` (roster) to all members.
- Replace the per-player `sendPlayerStateUpdate` competitive fields with a shared
  `TQPartyProgress` broadcast (cleared/unlocked checkpoints, `bossCleared`, `partyScore`,
  shared inventory) sent to **all** members whenever the shared state changes (checkpoint
  cleared, item gained). Keep a lean per-player message only for things that are genuinely
  per-player (e.g. "you are in a checkpoint zone; press interact").
#### Acceptance Criteria
- [ ] All members receive the same `TQPartyProgress` after any member's checkpoint clear.
- [ ] Roster updates on join/leave.
- [ ] `mvn -pl games/treasurequest/plugin test` green.
#### Verification
- [ ] Unit test asserts every connected member receives the shared broadcast.
#### Dependencies
Tasks 2–3.
#### Files
`TreasureQuestGame.java`, proto (`TQParty`, `TQPartyProgress`), regenerated sources.
#### Scope
Broadcast surface only.

### Task 5: Delete the PvP layer
#### Description
Remove the entire competitive-interaction subsystem now that nothing writes co-op state
through it:
- Delete package `pvp/` (`EncounterManager`, `DuelManager`, `EncounterDetector`, `Duel`,
  `Encounter`, `DuelScorer`) and its tests (`DuelFlowTest`, `EncounterInteractionTest`,
  `PvpProtectionTest`, `DuelScorerTest`, `EncounterDetectorTest`).
- Remove from `TreasureQuestGame`: `updateEncounters`, `handleChallengeResponse`,
  `handleDuelSubmit`, `avatarView`, `refreshAvatarProtection`, `grantQuizShield`,
  `playerInDuel/Shielded/PvpCooldown/StealImmune`, `setPlayerShielded`, `duelManager()`, and
  the `CHALLENGERESPONSE`/`DUELSUBMIT` cases in `handleTreasureQuestMessage`.
- Simplify `QuestAvatarComponent`: drop `shielded`/`pvpCooldown`/`stealImmune`/`inDuel`
  behavior (leave the proto fields set to false — see AD-4).
#### Acceptance Criteria
- [ ] `pvp/` package and its tests are gone; project compiles.
- [ ] No remaining references to encounter/duel/shield logic in the game loop.
- [ ] `mvn -pl games/treasurequest/plugin test` green.
#### Verification
- [ ] Grep shows no `EncounterManager`/`DuelManager` usage; module tests pass.
#### Dependencies
Task 4 (co-op broadcast must already replace PvP-driven `rebroadcastAllPlayerStates`).
#### Files
Delete `.../pvp/**` + PvP tests; edit `TreasureQuestGame.java`, `QuestAvatarComponent.java`.
#### Scope
Deletion only; behavior already routed around PvP by Tasks 2–4.

### Task 6: Delete competitive scoring + griefing items
#### Description
- Delete `scoring/` (`Leaderboard`, `PowerCalculator`, `ComboStreak`) and its tests
  (`LeaderboardTest`, `PowerCalculatorTest`, `LeaderboardBroadcastTest`).
- Remove leaderboard broadcasts (`refreshLeaderboardIfChanged`, `broadcastFinalLeaderboard`,
  `buildRankedEntries`, `broadcastLeaderboard`) and `playerPower`.
- Item cleanup: drop griefing items (`FAKE_MAP`, `TREASURE_LOCK`) from `ItemEffects` /
  `ItemUseValidator` / reward tables; keep co-op-friendly items (e.g. `SPEED`). `handleItemUse`
  now only applies self/party-beneficial effects.
#### Acceptance Criteria
- [ ] `scoring/` gone; no `Leaderboard`/`power`/`combo` references remain.
- [ ] Using a removed griefing item is impossible (not grantable, validator rejects).
- [ ] `mvn -pl games/treasurequest/plugin test` green.
#### Verification
- [ ] Grep clean for `Leaderboard`/`PowerCalculator`/`ComboStreak`; module tests pass.
#### Dependencies
Task 5.
#### Files
Delete `.../scoring/**` + tests; edit `TreasureQuestGame.java`, `items/**`.
#### Scope
Deletion + item table trim.

### Task 7: Frontend — co-op client
#### Description
Update `games/treasurequest/frontend`: remove PvP/duel/leaderboard UI; render the shared
party state instead. First sub-step: audit the current client's screens. Then:
- Party roster panel (`TQParty`).
- Shared progress tracker (`TQPartyProgress`): cleared/unlocked checkpoints, boss status,
  shared inventory, party score.
- Co-op victory screen (`TQPartyVictory`) with the per-member contribution breakdown.
- Keep the quiz UI (unchanged mechanic) and avatar rendering from snapshots.
- Regenerate TS proto (`npm run proto` in `frontend/shared-ui`) for the new messages.
#### Acceptance Criteria
- [ ] Two browsers in one room: clearing a checkpoint updates the shared tracker for both.
- [ ] No PvP/duel/leaderboard UI remains.
- [ ] Reaching the treasure shows the shared victory screen to all.
#### Verification
- [ ] `npm run build` in the frontend; manual two-tab co-op playthrough to a shared win.
#### Dependencies
Tasks 3–4 (server messages), Task 2 proto regen.
#### Files
`games/treasurequest/frontend/**`, `frontend/shared-ui` regenerated proto.
#### Scope
UI rewire to co-op; no art pass.

### Task 8: Docs + full green
#### Description
Update `AGENTS.md` (product paragraph + TreasureQuest description) to state TreasureQuest is
now a **co-op** party quest, not a competitive race. Note PvP removal. Run the full build.
#### Acceptance Criteria
- [ ] `AGENTS.md` describes co-op TreasureQuest accurately.
- [ ] `mvn clean test` green across all modules.
#### Verification
- [ ] Full reactor test run passes; docs reviewed.
#### Dependencies
Tasks 1–7.
#### Files
`AGENTS.md`.
#### Scope
Docs + verification.

---

## Checkpoints

### Checkpoint A — after Tasks 1–4
- [ ] Server-side co-op loop works: shared expedition + inventory, any member's checkpoint
      clear advances the party, shared victory on reaching the treasure. PvP still present in
      code but bypassed. `mvn -pl games/treasurequest/plugin test` green.

### Checkpoint B — after Tasks 5–6
- [ ] PvP + competitive scoring fully deleted; `TreasureQuestGame` is a lean co-op loop.
      `mvn clean test` green.

### Checkpoint C — after Tasks 7–8
- [ ] Playable co-op end-to-end in the browser with two+ tabs; shared victory screen; docs
      updated. MVP-0 done.

---

## Future Work (additive on these seams)
- **NPC dialogue + authored "collect N items" quests** as new content objects on the quest
  map (the checkpoint-quiz loop covers MVP; NPCs are flavor/structure on top).
- **Task-splitting** between members (per-member sub-objectives on the shared expedition).
- **Multiple parties per room**: `PartyState` is already the container — add party
  create/join + party-scoped broadcast filtering (an `InterestFilter` by party).
- **Cross-restart persistence**: serialize `PartyState`.
- **Proto cleanup**: remove the now-unused PvP/leaderboard arms from `TreasureQuestMessage`
  and regenerate (deferred to avoid mid-transform TS churn).
- **Optional rename** of the plugin/id to reflect co-op (kept as `treasurequest` for now to
  avoid breaking rooms/discovery).
- **Art pass**: models, low-poly world, weather (last on purpose).
```
