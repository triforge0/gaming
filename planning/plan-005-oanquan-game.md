# Implementation Plan — plan-005: Ô ăn quan Game Plugin

> **Status (2026-07-03): implemented — all 10 tasks done.** Backend: 51 new tests green
> (20 rules engine, 11 game-level, integration test drives a full game through the real
> room path); `mvn clean test` and both package variants green. Wire-level E2E verified
> against the packaged JAR with two WebSocket clients (join → reject 3rd → out-of-turn
> rejection → full random game → conservation of 50 dân + 2 quan). Frontend builds clean
> and is served at `/games/oanquan/` with the launcher card.
>
> Implementation decisions beyond the original plan:
> - The launcher seeds one `oanquan` room (`TriforgeServer`), following the `quest`
>   precedent; the client joins the fixed room id `oanquan`. Multi-table room creation
>   is future work (needs a create-room API — rooms auto-created over WS get the
>   *default* plugin).
> - Endgame quan-pit leftovers: split evenly, odd stone to the mover's opponent.
> - `OAQStep` carries `quanPieces` and `toSeat` so CAPTURE/SWEEP/BORROW traces are
>   fully replayable client-side.
> - TQ seam migration (Task 3 stretch) not taken — `queueTreasureQuestMessage` left as-is.
> - Deflaked pre-existing `MovementSliceTest` (exact-position assert raced the 60 TPS
>   loop because held input moves the tank every tick; now asserts ≥ one tick of travel).
>
> Remaining before archiving: one manual two-browser 3D smoke test on LAN.

## Overview

Add **Ô ăn quan** (Vietnamese mancala) as a new game plugin: a 2-player, turn-based,
perfect-information board game. Server is fully authoritative — clients send only
`(pitIndex, direction)`; the server resolves the entire sow/capture chain and broadcasts
the resulting board plus a **move trace** that clients replay as animation.

Deliverables:

- `games/oanquan/plugin/` — Maven artifact `oanquan-game` (rules engine + `Game` impl)
- `games/oanquan/frontend/` — React + Three.js **3D** client (Vite, dev port 3003, same stack
  as Tank Arena), served at `/games/oanquan/`
- `OAnQuanMessage` in `proto/envelope.proto` (follows the `TreasureQuestMessage` precedent)
- A **generic inbound game-message seam** in `engine-api` so `GameRoom` stops needing
  per-game `instanceof` routing (fixes the `TreasureQuestGame` coupling for future games)

## Architecture Decisions

### Rules (locked for v1, all in `RuleConfig`)

| Rule | v1 decision |
|---|---|
| Board | 10 dân pits (5/side, 5 stones each) + 2 quan pits (1 quan each) |
| Direction | Player chooses direction **per move** — input is `(pitIndex, direction)` |
| Quan pits | Receive sown stones normally; can never be picked up from; landing so the next pit is a quan pit ends the turn |
| Capture | Last stone → next pit empty → pit after it has stones → capture it; chain repeats (empty→occupied alternation); two consecutive empties = turn ends, no capture |
| Quan non | **Off by default** (configurable threshold in `RuleConfig`) |
| Vay quân (borrow) | At turn start with all 5 own pits empty: place 1 stone in each own pit from captured stock; stock may go negative (debt) — traditional rule |
| Game end | Both quan pits have 0 quan pieces → "hết quan tàn dân": remaining stones on each side go to that side |
| Scoring | dân = 1, quan = **10** (configurable) |
| Turn timer | 30 s per turn; on expiry the server plays a uniformly-random valid move |
| Players | Exactly 2 to start; joins beyond 2 rejected (spectators = future work) |

### State ownership & flow

- Rules engine is **pure Java** (`com.triforge.games.oanquan.core`): `Board`, `Move`,
  `RuleConfig`, `MoveResolver` → returns `MoveTrace` (ordered steps: PICKUP / SOW /
  CAPTURE / BORROW) + next `Board`. Zero engine/protocol/Netty imports → exhaustively
  unit-testable. This is where all rule edge cases live.
