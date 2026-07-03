# Implementation Plan — TreasureQuest (2D In-World Adventure + Quiz)

> Status: **COMPLETE — archived 2026-07-01.** All tasks (1–20) implemented; Checkpoint G verified.
> Plan id: `001` · Game module: `games/treasurequest` · Plugin id: `treasurequest`
>
> ### Archival verification (2026-07-01)
> - `mvn clean test` — **BUILD SUCCESS**, whole reactor green (treasurequest module: 70
>   tests; server-runtime incl. `AdminHttpHandlerTest` 9 tests; no regressions).
> - `mvn clean package -pl launcher/triforge-server -am` — **BUILD SUCCESS**; all frontends
>   (shared-ui proto, tankarena, treasurequest, launcher-web) build; fat JAR (10 MB) bundles
>   107 treasurequest static assets alongside tankarena/demo.
> - **Not re-executed this pass:** the manual 2-browser end-to-end playtests (T9.6 / T10.5 /
>   T14.5 / T16 / T20.3). Completion rests on the passing automated suite + successful
>   frontend/JAR build; the frontend has no automated tests (gap tracked in `plan-003`).
> - Follow-ons spun out of this work: chat infra → `plan-002`; long-function / god-class
>   (`TreasureQuestGame.java` ~1161 LOC) refactor → `plan-003`.
>
> **Corrected model:** the game is a **2D in-game world** (avatars move on a rendered tile
> map, like Tank Arena) — an MMORPG/adventure-LAN + quiz. **Not** real-world GPS. Positioning
> is authoritative in-engine movement; proximity is real 2D distance between avatars.

## Overview

A new **GamePlugin** where players control avatars on a 2D tile map. **Checkpoints** are
zones placed on the map; walking your avatar into your current checkpoint opens a **quiz**.
Answering well earns points + reveals the next hint/location; players race **branching
checkpoint routes** (safe vs dangerous) → **boss** → **treasure**, and the **first to the
treasure wins**. When two avatars are **near each other** (2D distance < R), a **mini-quiz
duel** can trigger; the winner steals a slice of the loser's points. **Items** (Shield, Speed,
Fake Map, Treasure Lock) add tactics; a combined **Power** formula and **leaderboard** rank
live standings (the treasure race decides the winner). **Admin** authors quiz sets, checkpoint
placement, and hints.

This reuses the Tank Arena engine path almost entirely — ECS, `MovementSystem`, tile map,
snapshot/delta broadcast, Phaser client — and **replaces combat** (bullets, shooting, HQ, fog,
teams) with checkpoint/quiz/duel mechanics. It does not modify Tank Arena.

### Decisions locked with the user
- **World model:** 2D in-game map, authoritative 60-TPS movement. **Free 2D velocity** (smooth
  WASD/arrows) reusing `InputCommand` → `InputComponent` → `MovementSystem` → `PositionComponent`.
  Clients render server state only.
- **Reaching a checkpoint:** avatar enters the checkpoint's zone (AABB overlap) → quiz becomes
  available; opened via an interact action. (No GPS, no manual injection.)
- **Route:** **branching (risk/reward)** — a checkpoint graph, not a single line. Safe branches
  give fewer points; dangerous branches give more points but sit in tighter/central map areas
  with higher PvP exposure. Branches merge before the boss.
- **Win condition:** **first-to-treasure** — the first player to reach the treasure zone (after
  clearing the boss) wins; the match **ends immediately for everyone** and results broadcast.
- **PvP proximity:** real 2D distance between avatar positions `< encounterRadius`.
- **PvP resolution:** mini-quiz duel (5 Q / 30 s); winner steals a % of loser's score.
- **Power formula:** `Knowledge + Equipment + Combo` drives the **live leaderboard and duel
  modifier only** — it does NOT decide the winner (the treasure race does).
- **Items:** Shield, Speed, plus **Fake Map** = send a decoy hint to a target (misdirect), and
  **Treasure Lock** = block a target from opening the boss/treasure for X seconds.
- **Scope:** full spec. **Persistence:** admin content as JSON on disk, mirroring `maps/*.json`.

## Architecture Decisions

### Placement & modules
- New Maven module `games/treasurequest/plugin`, artifact `treasurequest-game`, package
  `com.triforge.games.treasurequest`. ServiceLoader registration; wired into parent `pom.xml`
  (`<modules>` + `<dependencyManagement>`), `server-runtime`, and `triforge-server`.
  Build order: after `demo-game`, before `server-runtime`.
- **Scaffold from `games/tankarena/plugin`, not demo** — keep the ECS/movement/map/snapshot
  plumbing; delete combat: `BulletComponent`, `TankComponent`, `ShootingSystem`,
  `CollisionSystem`(bullet/HQ), `Headquarters*`, `FogOfWar*`, `Vision*`, `Team`/`SpawnRegion`
  team logic. Keep: `PositionComponent`, `DirectionComponent`, `InputComponent`,
  `CanControlComponent`, `MovementSystem`, `MapCollisionSystem`, `WorldBoundsCollisionSystem`,
  `RoomInputProcessor`, `GameMap`/`MapLoader`/`TileType`, `EntitySnapshotWriter` pattern.
- Frontend scaffolds from `games/tankarena/frontend` (**Phaser 3 + TS + Vite**), served at
  `/games/treasurequest/`, depends on `@triforge/shared-ui`.

