# Implementation Plan — Long-Function Refactor

## Overview

Reduce overly long functions across the codebase into small, single-responsibility units,
**without changing behavior**. This is a *refactor* plan: every task must be
behavior-preserving and backed by tests (existing or newly added as a safety net). We do
**not** attempt to fix every long method in one pass — we tier by value (logic complexity ×
change frequency), fix the high-value ones as discrete tasks, and set a **policy + optional
lint gate** so the rest is handled incrementally and does not regress.

### "Too long" — the measurable definition used here
A function is a refactor candidate when **any** holds:
- Java method body **> 50 lines**, or **> 40 lines with nesting depth ≥ 3**.
- TS/JS function **> 60 lines**, or **> 45 lines with nesting depth ≥ 3**.
- More than one clear responsibility regardless of length (e.g. "validate + mutate +
  broadcast" in one body).

Raw length alone is a weak signal: a flat 90-line Phaser `create()` that only wires UI
sequentially is *lower* priority than a 79-line method with nested branching and shared
mutable state. Tasks are ordered by **value/risk**, not by line count.

### Measured inventory (source only; tests excluded from scope)
Worst offenders found by an AST-ish line scan (`>= 40` lines):

**Java (main):**
| Lines | Location | Tests? |
|------:|----------|--------|
| 79 | `tankarena …/systems/CollisionSystem.java:63` `resolveBulletCollisions()` | ✅ 3 |
| 66 | `launcher …/TriforgeServer.java:22` `main()` | ⚠️ boot |
| 58 | `server …/netty/CommandDispatcher.java:29` `channelRead0()` | ✅ 1 |
| 56 | `treasurequest …/TreasureQuestGame.java:726` `handleInteract()` | ✅ 10 |
| 54 | `server …/netty/StaticFileHandler.java:17` `channelRead0()` | ❌ 0 |
| 54 | `tankarena …/vision/FogOfWarCalculator.java:67` `castLight()` | ✅ 1 |
| 52 | `treasurequest …/TreasureQuestGame.java:1014` `handleItemUse()` | ✅ 10 |
| 52 | `treasurequest …/TreasureQuestGame.java:808` `completeQuizAttempt()` | ✅ 10 |
| 50 | `treasurequest …/pvp/DuelManager.java:130` `completeDuel()` | ❌ 0 |
| 42 | `treasurequest …/pvp/EncounterManager.java:71` `handleChallengeResponse()` | ❌ 0 |

**TypeScript (main):**
| Lines | Location |
|------:|----------|
| 92 | `treasurequest …/scenes/LobbyScene.ts:42` `create()` |
| 92 | `treasurequest …/admin/AdminApp.ts:273` `renderQuestionEditor()` |
| 92 | `tankarena …/scenes/LobbyScene.ts:39` `create()` |
| 81 | `tankarena …/scenes/RoomLobbyScene.ts:203` `buildControls()` |
| 79 | `tankarena …/scenes/RoomLobbyScene.ts:307` `syncControls()` |
| 75 | `treasurequest …/scenes/GameScene.ts:252` `onTreasureQuestMessage()` |
| 75 | `treasurequest …/admin/AdminApp.ts:48` `mountUi()` |
| 72 | `treasurequest …/admin/AdminApp.ts:392` `renderCheckpointRow()` |
| 67 | `tankarena …/scenes/GameScene.ts:526` `handleGameEvent()` |
| 50 | `frontend/shared-ui/src/net/client.ts:275` `handleMessage()` |

(Plus several 50–62 line scene `create()` / `renderRoomList()` / `renderHostList()`
methods — Tier C, policy-driven, not enumerated.)

## Architecture Decisions

- **Behavior-preserving only.** No logic/API/wire changes. Extract Method, Replace
  Conditional with Guard Clause / polymorphism, Introduce Parameter Object, and
  Replace-switch-with-dispatch-map are the sanctioned moves.
- **Safety-net-first.** A method with **0 tests** gets a *characterization test* (pins
  current observable behavior) committed **before** it is touched. Methods already covered
  rely on the existing suite; add focused unit tests for any newly extracted method with
  non-trivial logic.
- **One method (or one cohesive cluster) per task.** Each task compiles, passes tests, and
  is independently shippable/revertable. No big-bang branch.
- **Extract private helpers in the same class by default.** Only promote to a new class when
  the extracted logic is reused or has its own state/identity — avoid class-explosion.
- **Tier by value, cap the scope.** Tier A (complex logic) is done as discrete tasks; Tier
  B (dispatch/UI) grouped; Tier C (flat UI setup) is deferred to a standing policy + lint
  gate rather than enumerated tasks, so the plan stays finite.
- **Regression guard.** Introduce a method-length lint/verify gate (Checkstyle
  `MethodLength` for Java; an ESLint `max-lines-per-function` for TS) at a *lenient* bound
  (e.g. 60/70) so new long methods are flagged without forcing a mass rewrite of Tier C now.
- **God-class note (out of scope):** `TreasureQuestGame.java` (1161 lines) is a god class;
  its long methods are symptoms. This plan shortens the *methods*; splitting the *class* is
  a separate future plan — do not attempt here.
- **Synergy with plan-002:** `CommandDispatcher.channelRead0()` is about to gain a
  `CHATCOMMAND` case. Refactoring it into a dispatch map here makes that addition trivial —
  sequence this task before/with plan-002 Task 3 where convenient. See [[room-chat-infra-plan]].

---

## Task List

### Task 1: Regression guard — method-length lint/verify gate

#### Description
Add a lenient automated method-length check so new offenders are caught and the tiered
cleanup can proceed without a deadline. Lenient bound now; can be tightened later.

#### Acceptance Criteria
- [ ] Java: Checkstyle `MethodLength` (max ~60, count non-comment lines) wired into the
      build (warning or `verify`-bound), excluding generated/`target` code.
- [ ] TS: ESLint `max-lines-per-function` (~70, skip blank/comments) for `frontend`/`games`
      `src`, excluding generated `proto.*`.
- [ ] Current build still passes (bound chosen so only known Tier A/B offenders warn).

#### Verification
- [ ] `mvn -q checkstyle:check` (or `verify`) runs; `npm run lint` runs in a frontend package.
- [ ] Gate flags at least the top offenders in the inventory and nothing spurious.

#### Dependencies
- None

#### Files
- root `pom.xml` / `checkstyle.xml` (new or existing plugin config)
- `frontend/*/.eslintrc*`, `games/*/frontend/.eslintrc*` (or shared config)

#### Scope
- S

---

### Task 2: Safety-net tests for untested Tier-A targets

#### Description
Add characterization tests for the three high-complexity methods that currently have **zero**
coverage, so their refactors (Tasks 4–5) are safe.

#### Acceptance Criteria
- [ ] `DuelManager.completeDuel()` — test pins winner/tie resolution + score deltas for
      representative inputs.
- [ ] `EncounterManager.handleChallengeResponse()` — test pins accept/decline/timeout paths.
- [ ] `StaticFileHandler.channelRead0()` — test pins served-vs-404 and path-resolution
      behavior (may reuse `StaticAssetResolverTest` patterns already in the tree).

#### Verification
- [ ] New tests pass against **current** (un-refactored) code — they characterize, not change.
- [ ] `mvn -pl games/treasurequest/plugin test` and `mvn -pl server/server-runtime test` pass.

#### Dependencies
- None (can run parallel with Task 1)

#### Files
- `games/treasurequest/plugin/src/test/java/.../pvp/DuelManagerTest.java` (new)
- `games/treasurequest/plugin/src/test/java/.../pvp/EncounterManagerTest.java` (new)
- `server/server-runtime/src/test/java/.../netty/StaticFileHandlerTest.java` (new)

#### Scope
- M

---

## Checkpoint A (after Tasks 1–2)
- [ ] Lint/verify gate active; `mvn clean test` green.
- [ ] Every Tier-A target now has test coverage (existing or new). Safe to refactor.

---

### Task 3: Refactor `CollisionSystem.resolveBulletCollisions()` (79 → small)

#### Description
Split the 79-line method along its two responsibilities: **(a)** detection loop building the
`pendingTankHits` / `pendingHqHits` / `bulletsToDestroy` lists, and **(b)** the deferred
mutation/dispatch pass. Extract `detectBulletHits(...)`, `applyBulletDestruction(...)`, and
`dispatchPendingHits()` (or similar) as private helpers.

#### Acceptance Criteria
- [ ] `resolveBulletCollisions()` becomes a short orchestrator (~≤ 20 lines) calling helpers.
- [ ] The "mutate only after iteration" invariant is preserved and documented at the seam.
- [ ] No behavior change: identical hit/destroy/HQ-damage outcomes.

#### Verification
- [ ] Existing `CollisionSystem` tests (3) pass unchanged.
- [ ] `mvn -pl games/tankarena/plugin test` passes.

#### Dependencies
- Checkpoint A

#### Files
- `games/tankarena/plugin/src/main/java/com/triforge/games/tankarena/systems/CollisionSystem.java`

#### Scope
- S

---

### Task 4: Refactor TreasureQuest hot methods (`handleInteract`, `handleItemUse`, `completeQuizAttempt`)

#### Description
Each method is a long guard-clause chain + an action. Extract the validation cascade into a
small resolver returning early/typed result, and the action tail into a focused helper
(e.g. `startQuiz(...)`, `applyItem(...)`, `awardQuizResult(...)`). Same-class private helpers.

#### Acceptance Criteria
- [ ] Each of the three methods reduced to a readable orchestrator; guard chains extracted.
- [ ] No change to messages sent, state transitions, or scoring.
- [ ] Extracted helpers with real logic get a focused unit test.

#### Verification
- [ ] Existing TreasureQuest suite (10 files) passes unchanged.
- [ ] `mvn -pl games/treasurequest/plugin test` passes.

#### Dependencies
- Checkpoint A

#### Files
- `games/treasurequest/plugin/src/main/java/com/triforge/games/treasurequest/TreasureQuestGame.java`

#### Scope
- M

---

### Task 5: Refactor PvP + fog + static-file methods

#### Description
Behavior-preserving splits of `DuelManager.completeDuel()`, `EncounterManager.
handleChallengeResponse()`, `FogOfWarCalculator.castLight()`, and
`StaticFileHandler.channelRead0()` into intent-named helpers.

#### Acceptance Criteria
- [ ] Each target reduced below the lint bound; single-responsibility helpers extracted.
- [ ] `castLight()` recursion/shadow-cast math unchanged (extract sub-steps, not algorithm).
- [ ] No behavior change across all four.

#### Verification
- [ ] Safety-net tests from Task 2 + existing fog test pass unchanged.
- [ ] `mvn -pl games/treasurequest/plugin test`, `-pl games/tankarena/plugin test`,
      `-pl server/server-runtime test` all pass.

#### Dependencies
- Checkpoint A, Task 2

#### Files
- `games/treasurequest/plugin/.../pvp/DuelManager.java`
- `games/treasurequest/plugin/.../pvp/EncounterManager.java`
- `games/tankarena/plugin/.../vision/FogOfWarCalculator.java`
- `server/server-runtime/.../netty/StaticFileHandler.java`

#### Scope
- M

---

### Task 6: Refactor `CommandDispatcher.channelRead0()` into a dispatch map

#### Description
Replace the growing `switch(contentCase)` with a small `Map<ContentCase, Handler>` (or
per-case private methods), so each case is a named handler. Directly eases the plan-002
`CHATCOMMAND` addition.

#### Acceptance Criteria
- [ ] `channelRead0()` becomes short routing; each case body is an extracted handler.
- [ ] Identical routing/logging/`PLAYER_ID_KEY` guarding behavior.
- [ ] Adding a new message case is a one-line registration.

#### Verification
- [ ] Existing `CommandDispatcher` test passes; add a case-routing unit test if cheap.
- [ ] `mvn -pl server/server-runtime test` passes.

#### Dependencies
- Checkpoint A

#### Files
- `server/server-runtime/src/main/java/com/triforge/server/transport/netty/CommandDispatcher.java`

#### Scope
- S

---

## Checkpoint B (after Tasks 3–6)
- [ ] All Java Tier-A/relevant-B offenders below the lint bound.
- [ ] `mvn clean test` green; zero behavior change (no test *modified*, only added).
- [ ] Diff is pure extraction — reviewable as such.

---

### Task 7: Refactor TypeScript Tier-B methods (dispatch/UI logic)

#### Description
Frontend has **no automated tests**, so these are extract-only, low-branching splits verified
by build + manual smoke. Targets: `treasurequest GameScene.onTreasureQuestMessage()` and
`tankarena GameScene.handleGameEvent()` (message routers → per-type handlers);
`RoomLobbyScene.buildControls()` / `syncControls()`; `AdminApp.renderQuestionEditor()` /
`mountUi()` / `renderCheckpointRow()` (extract row/section builders).

#### Acceptance Criteria
- [ ] Message-router methods become a small switch delegating to named handlers.
- [ ] UI builders extract per-section/per-row helpers; no DOM/behavior change.
- [ ] `client.ts handleMessage()` (50) optionally aligned with the dispatch-map style.

#### Verification
- [ ] `npm run build` in each affected frontend package succeeds (`tsc` clean).
- [ ] Manual smoke: lobby renders, admin editor edits, in-game events display correctly.

#### Dependencies
- Task 1 (lint bound)

#### Files
- `games/treasurequest/frontend/src/scenes/GameScene.ts`, `.../admin/AdminApp.ts`
- `games/tankarena/frontend/src/scenes/GameScene.ts`, `.../scenes/RoomLobbyScene.ts`
- `frontend/shared-ui/src/net/client.ts` (optional)

#### Scope
- M

---

## Checkpoint C (after Task 7)
- [ ] All targeted frontends build clean; manual smoke passes.
- [ ] Plan document moved to `planning/archive/`.

---

## Tier C — standing policy (NOT enumerated tasks)
The many 45–92 line Phaser `create()` / `renderRoomList()` / `renderHostList()` /
`loadRoomsForSelectedHost()` methods are mostly **flat sequential UI setup** — low branching,
low bug risk. Enumerating them would bloat this plan into a "refactor everything" anti-pattern.
Instead:
- The Task-1 lint gate flags them.
- Refactor **opportunistically** when a file is touched for other reasons (boy-scout rule).
- Track as a lightweight backlog, not blocking tasks.

## Risks

- **Silent behavior drift** during extraction — mitigated by safety-net-first (Task 2) and
  "add tests, never modify tests" discipline; any test edit is a red flag to review.
- **Frontend has no test net** — TS refactors (Task 7) rely on `tsc` + manual smoke; keep
  those changes mechanical (pure extraction) and small per commit.
- **Over-extraction / helper sprawl** — extracting 1-line helpers hurts readability. Only
  extract cohesive blocks; prefer same-class privates over new classes.
- **Merge churn vs plan-002** — Task 6 and plan-002 both touch `CommandDispatcher`. Sequence
  Task 6 first, or fold the dispatch-map refactor into plan-002 Task 3.
- **God-class temptation** — resist splitting `TreasureQuestGame` here; that is a separate
  plan with its own risk profile.

## Open Questions

1. **Lint gate strictness:** start lenient (60/70) as proposed, or go strict (50) and accept
   that Tier C must be cleared before the build is green? *Recommend lenient now, tighten later.*
2. **Scope of Task 7:** all listed TS methods, or only the two message-router methods
   (highest value) and defer pure UI builders to the Tier-C boy-scout policy?
3. **`TriforgeServer.main()` (66):** refactor bootstrap into `configure()/wire()/start()`
   steps in this plan, or leave (it is boot glue, changes rarely)? *Recommend leave for now.*