- `OAnQuanGame implements Game` (like `DemoGame`): ticks are idle while waiting for
  input; `MatchPhaseMachine` drives LOBBY → COUNTDOWN → PLAYING → ENDED; match ends
  early via `matchPhase.endMatch()` when the board reaches game over (match duration is
  set very long as a safety net).
- ECS is not used for board state (board is one state object); `EmptyEntitySnapshotWriter`
  + `PassThroughInterestFilter`, same as demo.

### Wire contract (contract-first, locked in Task 2)

New oneof arm `OAnQuanMessage oaq = 16;` in `GameMessage`, containing:

```proto
message OAnQuanMessage {
  oneof content {
    OAQMoveCommand move = 1;        // client → server
    OAQBoardState board = 2;        // server → all (authoritative state)
    OAQMoveResult moveResult = 3;   // server → all (trace, for animation)
    OAQMoveRejected moveRejected = 4; // server → sender (invalid move + reason)
  }
}
enum OAQDirection { OAQ_DIR_UNSPECIFIED = 0; CLOCKWISE = 1; COUNTER_CLOCKWISE = 2; }
message OAQMoveCommand { uint32 pitIndex = 1; OAQDirection direction = 2; }
message OAQBoardState {
  repeated uint32 pitStones = 1;    // 12 entries, circular: 0-4 side A dân, 5 quan, 6-10 side B dân, 11 quan
  repeated uint32 quanPieces = 2;   // 2 entries: quan pieces remaining in pits 5 and 11
  uint64 currentPlayerId = 3;
  repeated OAQScore scores = 4;     // playerId, capturedDan, capturedQuan, points (may be negative w/ debt)
  uint32 turnTicksRemaining = 5;
  bool gameOver = 6;
  uint64 winnerPlayerId = 7;        // 0 = draw / not over
}
message OAQMoveResult { uint64 playerId = 1; repeated OAQStep steps = 2; }
message OAQStep { OAQStepType type = 1; uint32 pitIndex = 2; uint32 stones = 3; }
```

Board indices are **circular** (sowing order); pit-side ownership derives from index.
Server broadcasts `moveResult` then `board` after every applied move; clients animate the
trace and reconcile against `board`.

**The wire stays 3D-agnostic.** No positions, meshes, or animation timing cross the wire —
the client derives every 3D placement from pit index and every animation from the
`MoveTrace` steps. A 2D client could consume the identical protocol.

### 3D client design (React + Three.js, mirrors the Tank Arena stack)

Scene (procedural geometry for v1 — **no GLB assets**, per the graphics-last policy):

- **Board**: one low `BoxGeometry` slab (wooden-mat look, flat color material v1); pits are
  shallow cylinder depressions arranged in the classic layout — 2 rows × 5 dân pits,
  2 half-disc quan pits at the ends. A pure function `pitWorldPosition(index): Vector3`
  maps circular pit index 0–11 → world position; **all** rendering and animation go
  through it (single source of truth for layout).
- **Stones**: `InstancedMesh` of small spheres (dân) — one instanced draw call covers all
  ~70 stones; quan pieces are larger distinct spheres. Stones inside a pit sit at
  deterministic pseudo-random offsets seeded by `(pitIndex, slot)` so both clients render
  identical piles and re-renders don't shuffle stones.
- **Camera**: fixed perspective ~45° tilt looking down the board's long axis, positioned on
  **the local player's side** (each player sees their own 5 pits nearest). No orbit controls
  in v1 — board fits one composed frame. Spectator/rematch reuses the same seat logic.
- **Lighting**: one ambient + one directional light with a small shadow map (static scene =
  cheap shadows). Sufficient until the polish backlog.
- **Input**: `Raycaster` on pit meshes. Hover highlights legal own pits (emissive tint);
  click selects the pit and shows two floating 3D arrows (chosen direction) above the
  board; clicking an arrow sends `OAQMoveCommand`. Illegal pits don't highlight — client
  reuses the same legality rules for UX only (server remains the authority).