### Engine reuse (movement & sync)
- Movement uses the existing `InputCommand` (`moveUp/Down/Left/Right`) → `RoomInputProcessor`
  → `InputComponent` → `MovementSystem` → `PositionComponent`, gated by `MapCollisionSystem`
  + `WorldBoundsCollisionSystem`. No new movement code beyond wiring.
- Snapshots reuse `broadcastStateSync` / `DeltaService` / `EntitySnapshotWriter` each tick
  (positions + quest fields), exactly like `TankArenaGame.onTick`.
- `InterestFilter`: **PassThrough** (whole map visible) for MVP; fog is out of scope (later swap).

### Contract-first: wire protocol
- **Spatial state** (avatar id, position, direction, score, checkpoint index, status flags)
  rides the existing `EntityProto` snapshot path. Add a `QuestAvatarComponentProto`
  (`score`, `currentCheckpoint`, `status` bitfield/flags for shield/cooldown/immunity/in-duel)
  and a new `EntityProto` field for it. Reuse `PositionComponentProto` / `DirectionComponentProto`.
- **Non-spatial state** (quiz content, duel, items, hints, leaderboard) rides a new
  `TreasureQuestMessage` oneof added as one branch to `GameMessage` (`tq = 12`), delivered via
  a generic per-player/broadcast surface (below). This keeps one codec path.
- **Interact** to open a checkpoint quiz: add `InteractCommand` inside `TreasureQuestMessage`
  (avoids repurposing tank `shoot`). Contract **locked** before consumers (Task 2).

### Contract-first: generic broadcast surface
- Add `void sendTo(long playerId, GameMessage)` + `void broadcast(GameMessage)` to
  `RoomBroadcastAccess`, implemented once in `RoomBroadcaster`. Enables per-player quiz/duel
  delivery without growing the interface per feature. (Tank/demo unaffected — additive.)

### State ownership (authoritative server; clients are dumb)
- Server owns: avatar positions/movement, checkpoint-zone entry, quiz correctness, duel
  outcome, steal math, cooldown/shield/immunity timers, inventory, Power, ranking.
- Client sends: join, movement input, interact, quiz answers, duel answers, item use,
  challenge accept/decline. Client renders only server broadcasts.
- Correct-answer keys never sent to clients before scoring.

### Map & content
- Extend the tile-map JSON with `checkpoints: [{id, x, y, w, h, quizId, isBoss, risk, next: [ids], hint}]`
  (a **graph** via `next`) and a `treasure: {x, y, w, h}` zone reachable only after the boss.
  Markers stay data-only and are drawn client-side from `MapSnapshot`.
- Seed content ships under `resources/data/` + `resources/maps/`; admin-authored content is
  written to a writable runtime dir (`-Dtreasurequest.data.dir`), runtime-first with classpath fallback.

### Match / phase mapping
- Reuse `MatchPhaseMachine`: `LOBBY` → (optional `COUNTDOWN`) → `PLAYING` → `ENDED`. The **first**
  player to enter the treasure zone after clearing the boss triggers `ENDED` **for all players**;
  the match result names that winner. A time cap is a fallback end (highest progress/Power wins).
- Quest state (per-player score/checkpoint-node/inventory/timers) lives in plugin domain objects
  + ECS components. Timers (quiz limit, duel 30 s, cooldowns, Treasure Lock) are absolute-tick
  deadlines expired in `onTick`.

## Task List

---

## Task 1: Scaffold `treasurequest` plugin (minimal, discoverable) — ✅ DONE

### Description
Create `games/treasurequest/plugin` as a minimal buildable, ServiceLoader-discoverable plugin:
lobby + match-phase timers (demo-shaped), empty ECS + `PassThrough` sync. Tank Arena's
movement/map/snapshot machinery is copied in **Task 5** (avatars), keeping T1 low-risk.

### Acceptance Criteria
- [x] Module builds; plugin registered via `ServiceLoader` (`GamePlugins.require("treasurequest")` resolves).
- [x] `TreasureQuestPlugin`(id/displayName/factory), `TreasureQuestFactory`, `TreasureQuestGame`,
      `TreasureQuestLobby`, `META-INF/services` present.
- [x] Lobby join → ready → start reaches `PLAYING` (unit test); wired into `server-runtime` + `triforge-server`.

### Verification
- [x] `mvn -pl games/treasurequest/plugin -am test` green (2 new tests); full `mvn test` green — no tank/demo regressions.
- [x] Fat JAR shades the new service entry (verified: merged with tankarena + demo).

### Dependencies
- None

### Files
- `games/treasurequest/plugin/pom.xml`, `.../{TreasureQuestPlugin,TreasureQuestFactory,TreasureQuestGame}.java`
- `.../resources/META-INF/services/com.triforge.engine.game.GamePlugin`
- `pom.xml`, `server/server-runtime/pom.xml`, `launcher/triforge-server/pom.xml`

### Scope
- M

---

## Task 2: Lock the wire contract (proto + TS regen) — ✅ DONE

### Description
Extend `EntityProto` with `QuestAvatarComponentProto`, add the `TreasureQuestMessage` oneof
branch, regenerate Java + TS, and freeze the contract.

### Acceptance Criteria
- [x] `QuestAvatarComponentProto`(playerId, name, score, currentCheckpoint, checkpointsCleared,
      shielded, pvpCooldown, stealImmune, inDuel) + `EntityProto.questAvatar = 7`.