- **Animation**: a client-side timeline consumes `MoveTrace` sequentially — PICKUP lifts the
  pit's stones into a floating "hand" cluster; each SOW arcs one stone (quadratic bezier
  hop, ~120 ms) into the next pit; CAPTURE arcs the captured pile to the scorer's tray at
  the board edge; BORROW arcs 5 stones from the tray back onto the row. On completion,
  reconcile instance counts against the authoritative `board` (snap-correct if they
  diverge). Incoming `board` during an unfinished timeline fast-forwards it.
- **HUD (React DOM overlay, not in-canvas)**: names, scores, captured trays summary, turn
  timer, `moveRejected` toast, endgame screen — same layered approach as Tank Arena.

**3D polish backlog (post-v1, separate plan)** — matches the established graphics-last
roadmap: wood/stone PBR textures, GLB board model, particle sparkle on quan capture,
sound, camera ease-in on turn change, stone physics jiggle.

### Inbound routing seam (replaces per-game `instanceof`)

Add to `Game` (engine-api): `default void handleGameMessage(long playerId, GameMessage message) {}`.
`CommandDispatcher` routes `case OAQ` (and any future game-specific arms) through
`room.queueGameMessage(playerId, gameMsg)` → `game.handleGameMessage(...)`.
Migrating the existing TQ path onto this seam is **optional scope** (Task 3 stretch) —
do it only if it stays a mechanical change; otherwise leave TQ as-is.

### Registration touchpoints (follow treasurequest precedent exactly)

- parent `pom.xml`: module `games/oanquan/plugin` + dependencyManagement entry
- `server/server-runtime/pom.xml` + `launcher/triforge-server/pom.xml`: dep on `oanquan-game`
- `launcher/triforge-server/pom.xml`: `oanquan-npm-ci` / `oanquan-npm-build` frontend-maven-plugin execs + static copy to `/games/oanquan/`
- `META-INF/services/com.triforge.engine.game.GamePlugin` → `OAnQuanPlugin` (id: `oanquan`)
- `frontend/launcher-web/src/main.ts`: game card `path: '/games/oanquan/'`

## Task List

## Task 1: Rules engine core (pure Java)

### Description
Implement `com.triforge.games.oanquan.core`: `Board`, `Move`, `RuleConfig`,
`MoveResolver` (returns `MoveTrace` + next board), legal-move generation, borrow rule,
game-over detection, and scoring. No engine/protocol dependencies.

### Acceptance Criteria
- [ ] Sow chain: pickup → sow → re-pickup on occupied next pit; stops correctly at quan-pit boundary (no pickup from quan)
- [ ] Capture: single capture, chained capture (empty→occupied alternation), quan-pit capture, no capture on two consecutive empties
- [ ] Borrow: 5 empty own pits at turn start → 1 stone each from stock, stock may go negative
- [ ] Game over: both quan captured → side stones swept to owners; winner/draw computed with quan=10
- [ ] Legal-move generator returns exactly the valid `(pit, direction)` pairs for a position
- [ ] Unit tests cover every rule row in Architecture Decisions, incl. full scripted mini-game

### Verification
- [ ] `mvn test -pl games/oanquan/plugin` green
- [ ] Property check in tests: total stones + captured (incl. debt) is conserved after every move

### Dependencies
- Task 4 (module must exist to host the code) — or create module skeleton within this task if executed first

### Files
- `games/oanquan/plugin/src/main/java/com/triforge/games/oanquan/core/*.java`
- `games/oanquan/plugin/src/test/java/com/triforge/games/oanquan/core/*Test.java`

### Scope
- M

## Task 2: Wire contract — OAnQuanMessage proto

### Description
Add `OAnQuanMessage` (+ sub-messages, enum) to `proto/envelope.proto` and `oaq = 16` to
the `GameMessage` oneof; regenerate Java + TS.

### Acceptance Criteria
- [ ] Messages exactly as specified in Architecture Decisions
- [ ] `mvn compile -pl protocol` generates Java classes
- [ ] `npm run proto` in `frontend/shared-ui` regenerates TS without breaking existing exports

### Verification
- [ ] `mvn clean test` (all modules) green — no existing message renumbered
- [ ] `cd frontend/shared-ui && npm run build` green

### Dependencies
- None

### Files
- `proto/envelope.proto`
- `frontend/shared-ui/src/net/proto.d.ts` (generated)

### Scope
- S

## Task 3: Generic inbound game-message seam

### Description
Add `Game.handleGameMessage(long, GameMessage)` default no-op in engine-api; route
`case OAQ` in `CommandDispatcher` via a new `GameRoom.queueGameMessage` that delegates
without `instanceof`.

### Acceptance Criteria
- [ ] `case OAQ` reaches the bound plugin's `handleGameMessage` on the room thread (via `enqueueCommand`)
- [ ] No `games.*` import added to `GameRoom` for the new path
- [ ] (Stretch, only if mechanical) TQ case migrated to the same seam and `TreasureQuestGame` import removed from `GameRoom`

### Verification
- [ ] `mvn test -pl server/server-runtime` green (incl. existing TQ tests if stretch taken)

### Dependencies
- Task 2

### Files
- `engine/engine-api/src/main/java/com/triforge/engine/game/Game.java`
- `server/server-runtime/src/main/java/com/triforge/server/transport/netty/CommandDispatcher.java`
- `server/server-runtime/src/main/java/com/triforge/server/application/room/GameRoom.java`

### Scope
- S

## Checkpoint A (after Tasks 1–3)

- [ ] Build succeeds (`mvn clean test`)
- [ ] Rules engine tests pass; proto contract locked (no further field changes without bumping here)
- [ ] No broken contracts: tankarena + treasurequest + demo tests still green

## Task 4: Plugin module skeleton + registration

### Description
Create `games/oanquan/plugin/` from the demo template: pom, `OAnQuanPlugin` (id `oanquan`),
`OAnQuanFactory`, `OAnQuanLobby` (exactly-2-players rule), ServiceLoader registration, and
all Maven touchpoints (parent pom, server-runtime, triforge-server).

### Acceptance Criteria
- [ ] `GET /api/lobby/plugins` lists `oanquan`
- [ ] Room created with `registry.ensureRoom(..., "oanquan")` binds an `OAnQuanGame`
- [ ] Lobby: 3rd join rejected; match can start only with 2 players, both ready
- [ ] Fat JAR shading still merges `META-INF/services` (all 4 plugins discovered)

### Verification
- [ ] `mvn clean package -pl launcher/triforge-server -am -Dskip.frontend=true` green
- [ ] Run JAR, verify plugin listed via HTTP endpoint

### Dependencies
- None (can run parallel to Tasks 1–3)

### Files
- `games/oanquan/plugin/pom.xml`, `OAnQuanPlugin.java`, `OAnQuanFactory.java`, `OAnQuanLobby.java`
- `games/oanquan/plugin/src/main/resources/META-INF/services/com.triforge.engine.game.GamePlugin`
- `pom.xml`, `server/server-runtime/pom.xml`, `launcher/triforge-server/pom.xml`

### Scope
- S

## Task 5: OAnQuanGame — server gameplay slice