- [x] `TreasureQuestMessage` oneof (15 msgs): `InteractCommand`, `HintReveal`, `QuizPrompt`,
      `QuizSubmit`, `QuizResult`, `EncounterOffer`, `ChallengeResponse`, `DuelPrompt`, `DuelSubmit`,
      `DuelResult`, `ItemUse`, `InventoryUpdate`, `Leaderboard`, `ExpeditionComplete`,
      `PlayerStateUpdate` + branch `tq = 12` on `GameMessage`.
- [x] Enums `ItemType`, `QuizOutcome`, `EncounterState` (prefixed values). `QuestPhase` omitted —
      reuse `MatchPhase` + avatar status flags (documented deviation).
- [x] `mvn -pl protocol test` green; `npm run proto` regenerates TS cleanly (types verified present).

### Verification
- [x] Generated Java compiles + TS regenerated; contract **LOCKED**.

### Dependencies
- None (parallel with Task 1)

### Files
- `proto/envelope.proto`, `frontend/shared-ui/src/net/*`

### Scope
- S

---

## Task 3: Generic per-player / broadcast surface — ✅ DONE

### Description
Add `sendTo(playerId, GameMessage)` + `broadcast(GameMessage)` to `RoomBroadcastAccess`;
implement in `RoomBroadcaster`.

### Acceptance Criteria
- [x] Both methods added + implemented; disconnected/unknown targets skipped (no-op).
- [x] Existing broadcasters unaffected (additive only); demo + treasurequest host stubs updated.

### Verification
- [x] `RoomBroadcasterMessagingTest` (3 cases): `sendTo` only target, `broadcast` all, unknown-id no-op.
- [x] Full `mvn test` green (server-runtime 54 tests); no regressions.

### Dependencies
- Task 2

### Files
- `engine/engine-api/.../room/RoomBroadcastAccess.java`, `server/server-runtime/.../room/RoomBroadcaster.java`, new test

## Checkpoint A (after Tasks 1–3) — ✅ DONE
- [x] Build + fat JAR discover `treasurequest` (service entry merged alongside tankarena + demo); tests green; no regressions.
- [x] Wire contract locked; generic messaging surface available.

### Scope
- S

---

## Task 4: World content — map + checkpoints + quiz/config loaders + seed — ✅ DONE

### Description
Model quest content and load it: an extended tile map (checkpoint zones + treasure), quiz sets,
and expedition config; runtime-dir-first with classpath-seed fallback.

### Acceptance Criteria
- [x] Domain: `Checkpoint`(id, `Rect` zone, quizId, `next[]`, boss, `CheckpointRisk`, hint, `Reward`),
      `CheckpointGraph` (validates start/edges/boss reachability), `TreasureZone`, `QuestMap`
      (tiles + graph + treasure, OOB=WALL), `QuizSet`/`Question`, `ExpeditionConfig` (+ `defaults()`).
- [x] `QuestMapLoader` parses tile rows + `checkpoints[]` (graph) + `treasure`; `QuestTileType` symbol map.
- [x] `QuizLoader`/`ConfigLoader` (Jackson) + `ContentSource` (runtime `-Dtreasurequest.data.dir` first,
      classpath fallback); `QuestContent` aggregates + cross-validates quiz refs. Config merges partial JSON over defaults.
- [x] Seed ships: `maps/quest-village.json` (20×15, branching cp1 → {cp2a safe, cp2b dangerous} → cp3
      → boss → treasure), `data/quizzes.json` (5 quizzes), `data/config.json`.

### Verification
- [x] `QuestContentTest` (8): loads seed + zones-on-walkable; rejects bad correctIndex, too-few options,
      dangling `next`, no-boss, off-map zone, unknown-quiz reference.
- [x] `mvn -pl games/treasurequest/plugin test` green (10 tests).

### Dependencies
- Task 1

### Files
- `.../content/{Checkpoint,TreasureZone,QuizSet,Question,ExpeditionConfig}.java`
- `.../content/{QuestMapLoader,QuizLoader,ConfigLoader}.java`
- `.../resources/maps/quest-*.json`, `.../resources/data/{quizzes,config}.json`

### Scope
- M

---

## Task 5: Avatar spawn + movement + snapshot (engine reuse)

### Description
Spawn a controllable avatar per player on match start; wire `InputCommand` through the existing
movement + collision systems; broadcast positions each tick via the snapshot pipeline.

### Acceptance Criteria
- [x] `AvatarEntityFactory` builds an entity with `Position`/`Direction`/`Input`/`CanControl` (+ `QuestAvatar`) components.
- [x] `queueInputCommand` → `RoomInputProcessor` → `MovementSystem`; `MapCollisionSystem` + `WorldBoundsCollisionSystem` gate movement.
- [x] `onTick` runs systems and calls `broadcastStateSync`; `QuestSnapshotWriter` maps avatar → `EntityProto`.
- [x] `viewerPosition`/`playerEntityId` return avatar position/id.

### Verification
- [x] Integration test: player joins, match starts, input moves avatar, blocked by walls/bounds; snapshot reflects movement.
- [x] Tests green.

### Dependencies
- Tasks 3, 4

### Files
- `.../entities/AvatarEntityFactory.java`, `.../components/QuestAvatarComponent.java`,
  `.../QuestSnapshotWriter.java`, `.../TreasureQuestGame.java`

## Checkpoint B (after Tasks 4–5)
- [x] Backend: players spawn and move around a 2D map with collision; positions broadcast.
- [x] Seed map + content load; build + tests green.

### Scope
- M

---

## Task 6: Checkpoint-zone detection → open quiz

### Description
Detect when an avatar enters its current target checkpoint's zone; make the quiz available and
open it on interact.