### Description
Implement `OAnQuanGame implements Game`: bind rules engine to the match flow. On
`handleGameMessage(move)`: validate (correct player's turn, PLAYING phase, legal move),
resolve via `MoveResolver`, broadcast `moveResult` + `board`, switch turn, end match on
game over via `matchPhase.endMatch()` with `MatchResult` scores.

### Acceptance Criteria
- [ ] Move from the non-current player or an illegal pit → `moveRejected` to sender only, board unchanged
- [ ] Legal move → `moveResult` then `board` broadcast to both players
- [ ] Borrow applied automatically at turn start when required, visible in trace
- [ ] Board game-over → match ENDED, `MatchResult` carries final points, scoreboard → back to lobby (rematch works)
- [ ] Disconnect during PLAYING: remaining player wins by forfeit

### Verification
- [ ] `mvn test -pl games/oanquan/plugin` green (game-level tests with a fake `RoomHost`, mirroring `DemoRoomHost`)
- [ ] Scripted 2-client game reaches ENDED with correct scores

### Dependencies
- Tasks 1, 2, 3, 4

### Files
- `games/oanquan/plugin/src/main/java/com/triforge/games/oanquan/OAnQuanGame.java`
- `games/oanquan/plugin/src/test/java/com/triforge/games/oanquan/OAnQuanGameTest.java` (+ fake host)

### Scope
- M

## Task 6: Turn timer + auto-move

### Description
Per-turn countdown driven by `onTick` during PLAYING (30 s = 1800 ticks). On expiry the
server plays a random legal move for the current player and broadcasts normally.
`turnTicksRemaining` included in every `board` broadcast.

### Acceptance Criteria
- [ ] Timer resets on every turn change; expiry triggers exactly one auto-move
- [ ] Auto-move is always legal (uses legal-move generator from Task 1)

### Verification
- [ ] Game test: advance fake ticks past deadline, assert move applied and turn switched

### Dependencies
- Task 5

### Files
- `games/oanquan/plugin/src/main/java/com/triforge/games/oanquan/OAnQuanGame.java` (+ test)

### Scope
- S

## Checkpoint B (after Tasks 4–6)

- [ ] Build succeeds; full backend vertical slice works: 2 WebSocket clients can join, ready, play a full game to completion against the real server (verify with a scripted integration test or manual `wscat`-style driver)
- [ ] Tests pass across all modules
- [ ] No broken contracts

## Task 7: Frontend skeleton — join, lobby, static 3D board

### Description
Create `games/oanquan/frontend/` (Vite + React + Three.js + TS, dev port 3003,
`@triforge/shared-ui` via `file:` link — mirror the Tank Arena frontend structure).
Screens: join/name, lobby (ready/start, React DOM), then the 3D scene: board slab, 12 pits
via `pitWorldPosition()`, instanced stones + quan pieces rendered from `OAQBoardState`,
camera seated on the local player's side, ambient + directional light with shadows.

### Acceptance Criteria
- [ ] Connects to a room with plugin `oanquan`, lobby flow works for 2 players
- [ ] After match start, 3D board renders correct stone piles per pit, quan pieces, and both clients see identical piles (seeded offsets)
- [ ] Each player's camera faces the board from their own side; HUD overlay shows names, scores, whose turn
- [ ] Stones render as one `InstancedMesh` draw call
- [ ] `npm run build` produces static bundle

### Verification
- [ ] Manual: two browser tabs against a locally-run JAR reach the PLAYING board, each seated on opposite sides

### Dependencies
- Task 2 (TS proto), Task 5 (server slice to test against)

### Files
- `games/oanquan/frontend/` (new Vite app: `package.json`, `vite.config.ts`, `src/**` — incl. `scene/board.ts` with `pitWorldPosition`, `scene/stones.ts`)

### Scope
- M

## Task 8: Frontend gameplay — 3D move input, trace animation, endgame

### Description
Raycast pit picking: hover-highlight legal own pits, click → two floating direction arrows
→ send `OAQMoveCommand`. Animation timeline replays `OAQMoveResult` steps in 3D (pickup
lift, per-stone sow hops, capture arc to the scorer's tray, borrow arc back), then
reconciles instance counts with `board`. HUD: `moveRejected` toast, turn timer, endgame
screen with final scores + return-to-lobby.

### Acceptance Criteria
- [ ] Only current player's own non-empty pits highlight and accept clicks; both direction arrows selectable; selection cancellable
- [ ] Trace animates sequentially in 3D; when the timeline ends, rendered stone counts equal the broadcast `board`; a `board` arriving mid-animation fast-forwards it
- [ ] Captured stones accumulate visibly in each player's tray at the board edge
- [ ] Timer visible in HUD; server auto-move animates like a normal move
- [ ] Game over → winner/draw screen with points; rematch via lobby works

### Verification
- [ ] Manual: full game between two tabs, including at least one chain capture, one quan capture, and one borrow — animations correct from both seats

### Dependencies
- Task 7

### Files
- `games/oanquan/frontend/src/**` (incl. `scene/moveTimeline.ts`, `scene/picking.ts`)

### Scope
- M

## Task 9: Launcher integration + packaged serving

### Description
Bundle the frontend into the fat JAR (`oanquan-npm-ci`/`oanquan-npm-build` execs +
static copy in `launcher/triforge-server/pom.xml`) and add the game card to
`frontend/launcher-web/src/main.ts` (`/games/oanquan/`).

### Acceptance Criteria
- [ ] `mvn clean package -pl launcher/triforge-server -am` builds all three frontends
- [ ] Running the JAR: `/` shows Ô ăn quan card; `/games/oanquan/` serves the client
- [ ] `-Dskip.frontend=true` still skips everything

### Verification
- [ ] Full packaged-JAR manual game between two browsers on `http://<host-ip>:8080`

### Dependencies
- Tasks 7, 8

### Files
- `launcher/triforge-server/pom.xml`
- `frontend/launcher-web/src/main.ts`

### Scope
- S

## Task 10: End-to-end integration test

### Description
Server-runtime (or plugin) integration test: two simulated clients join an `oanquan` room,
ready up, play a scripted move sequence covering capture + borrow + game over, assert
final `MatchResult` scores — mirroring `LobbyJoinTest` style.

### Acceptance Criteria
- [ ] Test drives the real room/dispatcher path (not the game object directly)
- [ ] Asserts turn rejection, board broadcasts, and final scores

### Verification
- [ ] `mvn test -pl server/server-runtime -Dtest=OAnQuanRoomTest` green
- [ ] `mvn clean test` all green

### Dependencies
- Tasks 5, 6

### Files
- `server/server-runtime/src/test/java/.../OAnQuanRoomTest.java` (+ support helper, per the `TankArenaRoomSupport` pattern)

### Scope
- S

## Checkpoint C (final, after Tasks 7–10)

- [ ] `mvn clean package -pl launcher/triforge-server -am` succeeds
- [ ] All tests pass (`mvn clean test`)
- [ ] Full game playable end-to-end from the packaged JAR on LAN
- [ ] No regressions in tankarena / treasurequest / demo
- [ ] Move this document to `planning/archive/`

## Parallelization

- Tasks 1, 2, 4 are mutually independent → can run in parallel
- Task 3 needs only Task 2; Tasks 7–8 (frontend) can start once Task 2 locks the contract, using a stub server, but manual verification needs Task 5

## Risks

- **Rule ambiguity** is the top risk — dialect variants (quan non, borrow-debt, capture-chain stop conditions) differ by region. Mitigated by `RuleConfig` + locking v1 rules in this doc; any dispute is a config change, not a rewrite.
- **oneof field 16**: renumbering existing fields would break old clients — only append.
- **Exactly-2-players lobby** deviates from the 4–16 player assumption elsewhere (e.g. UDP discovery / room list UX untested for 2-cap rooms) — watch join-rejection UX.
- **TQ seam migration (Task 3 stretch)** could ripple into treasurequest tests; that's why it's optional.
- **3D animation reconciliation** is the riskiest client piece: a `board` snapshot arriving
  mid-timeline must fast-forward cleanly or piles desync visually. Mitigated by making the
  authoritative `board` always win (snap-correct) and keeping animation purely cosmetic.
- **Seeded stone placement** must be identical across clients — keep the offset function
  pure and shared, never `Math.random()` at render time.

## Open Questions

- Bot / single-player mode (minimax is very feasible): future plan, or pull into v1?
- Spectators for full rooms: out of scope v1 — confirm.
- Quan value 10 and quan-non off are defaults — confirm or adjust in `RuleConfig` before Task 5.