### Acceptance Criteria
- [x] Per-tick zone test: avatar AABB vs current checkpoint rect → "available" state, broadcast to that player.
- [x] `InteractCommand` inside an available current checkpoint opens the quiz (sends `QuizPrompt`); wrong/locked/out-of-order checkpoints rejected.
- [x] Entering a non-current checkpoint (already passed / not yet unlocked) does nothing.

### Verification
- [x] Unit tests: enter current zone → available; interact → prompt; enter wrong zone → no-op.
- [x] Tests green.

### Dependencies
- Task 5

### Files
- `.../checkpoint/{CheckpointZoneDetector,CheckpointState}.java`, `.../TreasureQuestGame.java`

### Scope
- S

---

## Task 7: Quiz attempt flow

### Description
Send `QuizPrompt` (no answer keys); receive `QuizSubmit`; score server-side; award points on
≥ threshold; enforce time limit; return `QuizResult` and reveal next hint on pass.

### Acceptance Criteria
- [x] `QuizPrompt` carries questions/options/time limit but never `correctIndex`.
- [x] `QuizSubmit` scored; score added to `QuestAvatarComponent`; per-question time limit via tick deadlines.
- [x] ≥ threshold → checkpoint passed + reward + next `HintReveal`; < threshold → retry policy (config); late answers rejected.
- [x] `QuizResult` reports correct count, points, pass/fail.

### Verification
- [x] Unit tests: pass advances/awards; fail doesn't; timeout auto-scores.
- [x] Tests green.

### Dependencies
- Task 6

### Files
- `.../quiz/{QuizSession,QuizScorer}.java`, `.../TreasureQuestGame.java`

### Scope
- M

---

## Task 8: Progression (branching) → boss → treasure → first-to-win

### Description
Unlock successor checkpoints via the graph; branches merge before the boss; the first player to
reach the treasure after clearing the boss wins and ends the match for all.

### Acceptance Criteria
- [x] Passing a checkpoint unlocks its `next` successors + reveals hint(s); the player picks a branch.
- [x] Boss is reachable only after its prerequisites; boss uses boss rules (higher threshold).
- [x] First avatar to enter the treasure zone after clearing the boss → `ExpeditionComplete` +
      match `ENDED` for everyone, with that player as winner; time cap is fallback end.
- [x] `PlayerStateUpdate` on every score/checkpoint/inventory change.

### Verification
- [x] Integration test: one player runs the full seed chain → boss → treasure → complete.
- [x] Tests green.

### Dependencies
- Task 7

### Files
- `.../state/ExpeditionState.java`, `.../TreasureQuestGame.java`

## Checkpoint C (after Tasks 6–8)
- [x] Backend core loop end-to-end: move → enter checkpoint → quiz → score → hint → … → boss → treasure.
- [x] Authoritative; no answer-key leakage; build + tests green.

### Scope
- M

---

## Task 9: Frontend — world, avatars, movement, join

### Description
Scaffold the Phaser client from Tank Arena's frontend: connect/join, render the tile map +
checkpoint/treasure markers from `MapSnapshot`, render avatars from snapshots, send movement input.

### Acceptance Criteria
- [x] `npm run build` bundles; served at `/games/treasurequest/`; launcher-web lists it.
- [x] Renders map + avatars; WASD/arrow keys send `InputCommand`; other players' avatars move via snapshots.
- [x] Checkpoint + treasure zones drawn from map data.

### Verification
- [x] `mvn package -pl launcher/triforge-server -am` builds frontend + JAR; two browsers move avatars on a shared map.

### Dependencies
- Tasks 5, 2

### Files
- `games/treasurequest/frontend/*` (Phaser scenes/render adapted from tankarena)

### Scope
- M

---

## Task 10: Frontend — checkpoint/quiz UI + HUD

### Description
Interact prompt at a checkpoint, quiz overlay with countdown, result display, next-hint reveal,
and a score/progress HUD driven by `PlayerStateUpdate`.

### Acceptance Criteria
- [x] Entering current checkpoint shows an interact prompt; interact opens the quiz overlay.
- [x] Quiz card renders `QuizPrompt` with countdown; submit → `QuizSubmit`; `QuizResult` + `HintReveal` shown.
- [x] HUD reflects score/current checkpoint live; no answer logic client-side.

### Verification
- [x] Manual: two browsers run the full loop to treasure against a live server.

### Dependencies
- Tasks 8, 9

### Files
- `games/treasurequest/frontend/src/ui/*`, `.../scenes/*`

## Checkpoint D (after Tasks 9–10)
- [x] Full core loop playable in the browser on a 2D map; package build green.

### Scope
- M

---

## Task 11: Proximity encounter detection (2D distance)

### Description
Detect when two eligible avatars are within `encounterRadius` and offer a challenge, respecting
shields/cooldowns/immunity and duel state.

### Acceptance Criteria
- [x] Per-tick (throttled) pairwise distance check < `encounterRadius` → `EncounterOffer` to both.
- [x] `ChallengeResponse` accept/decline; shielded/cooldown/immune/in-duel avatars excluded.
- [x] Both-accept → duel; decline/timeout/move-apart cancels cleanly.

### Verification
- [x] Unit tests: near pair offered; shielded excluded; decline/leaving radius cancels.
- [x] Tests green.

### Dependencies
- Task 8

### Files
- `.../pvp/{EncounterDetector,Encounter}.java`

### Scope
- M

---

## Task 12: Mini-quiz duel + partial steal

### Description
Both duelists answer 5 Q / 30 s; more-correct wins and steals `stealPct` (default 20%) of the
loser's score; ties per config.

### Acceptance Criteria
- [x] `DuelPrompt` → both `DuelSubmit`; scored under a tick-driven 30 s deadline.
- [x] Winner gains `round(stealPct·loserScore)`; loser loses the same; `DuelResult` to both; states re-broadcast.
- [x] Tie handled per config; unanswered = 0 correct.

### Verification
- [x] Unit tests: 500/400 → 580/320 at 20%; tie path; timeout auto-score.
- [x] Tests green.

### Dependencies
- Task 11

### Files
- `.../pvp/{Duel,DuelScorer}.java`

### Scope
- M

---

## Task 13: Anti-camp — cooldown / immunity / shield

### Description
Post-win PvP cooldown (5 min), per-victim steal immunity (30 min), post-quiz-win shield
(10 min), as absolute-tick deadlines expired in `onTick` and surfaced in `QuestAvatar` status flags.

### Acceptance Criteria
- [x] Winner can't initiate PvP for 5 min; robbed player immune 30 min; quiz-clear grants 10 min shield.
- [x] Timers gate Task 11 offers and appear in snapshot status flags. Values from `ExpeditionConfig`.
- [x] Expiries fire in `onTick`.

### Verification
- [x] Simulated-tick tests: each timer blocks then releases at the right tick.
- [x] Tests green.

### Dependencies
- Task 12

### Files
- `.../components/QuestAvatarComponent.java`, `.../TreasureQuestGame.java`

## Checkpoint E (after Tasks 11–13)
- [x] PvP backend end-to-end: proximity → duel → steal → anti-camp; steal math verified.

### Scope
- S

---

## Task 14: PvP frontend

### Description
Challenge prompt, duel overlay (5 Q / 30 s shared countdown), result screen, and
shield/cooldown/immunity indicators on avatars/HUD.

### Acceptance Criteria
- [x] `EncounterOffer` → accept/decline; `DuelPrompt` → answerable card w/ countdown; `DuelResult` shown.
- [x] Protection badges rendered from avatar status flags.

### Verification
- [x] Manual: two browsers approach, duel, observe steal + protections.

### Dependencies
- Tasks 13, 10

### Files
- `games/treasurequest/frontend/src/ui/pvp/*`

### Scope
- M

---

## Task 15: Admin HTTP API

### Description
Netty handler `/api/admin/treasurequest/*` to list/get/upload/validate quiz sets, checkpoints
(map overlay), and config; persist to the writable runtime dir.

### Acceptance Criteria
- [x] GET `quizzes`/`checkpoints`/`config`; PUT with validate-then-persist; invalid → 400; reload on save.
- [x] Inserted in the Netty pipeline without shadowing `/api/lobby/*` or static files.

### Verification
- [x] Integration test: upload→refetch round-trip; invalid→400. `server-runtime` tests green.

### Dependencies
- Task 4

### Files
- `server/server-runtime/.../transport/netty/AdminHttpHandler.java`, `.../netty/WebSocketServer.java`, new test

### Scope
- M

---

## Task 16: Admin UI

### Description
Admin console page to author quiz sets, place checkpoints on the map, and edit config, uploading
via the Task 15 API.

### Acceptance Criteria
- [x] Forms/map-editor to define quizzes, checkpoint zones (x/y/w/h/order/boss/hint), treasure, and config.
- [x] Client validation before `PUT`; server errors surfaced; existing content editable.

### Verification
- [x] Manual: author an expedition, save, start a room, play it through.

### Dependencies
- Task 15 (parallelizable with Tasks 10/14)

### Files
- `games/treasurequest/frontend/src/admin/*`

## Checkpoint F (after Tasks 15–16)
- [x] Admin authors + persists content; survives restart; playable from authored data.

### Scope
- M

---

## Task 17: Inventory & items

### Description
Items — Shield, Fake Map, Speed, Treasure Lock — domain, effects, and awarding via
checkpoint/duel rewards; `ItemUse` applies effects, `InventoryUpdate` broadcasts.

### Acceptance Criteria
- [x] `ItemType` effects: Shield (grant shield), Fake Map (decoy hint to target), Speed (avatar speed / quiz-time boost), Treasure Lock (delay a rival's boss/treasure access).
- [x] Items granted via rewards/duel; `ItemUse` validated + applied; inventory in `QuestAvatar`/`PlayerState`.

### Verification
- [x] Unit tests: each effect applies + expires.
- [x] Tests green.

### Dependencies
- Task 13

### Files
- `.../items/{Item,ItemType,ItemEffects,Inventory}.java`

### Scope
- M

---

## Task 18: Power formula (live standings + duel modifier) — ✅ DONE

### Description
`Power = KnowledgeScore + EquipmentBonus + Combo`, knowledge weighted ~50–60%. Feeds the live
leaderboard and acts as a duel modifier — it does NOT decide the match winner (treasure race does).

### Acceptance Criteria
- [x] `PowerCalculator` combines weighted score + equipment bonus + combo streak per config; knowledge clamped 50–60%.
- [x] Used for live leaderboard order + as a duel modifier; never overrides the first-to-treasure win.

### Verification
- [x] Unit tests: weight bounds hold; combo/equipment shift Power.
- [x] Tests green.

### Dependencies
- Task 17

### Files
- `.../scoring/PowerCalculator.java`

### Scope
- S

---

## Task 19: Ranking / leaderboard + result — ✅ DONE

### Description
Live leaderboard by Power (checkpoint-progress tiebreak) during the race; on `ENDED`, the result
names the first-to-treasure winner plus final standings.

### Acceptance Criteria
- [x] `Leaderboard` ranks by Power + checkpoint progress, updated on change.
- [x] Match result declares the treasure winner (or highest progress/Power if time-capped) + final standings.

### Verification
- [x] Unit test: ranking order under mixed score/equipment/combo.
- [x] Tests green.

### Dependencies
- Task 18

### Files
- `.../scoring/Leaderboard.java`, `.../TreasureQuestGame.java`

### Scope
- S

---

## Task 20: Items + leaderboard frontend — ✅ DONE

### Description
Inventory bar with item-use actions and a live leaderboard/results panel.

### Acceptance Criteria
- [x] Inventory renders from `InventoryUpdate`; use sends `ItemUse` (with target where needed).
- [x] Leaderboard panel renders `Leaderboard`; final results on completion.

### Verification
- [x] Manual: full session — author → race/move → PvP → items → finish → ranks.

### Dependencies
- Tasks 14, 19

### Files
- `games/treasurequest/frontend/src/ui/{inventory,leaderboard}/*`

## Checkpoint G (after Tasks 17–20) — ✅ DONE
- [x] Full spec end-to-end: movement + loop + PvP + items + Power + ranking + boss + treasure.
- [x] `mvn clean test` and `mvn clean package -pl launcher/triforge-server -am` green.
- [x] Plan moved to `planning/archive/`.

### Scope
- M

---

## Detailed Task Breakdown (sub-tasks)

> Ordered XS/S units per parent task; execute top-to-bottom. `[ ]` = not started.

### T1 · Scaffold plugin (minimal, discoverable) — ✅ DONE
- [x] 1.1 Add module to parent `pom.xml` `<modules>` + `<dependencyManagement>` (`treasurequest-game`). **XS**
- [x] 1.2 Create `plugin/pom.xml` (engine-core + netty + slf4j + junit). **XS**
- [x] 1.3 `TreasureQuestPlugin` (id `treasurequest`) + `TreasureQuestFactory`. **XS**
- [x] 1.4 `TreasureQuestGame` (lobby + phase timers, empty ECS) + `TreasureQuestLobby`. **S**
- [x] 1.5 `META-INF/services` registration. **XS**
- [x] 1.6 Add dependency to `server-runtime` + `triforge-server` poms. **XS**
- [x] 1.7 Smoke test (`TreasureQuestPluginTest` + host stub): ServiceLoader resolves; join→ready→start → `PLAYING`. **S**
- [x] 1.8 Full reactor `mvn test` green (2 new tests; no regressions). **S**
> Note: Tank Arena movement/map/snapshot copy deferred to Task 5 (avatars) to avoid a large risky combat-strip up front.

### T2 · Lock wire contract — ✅ DONE
- [x] 2.1 Enums `ItemType`, `EncounterState`, `QuizOutcome` (`QuestPhase` omitted — reuse `MatchPhase`). **XS**
- [x] 2.2 `QuestAvatarComponentProto` + `EntityProto.questAvatar` field. **XS**
- [x] 2.3 Movement/loop messages: `InteractCommand`, `HintReveal`, `QuizPrompt`, `QuizSubmit`, `QuizResult`, `PlayerStateUpdate`. **S**
- [x] 2.4 PvP messages: `EncounterOffer`, `ChallengeResponse`, `DuelPrompt`, `DuelSubmit`, `DuelResult`. **S**
- [x] 2.5 Items/meta: `ItemUse`, `InventoryUpdate`, `Leaderboard`, `ExpeditionComplete`. **S**
- [x] 2.6 Wrap in `TreasureQuestMessage` oneof; add `tq = 12` to `GameMessage`. **XS**
- [x] 2.7 `mvn -pl protocol test`; `npm run proto` (proto.js + proto.d.ts regenerated). **XS**
- [x] 2.8 Contract **LOCKED** (gate for T4+). **XS**

### T3 · Generic broadcast surface — ✅ DONE
- [x] 3.1 Add `sendTo` + `broadcast` to `RoomBroadcastAccess`. **XS**
- [x] 3.2 Implement in `RoomBroadcaster` (skip disconnected/unknown). **S**
- [x] 3.3 Unit test targeted vs fan-out (`RoomBroadcasterMessagingTest`). **S**

### T4 · World content + loaders + seed — ✅ DONE
- [x] 4.1 `Question` + `QuizSet` + `QuizCatalog` + validation. **S**
- [x] 4.2 `Rect`, `QuestTileType`, `CheckpointRisk`, `Reward`, `Checkpoint`, `CheckpointGraph`, `TreasureZone`, `QuestMap`. **S**
- [x] 4.3 `ExpeditionConfig` (encounterRadius, stealPct, cooldowns, thresholds, power weight, treasureLockSecs) + `defaults()`. **S**
- [x] 4.4 `QuestMapLoader` parses tile rows + `checkpoints[]` graph + `treasure`. **S**
- [x] 4.5 `QuizLoader`/`ConfigLoader` + `ContentSource` (runtime-first, classpath fallback) + `QuestContent` cross-validate. **S**
- [x] 4.6 Seed: `quest-village.json` (branching cp1→{cp2a,cp2b}→cp3→boss→treasure), `quizzes.json`, `config.json`. **S**
- [x] 4.7 `QuestContentTest` (8): valid + 6 malformed shapes. **S**

### T5 · Avatar spawn + movement + snapshot
- [x] 5.1 `QuestAvatarComponent` (score, currentCheckpoint, status flags). **XS**
- [x] 5.2 `AvatarEntityFactory` (Position/Direction/Input/CanControl/QuestAvatar). **S**
- [x] 5.3 Spawn avatars on match start; `viewerPosition`/`playerEntityId`. **S**
- [x] 5.4 Wire `queueInputCommand` → `RoomInputProcessor`; add movement + collision systems to scheduler. **S**
- [x] 5.5 `QuestSnapshotWriter` (avatar → `EntityProto`). **S**
- [x] 5.6 `onTick`: process input, run systems, `broadcastStateSync`. **S**
- [x] 5.7 Integration test: input moves avatar; walls/bounds block; snapshot reflects it. **S**

### T6 · Checkpoint-zone detection → open quiz
- [x] 6.1 `CheckpointZoneDetector` (avatar AABB vs current checkpoint rect). **S**
- [x] 6.2 `CheckpointState` per player (available/opened/passed). **XS**
- [x] 6.3 Broadcast availability to the player on zone entry. **XS**
- [x] 6.4 `InteractCommand` handler → open quiz for current available checkpoint. **S**
- [x] 6.5 Reject wrong/locked/out-of-order checkpoints. **XS**
- [x] 6.6 Tests: enter→available, interact→prompt, wrong zone→no-op. **S**

### T7 · Quiz attempt flow
- [x] 7.1 `QuizSession` (attempt state + deadline tick). **S**
- [x] 7.2 Build `QuizPrompt` (strip `correctIndex`) + `sendTo`. **S**
- [x] 7.3 `QuizSubmit` intake + `QuizScorer`. **S**
- [x] 7.4 Threshold gate → apply reward → next `HintReveal`. **S**
- [x] 7.5 Time-limit expiry in `onTick`. **S**
- [x] 7.6 `QuizResult` message. **XS**
- [x] 7.7 Tests: pass/fail/timeout. **S**

### T8 · Progression (branching) → boss → treasure → win
- [x] 8.1 Unlock `next` successors on pass; reveal hint(s); player picks branch. **S**
- [x] 8.2 Boss gate (prerequisites) + boss threshold rules. **XS**
- [x] 8.3 First treasure entry after boss → `ExpeditionComplete` + winner + `ENDED` for all. **S**
- [x] 8.4 `PlayerStateUpdate` on every change. **XS**
- [x] 8.5 Time-cap fallback end (highest progress/Power). **S**
- [x] 8.6 Integration test: branch → boss → treasure → match ends with winner. **S**

### T9 · Frontend world + avatars + movement
- [x] 9.1 Scaffold Phaser project from tankarena frontend; `file:` shared-ui. **S**
- [x] 9.2 Connect + join; render lobby → game scene. **S**
- [x] 9.3 Render tile map + checkpoint/treasure markers from `MapSnapshot`. **S**
- [x] 9.4 Render avatars from snapshots (interpolate positions). **S**
- [x] 9.5 WASD/arrow input → `InputCommand`. **S**
- [x] 9.6 Package build copies bundle; launcher-web lists game. **XS**

### T10 · Frontend checkpoint/quiz UI + HUD
- [x] 10.1 Interact prompt when in current checkpoint zone. **S**
- [x] 10.2 Quiz overlay + countdown renders `QuizPrompt`. **S**
- [x] 10.3 Submit → `QuizSubmit`; render `QuizResult` + `HintReveal`. **S**
- [x] 10.4 Score/progress HUD from `PlayerStateUpdate`. **S**
- [x] 10.5 Manual 2-browser loop-to-treasure. **XS**

### T11 · Proximity encounter detection
- [x] 11.1 `EncounterDetector` (throttled pairwise distance < `encounterRadius`). **S**
- [x] 11.2 Eligibility filter (shield/cooldown/immunity/in-duel). **S**
- [x] 11.3 `EncounterOffer` + `ChallengeResponse` intake. **S**
- [x] 11.4 Both-accept→duel; decline/timeout/leave-radius→cancel. **S**
- [x] 11.5 Tests: near offered, shielded excluded, leaving radius cancels. **S**

### T12 · Mini-quiz duel + steal
- [x] 12.1 `Duel` state (2 players, 5 Q, 30 s deadline). **S**
- [x] 12.2 `DuelPrompt` + `sendTo` both. **XS**
- [x] 12.3 `DuelSubmit` intake + `DuelScorer`. **S**
- [x] 12.4 Winner + steal math (`round(stealPct·loserScore)`). **S**
- [x] 12.5 Tie/timeout (unanswered=0). **S**
- [x] 12.6 `DuelResult` + re-broadcast states. **XS**
- [x] 12.7 Tests: 500/400→580/320; tie; timeout. **S**

### T13 · Anti-camp timers
- [x] 13.1 Timer fields on `QuestAvatarComponent` (deadline ticks). **XS**
- [x] 13.2 Grant cooldown (win) / immunity (robbed) / shield (quiz-clear). **S**
- [x] 13.3 Expire in `onTick`. **S**
- [x] 13.4 Gate T11 offers; surface flags in snapshot status. **XS**
- [x] 13.5 Simulated-tick tests. **S**

### T14 · PvP frontend
- [x] 14.1 `EncounterOffer` accept/decline UI. **S**
- [x] 14.2 Duel overlay + shared 30 s countdown. **S**
- [x] 14.3 `DuelResult` screen. **XS**
- [x] 14.4 Protection badges on avatars/HUD. **XS**
- [x] 14.5 Manual 2-browser duel. **XS**

### T15 · Admin HTTP API
- [x] 15.1 `AdminHttpHandler` + routing `/api/admin/treasurequest/*`. **S**
- [x] 15.2 GET quizzes/checkpoints/config. **S**
- [x] 15.3 PUT validate + persist to runtime dir; reload. **S**
- [x] 15.4 Errors 400/404/500. **XS**
- [x] 15.5 Pipeline wiring (before static; not shadowing `/api/lobby/*`). **XS**
- [x] 15.6 Integration test round-trip + invalid=400. **S**

### T16 · Admin UI
- [x] 16.1 Quiz-set editor form. **S**
- [x] 16.2 Checkpoint/treasure map-placement editor. **S**
- [x] 16.3 Config editor. **S**
- [x] 16.4 Client validation + `PUT` + error surface; edit existing. **S**

### T17 · Inventory & items
- [x] 17.1 `Item`/`ItemType`/`Inventory` domain. **S**
- [x] 17.2 Effect: Shield. **S**
- [x] 17.3 Effect: Fake Map (decoy hint to target). **S**
- [x] 17.4 Effect: Speed. **S**
- [x] 17.5 Effect: Treasure Lock. **S**
- [x] 17.6 Award via reward/duel; `ItemUse` validate+apply; `InventoryUpdate`. **S**
- [x] 17.7 Effect tests. **S**

### T18 · Power formula — ✅ DONE
- [x] 18.1 `PowerCalculator` (weights; knowledge clamped 50–60%). **S**
- [x] 18.2 Combo-streak tracking. **S**
- [x] 18.3 Equipment bonus from inventory. **XS**
- [x] 18.4 Tests: weight bounds; combo/equipment shift. **S**

### T19 · Ranking / leaderboard — ✅ DONE
- [x] 19.1 `Leaderboard` build (Power desc, score tiebreak). **S**
- [x] 19.2 Broadcast on change + final on `ENDED`. **XS**
- [x] 19.3 Ranking test. **S**

### T20 · Items + leaderboard frontend — ✅ DONE
- [x] 20.1 Inventory bar + `ItemUse` action. **S**
- [x] 20.2 Leaderboard/results panel. **S**
- [x] 20.3 Full manual session. **XS**

## Checkpoints (summary)
- **A** (T1–3): scaffold discovered, contract locked, generic messaging live.
- **B** (T4–5): players spawn + move on a 2D map with collision; positions broadcast.
- **C** (T6–8): backend core quiz loop end-to-end (move→checkpoint→quiz→hint→boss→treasure).
- **D** (T9–10): full core loop playable in the Phaser browser client.
- **E** (T11–13): PvP backend end-to-end (proximity→duel→steal→anti-camp).
- **F** (T15–16): admin authoring + persistence.
- **G** (T17–20): full spec end-to-end + archive.

## Parallelization
- Safe: T1 ∥ T2. Admin (T15–16) ∥ frontend (T9/T10/T14) once contracts locked. Duel/items
  unit tests ∥ their implementation. Any frontend task only after its proto/broadcast contract.
- Not safe: any backend messaging before T2/T3; frontend before its contract; concurrent edits
  to `TreasureQuestGame` / `QuestAvatarComponent` / `ExpeditionState` (shared state);
  movement systems (T5) before ECS scaffold (T1).

## Risks
- **Combat-strip regressions.** Copying Tank Arena then deleting bullets/HQ/fog/teams can leave
  dangling refs. Mitigate: compile-gate after each deletion in T1; keep only the movement/map/snapshot slice.
- **Shared proto growth.** Adding `QuestAvatarComponentProto` + `TreasureQuestMessage` touches
  the wire schema all games share. Additive-only, locked in T2, regen Java + TS.
- **Cheating surface.** Answer keys never leave the server; quiz/duel timers are server-tick
  authoritative, not client-reported. Verified in T7/T12.
- **Proximity cost & flicker.** Pairwise distance each tick is O(n²); throttle + only among
  active avatars; add hysteresis so offers don't flicker at the radius boundary.
- **Duel concurrency.** Two players under one 30 s deadline with disconnect/timeout — deterministic
  auto-scoring + idempotent resolution required.
- **Scope.** 20 tasks; Checkpoints C/D are natural ship points. PvP/admin/items are additive phases.

## Resolved Decisions
1. **Movement:** free 2D velocity (reuse `MovementSystem`). ✔
2. **Route:** branching risk/reward checkpoint graph (`next` edges; safe vs dangerous branches). ✔
3. **Win:** first-to-treasure → immediate `ENDED` for all; Power/leaderboard are live-standing only. ✔
4. **Items:** Fake Map = decoy hint to a target; Treasure Lock = block a target from opening the
   boss/treasure for X s. ✔

## Open Questions (defaulted — override anytime)
- **Admin auth:** default **open on LAN** (matches the current platform; no auth today). Optional
  shared-secret header via `-Dtreasurequest.admin.token` if wanted.
- **Default numbers** (in `ExpeditionConfig`, all tunable): quiz pass threshold 80% (e.g. 16/20),
  steal 20%, PvP cooldown 5 min, steal immunity 30 min, quiz-win shield 10 min, duel 5 Q / 30 s,
  Treasure Lock 30 s, `encounterRadius` ≈ 2 tiles. Confirm or tweak.
