# Implementation Plan — Đặt Bom (Bomberman 3D)

> New game plugin `bomber`: a LAN-first, server-authoritative, real-time Bomberman on a **3D
> map driven by grid logic**. This plan delivers **MVP-0 = Classic (last-man-standing)**
> end-to-end, then a phased roadmap for the large surface (7 more modes, traps, boss, bots,
> cosmetics, replay). Scope is held deliberately: everything past Classic is future work built
> on the seams established here.

## Overview

Bomberman is a **real-time 60 TPS** game, so it follows the **Tank Arena model** (authoritative
game loop, ECS avatars, `InputCommand`, delta snapshots), not the turn-based oanquan model.
The distinctive piece is a **logical tile grid** the server owns: bombs snap to cells, fire
spreads on the grid, soft blocks are destroyed on the grid, and items drop on cells — all
computed authoritatively. Players move with continuous position (ECS, reused delta-sync) but
collide against the grid.

The spec is enormous (8 modes, ~20 power-ups, 6 traps, 11 map elements, 5 bosses, cosmetics,
replay). Attempting all of it at once is the classic L-task trap. **MVP-0 implements Classic
only** — the single mode every other mode is a variation of — as a complete vertical slice:
join → lobby → countdown → move → place bomb → chain explosion → destroy blocks → drop/pick
power-ups → death → last-one-standing wins the round → best-of-N → winner screen.

### MVP-0 scope (this plan, Tasks 1–12)
- New `bomber` plugin, seeded room, ServiceLoader registration.
- One tile-grid map (Soft/Hard/Steel blocks + 4 corner spawns), authored as JSON.
- Grid movement with block collision; players see each other in real time.
- Bomb: place → 3s fuse → cross-shaped explosion → chain reaction → destroy soft blocks.
- Damage/death; **Classic** win = last player alive.
- Item drop from destroyed soft blocks + pickup; **3 core power-ups** (Bomb+, Fire+, Speed+).
- Best-of-N **rounds** + countdown between rounds + winner screen.
- 3D client (React + Three.js): grid render, interpolated avatars, bomb/fire/item VFX, HUD.
- Minimal **bot** to fill empty slots (wander + place bombs + basic self-avoidance).

### Explicitly NOT in MVP-0 (phased roadmap at the end)
Modes: Team Battle, Coin Battle, Capture Flag, King Bomb, Survival, Boss Battle, Adventure.
Traps (Spike/Ice/Conveyor/Teleport/One-way/Laser). Extended power-ups (Kick, Remote, Sticky,
Mine, Cross/Pierce fire, Dash, Shield/Extra Life/Resistance, Magnet/Radar/Ghost). Advanced map
elements (Bush/Water/Bridge/Portal/Moving Platform/Cannon/Switch/Door/Key). Bosses. Character
unlocks + cosmetics. **Replay system**. These are additive on MVP-0's seams.

---

## Architecture Decisions

### AD-1 — New plugin `bomber`, Tank Arena real-time model
- Copy `games/demo/plugin/` → `games/bomber/plugin/` (`BomberPlugin`/`BomberFactory`/
  `BomberGame`/`BomberLobby`). Register in `META-INF/services`. Add `games/bomber/plugin` to
  the parent `pom.xml` (before `server-runtime`) and as a dependency of `server-runtime` +
  `triforge-server`.
- Real-time authoritative loop like Tank Arena: `onTick` processes input, steps systems,
  broadcasts snapshots. Reuse `MatchPhaseMachine` for LOBBY/COUNTDOWN/PLAYING/ENDED.

### AD-2 — Authoritative grid; players in ECS, grid state owned by `BomberGrid`
- **State ownership split:**
  - **Player avatars** → ECS entities (`PositionComponent`, `InputComponent`, movement +
    collision systems). Ride `EntityProto` full/delta snapshots (reuse Tank Arena path).
  - **Grid state** (blocks, bombs, fire cells, dropped items) → a plain-Java `BomberGrid`
    service, **not** ECS. It is the single source of truth for bomb/fire/block logic.
- Players move continuously; movement is blocked by solid cells. Bombs **snap to the cell
  center** under the player. Explosion + collision resolve on integer grid coordinates so
  timing/reach is exact (per the spec's "grid logic" directive).

### AD-3 — Wire contract: new `GameMessage.bomber = 18` via the generic seam
- `GameMessage` oneof next free field is **18** (bugminer=17). Add `BomberMessage bomber = 18`.
- Route through the generic `Game.handleGameMessage` / `room.queueGameMessage` seam (the
  pattern oanquan `oaq=16` and bugminer=17 use). Add one `case BOMBER:` in `CommandDispatcher`
  forwarding to `queueGameMessage`. **No `instanceof` in `GameRoom`.**
- **Movement reuses the existing `InputCommand`** (legacy 4-way `moveUp/Down/Left/Right` maps
  perfectly onto grid movement) via `queueInputCommand`. Only bomber-specific actions ride
  `BomberMessage`.
- **Block destruction reuses `TileChange`** in the delta path (Tank Arena's destructible-tile
  pattern: `broadcastStateSync(this, tick, pendingTileChanges)` + a tile baseline sync).
- Bombs / fire / items ride a compact per-tick `BomberSnapshot` on the `bomber` arm (small
  boards → cheap; optimize to deltas only if profiling demands).

### AD-4 — Rounds live in the plugin (engine match machine is single-match)
- `MatchPhaseMachine` tracks one match, not best-of-N. A plugin-owned `RoundManager` sequences
  rounds: it drives per-round COUNTDOWN → PLAYING → ENDED via the match machine, tallies round
  wins, and declares the match winner after N rounds. **No change to `engine-match`.**

### AD-5 — Modes are a strategy seam; only Classic implemented in MVP
- Introduce a `GameMode` seam (win-condition + spawn + scoring strategy). MVP ships exactly one
  implementation, `ClassicMode` (last alive wins the round). The create-room UI may list other
  modes as **disabled/"coming soon"**. Adding a mode later = a new `GameMode` implementation,
  not a rewrite. This is the single most important scope-control decision.

### AD-6 — Client is dumb (platform constraint)
- Server decides bomb positions, fuse timing, chain reactions, block destruction, item drops,
  damage, and the winner. Client renders graphics/VFX/audio and **interpolates** movement only.

---

## Wire Contract (proto, lock before backend)

Add to `proto/envelope.proto`; regenerate Java (Maven) + TS (`npm run proto` in
`frontend/shared-ui`). Prefixed enum names stay unique file-wide. Add `BomberMessage bomber = 18;`
to the `GameMessage` oneof.

```proto
enum BomberBlockType {
  BB_EMPTY = 0;
  BB_SOFT = 1;    // destructible, may drop an item
  BB_HARD = 2;    // destructible only by special (future); blocks fire
  BB_STEEL = 3;   // indestructible, blocks fire
}

enum BomberItemType {
  BOMB_ITEM_NONE = 0;
  BOMB_ITEM_BOMB_UP = 1;   // +1 concurrent bomb
  BOMB_ITEM_FIRE_UP = 2;   // +1 explosion range
  BOMB_ITEM_SPEED_UP = 3;  // +movement speed
}

// client → server: place a bomb at the caller's current cell.
message BomberPlaceBomb {}

message BomberBombProto {
  uint32 id = 1;
  uint32 cellX = 2;
  uint32 cellY = 3;
  uint64 ownerPlayerId = 4;
  uint32 fuseTicksRemaining = 5;
  uint32 range = 6;
}

message BomberFireCellProto { uint32 cellX = 1; uint32 cellY = 2; uint32 ticksRemaining = 3; }
message BomberItemProto { uint32 cellX = 1; uint32 cellY = 2; BomberItemType type = 3; }

// server → all: authoritative transient grid state each broadcast tick.
// (Blocks ride TileChange on the delta path; players ride EntityProto.)
message BomberSnapshot {
  repeated BomberBombProto bombs = 1;
  repeated BomberFireCellProto fire = 2;
  repeated BomberItemProto items = 3;
}

// server → sender: authoritative per-player loadout after a pickup.
message BomberLoadout {
  uint64 playerId = 1;
  uint32 maxBombs = 2;
  uint32 fireRange = 3;
  uint32 speedLevel = 4;
  uint32 lives = 5;
}

// server → all: round/match lifecycle for the winner screen.
message BomberRoundResult {
  uint32 roundIndex = 1;
  uint64 roundWinnerPlayerId = 2;   // 0 = draw
  repeated BomberRoundScore scores = 3;
  bool matchOver = 4;
  uint64 matchWinnerPlayerId = 5;   // 0 = draw / not over
}
message BomberRoundScore { uint64 playerId = 1; string name = 2; uint32 roundsWon = 3; }

message BomberMessage {
  oneof content {
    BomberPlaceBomb placeBomb = 1;
    BomberSnapshot snapshot = 2;
    BomberLoadout loadout = 3;
    BomberRoundResult roundResult = 4;
  }
}
```

---

## Task List

### Task 1: Plugin scaffold + seeded room
#### Description
Copy the demo scaffold to `games/bomber/plugin`; implement `BomberPlugin` (id `bomber`),
`BomberFactory`, empty `BomberGame`, `BomberLobby`. Register in `META-INF/services`; wire the
module into `pom.xml`, `server-runtime`, `triforge-server`. Seed one `bomber` room at launch.
#### Acceptance Criteria
- [ ] `mvn -pl games/bomber/plugin -am test` compiles/passes.
- [ ] `GET /api/lobby/plugins` lists `bomber`; a `bomber` room appears; a client can join lobby.
#### Verification
- [ ] Boot fat JAR; confirm plugin id + seeded room via HTTP.
#### Dependencies
None.
#### Files
`games/bomber/plugin/**`, `pom.xml`, `server-runtime/pom.xml`, `triforge-server/pom.xml`,
room-seed call site, `META-INF/services/...GamePlugin`.
#### Scope
S

### Task 2: Lock the wire contract (proto + dispatcher)
#### Description
Add the Wire Contract block to `envelope.proto`, add `bomber = 18` to `GameMessage`, add a
`case BOMBER:` in `CommandDispatcher` → `room.queueGameMessage`. Regenerate Java + TS. No
handler logic yet.
#### Acceptance Criteria
- [ ] `protocol` builds; `BomberMessage` exists in Java + TS.
- [ ] Dispatcher routes `BOMBER` generically; no `instanceof` in `GameRoom`.
#### Verification
- [ ] `mvn -pl protocol -am test`; `npm run proto` regenerates cleanly.
#### Dependencies
Task 1.
#### Files
`proto/envelope.proto`, `CommandDispatcher.java`, generated sources.
#### Scope
S (contract lock — do before backend work depending on it)

### Task 3: Grid map model + loader + block tiles + spawns
#### Description
Define `BomberGrid` (cells, `BomberBlockType`, 4 corner spawn points) and a JSON map loader
(pattern: Tank Arena `MapLoader`). Author `classic-01.json` (e.g. 15×13 with the checkerboard
hard-block pattern, soft blocks scattered, corners kept clear). Implement `toMapSnapshot()` and
a tile baseline sync (pattern: `TankArenaTileBaselineSync`) so blocks and their destruction
replicate.
#### Acceptance Criteria
- [ ] Loader parses `classic-01.json`; malformed maps fail loudly at boot.
- [ ] `toMapSnapshot()` returns the block grid; spawn corners are clear.
- [ ] Baseline sync established for tile changes.
#### Verification
- [ ] Unit test: loader parses shipped map; rejects a malformed fixture.
#### Dependencies
Task 1.
#### Files
`.../grid/{BomberGrid,BomberBlockType,MapLoader,SpawnCorners}.java`,
`resources/maps/classic-01.json`, `.../sync/BomberTileBaselineSync.java`.
#### Scope
M

### Task 4: Player spawn + grid movement + block collision
#### Description
Spawn one avatar per player at a corner. Reuse `InputCommand` (4-way) via `queueInputCommand`;
add ECS `PositionComponent`/`InputComponent` + a `MovementSystem` and a `GridCollisionSystem`
(block movement into solid cells). Broadcast full/delta `EntityProto` snapshots so all players
see each other move.
#### Acceptance Criteria
- [ ] Players spawn at distinct corners; move on the grid; cannot pass solid blocks.
- [ ] Two simulated players in a test see each other's position update.
#### Verification
- [ ] Unit test: movement + solid-cell collision. Manual: two tabs walk around.
#### Dependencies
Tasks 2, 3.
#### Files
`.../components/**`, `.../systems/{MovementSystem,GridCollisionSystem}.java`,
`.../entities/BomberAvatarFactory.java`, `BomberGame`.
#### Scope
M

## Checkpoint A (after Tasks 1–4)
- [ ] Build + `mvn clean test` green.
- [ ] Players join, spawn at corners, and walk a collidable grid seeing each other. A working
      "co-op walking grid" — the base every later task builds on.

### Task 5: Bomb placement + fuse timer + snapshot broadcast
#### Description
Handle `BomberPlaceBomb`: snap to the caller's cell, enforce the per-player concurrent-bomb
limit, register a bomb in `BomberGrid` with a 3s fuse. Tick fuses in `onTick`; broadcast a
`BomberSnapshot` (bombs) each broadcast tick. A bomb cell is solid to others but passable by
its placer until they step off (classic rule).
#### Acceptance Criteria
- [ ] Placing a bomb registers it at the player's cell; fuse counts down deterministically.
- [ ] Concurrent-bomb limit enforced; clients receive bomb state via `BomberSnapshot`.
#### Verification
- [ ] Unit test: place → fuse decrements → expires at 3s; limit rejects extra bombs.
#### Dependencies
Task 4.
#### Files
`.../grid/{Bomb,BombRegistry}.java`, `.../systems/BombFuseSystem.java`, `BomberGame`.
#### Scope
M

### Task 6: Explosion — cross fire, block destruction, chain reaction
#### Description
On fuse expiry, compute a cross-shaped blast up to the bomb's `range`, stopped by Hard/Steel
(Steel indestructible; Hard blocks fire and is destroyed per config). Destroy Soft blocks along
the blast (emit `TileChange`). If the blast reaches another bomb's cell, **detonate it
immediately** (chain reaction). Spawn short-lived fire cells (in `BomberSnapshot`).
#### Acceptance Criteria
- [ ] Blast forms a range-limited cross, correctly stopped by hard/steel.
- [ ] Soft blocks in the blast are destroyed and replicated via `TileChange`.
- [ ] A blast overlapping another bomb triggers immediate chain detonation.
#### Verification
- [ ] Unit tests: cross reach/stop rules; chain reaction; block destruction deltas.
#### Dependencies
Task 5.
#### Files
`.../systems/ExplosionSystem.java`, `.../grid/{FireCell,BlastResolver}.java`, `BomberGame`.
#### Scope
M

### Task 7: Damage, death, and Classic round resolution
#### Description
Any player standing on a fire cell dies (MVP: one life per round). Introduce the `GameMode`
seam with `ClassicMode`: when ≤1 player remains alive, the round ends with that player (or
draw) as round winner. Broadcast death events + a `BomberRoundResult` (round-level).
#### Acceptance Criteria
- [ ] A player caught in fire dies; a dead player stops acting.
- [ ] Round ends when one (or zero) players remain; correct round winner declared.
#### Verification
- [ ] Unit test: two players, one caught in own blast → other wins the round; mutual death → draw.
#### Dependencies
Task 6.
#### Files
`.../mode/{GameMode,ClassicMode}.java`, `.../systems/DamageSystem.java`, `BomberGame`.
#### Scope
M

## Checkpoint B (after Tasks 5–7)
- [ ] `mvn clean test` green.
- [ ] Full Classic kill loop works server-side: place → chain explosion → destroy blocks →
      kill → last-alive wins the round. This is the game's beating heart.

### Task 8: Item drop + pickup + core power-ups
#### Description
Destroyed Soft blocks may drop an item (weighted random) onto the freed cell, published in
`BomberSnapshot`. Walking onto an item picks it up and applies the effect to the player's
loadout: `BOMB_UP` (+concurrent bomb), `FIRE_UP` (+range), `SPEED_UP` (+speed). Broadcast
`BomberLoadout` to the picker; loadout persists for the round.
#### Acceptance Criteria
- [ ] Some destroyed soft blocks drop items; pickup applies the effect immediately.
- [ ] Bomb-count / fire-range / speed changes take effect on subsequent bombs/movement.
#### Verification
- [ ] Unit test: destroy soft block → item drop (seeded RNG) → pickup → loadout updated.
#### Dependencies
Task 7.
#### Files
`.../items/{ItemDropTable,PlayerLoadout,PickupSystem}.java`, `BomberGame`.
#### Scope
M

### Task 9: Round/Match management (best-of-N + winner screen)
#### Description
Implement `RoundManager` (AD-4): sequence best-of-N rounds via the match machine — between
rounds reset the grid + respawn players + countdown; tally round wins; after N rounds (or a
clinch) end the match and broadcast the final `BomberRoundResult{matchOver}`. Honor create-room
`Round` and `Time Limit` (round time cap → sudden death or draw).
#### Acceptance Criteria
- [ ] A match runs multiple rounds with reset/respawn/countdown between them.
- [ ] Round wins tally; match winner declared after N rounds; final result broadcast.
- [ ] Round time limit ends a stalemated round.
#### Verification
- [ ] Unit test: best-of-3 resolves a match winner; time cap ends a round.
#### Dependencies
Tasks 7, 8.
#### Files
`.../round/RoundManager.java`, `BomberGame`, `BomberLobby` (round/time config).
#### Scope
M

### Task 10: Lobby config for bomber (Classic)
#### Description
Adapt the lobby to bomber create-room fields relevant to MVP: Room Name, Map (single option),
Mode (**Classic** enabled; others listed disabled per AD-5), Max Players, Round, Time Limit,
Bot Count. Reuse the ready/countdown/start flow (pattern: Tank Arena / oanquan lobby).
#### Acceptance Criteria
- [ ] Host sets Max Players / Round / Time Limit / Bot Count; non-Classic modes are disabled.
- [ ] Ready → countdown → match start works; config reaches `RoundManager`.
#### Verification
- [ ] Unit test: lobby config maps to match/round config; start gated on readiness.
#### Dependencies
Task 9.
#### Files
`BomberLobby.java`, lobby snapshot mapping, `BomberGame`.
#### Scope
M

## Checkpoint C (after Tasks 8–10)
- [ ] `mvn clean test` green.
- [ ] Backend Classic mode is feature-complete: configurable lobby → best-of-N rounds with
      power-ups → match winner. Ready for a client.

### Task 11: Minimal AI bot (fill empty slots)
#### Description
Add a simple server-side bot to fill `Bot Count` slots: wander toward reachable soft blocks,
place a bomb when adjacent, and step away from fire (basic self-preservation via grid
flood-check). Bots are `AISystem`-driven pseudo-players; no pathfinding beyond greedy grid
steps in MVP.
#### Acceptance Criteria
- [ ] Bots occupy lobby slots and play a round without walking into their own blasts most of
      the time; they destroy blocks and can kill/lose.
- [ ] A round of all-bots resolves to a winner without deadlock.
#### Verification
- [ ] Unit test: bot avoids a fire cell it can escape; places a bomb next to a soft block.
#### Dependencies
Task 9.
#### Files
`.../ai/{BotController,BotSystem}.java`, `BomberGame`, `BomberLobby` (bot slots).
#### Scope
M

### Task 12: 3D client + HUD + docs
#### Description
Scaffold `games/bomber/frontend` (React + Three.js, `@triforge/shared-ui` via `file:` link,
new dev port). Render the grid map, interpolated avatars from `EntityProto`, bombs/fire/items
from `BomberSnapshot`, and destruction from `TileChange`. Input: 4-way move → `InputCommand`,
bomb key → `BomberPlaceBomb`. HUD: Time, Lives, Bomb, Fire, Speed, Mini Map, round scores.
Winner screen from `BomberRoundResult`. Serve at `/games/bomber/`; add to launcher catalog.
Update `AGENTS.md` (module, route, wire arm `bomber=18`, dev port); `mvn clean test` green.
#### Acceptance Criteria
- [ ] Two browsers play a full Classic round: move, bomb, chain, destroy, pick-up, die, win.
- [ ] HUD reflects live loadout; winner screen shows on match end.
- [ ] `AGENTS.md` documents bomber; full reactor test green.
#### Verification
- [ ] `npm run build`; manual two-tab (or vs-bot) playthrough to a match winner.
#### Dependencies
Tasks 4–11 (server messages).
#### Files
`games/bomber/frontend/**`, launcher catalog, `AGENTS.md`, `frontend/shared-ui` regen.
#### Scope
M

## Checkpoint D (after Tasks 11–12)
- [ ] Playable Classic Bomberman 3D end-to-end in the browser (PvP + bots), docs updated.
- [ ] MVP-0 done. All roadmap items below are additive on these seams.

---

## Checkpoints
Summarized above: **A** (Tasks 1–4, movable grid), **B** (5–7, kill loop), **C** (8–10,
backend feature-complete), **D** (11–12, playable + docs). Each requires build green, tests
pass, feature works end-to-end, and no broken contracts.

---

## Risks
- **Scope explosion** — 8 modes, ~20 power-ups, traps, bosses, cosmetics, replay. *Mitigation:*
  AD-5 mode seam + hard MVP line at Classic; everything else is roadmap.
- **60 TPS board broadcast cost** — `BomberSnapshot` every tick. *Mitigation:* small boards;
  broadcast at a reduced rate or switch to deltas only if profiling shows a problem.
- **Explosion/chain determinism** — chain reactions and simultaneous detonations must be
  order-independent. *Mitigation:* resolve blasts in a fixed pass with an explicit
  detonation queue; unit-test chains and mutual death.
- **Rounds vs single-match engine** — `MatchPhaseMachine` is single-match. *Mitigation:* AD-4
  keeps `RoundManager` in the plugin; do **not** modify `engine-match`.
- **Bot quality** — griefing itself / deadlocks. *Mitigation:* MVP bot is intentionally simple;
  test the escape-fire and place-bomb behaviors; accept imperfect play.
- **Grid ↔ 3D reconciliation** — continuous movement vs cell-based bombs/fire. *Mitigation:*
  snap bombs to cells, resolve blast/collision on integer coords, interpolate only on client.
- **Replay system** (spec'd) is cross-cutting infra (record inputs/snapshots + playback) —
  large and platform-wide. Deliberately deferred; see roadmap.

---

## Open Questions
Sensible defaults are proposed so planning isn't blocked; confirm or override before Task 3–4.
1. **Movement style**: continuous-with-tile-collision (modern, recommended) vs strictly
   grid-locked cell-to-cell (classic feel)? *Default: continuous.*
2. **Default map size & round count**: 15×13 grid, best-of-3? *Default: yes.*
3. **MVP power-up set**: Bomb+/Fire+/Speed+ only? *Default: yes; rest are roadmap.*
4. **Lives per round**: 1 (pure last-man-standing)? *Default: 1; Extra Life item is roadmap.*
5. **Bots in MVP**: include the minimal bot (Task 11) or defer entirely? *Default: include
   minimal; it backs the create-room "Bot Count" field.*
6. **Replay**: confirmed out of MVP-0 (roadmap)? *Default: out.*
7. **Plugin id / display name**: `bomber` / "Đặt Bom"? *Default: yes.*

---

## Phased Roadmap (post-MVP, each phase additive on MVP seams)

**Phase 2 — Modes** (each = one `GameMode` impl, AD-5): Team Battle (teams + friendly-fire
rules), Coin Battle (coin spawns + collection scoring), King Bomb (hold-timer scoring),
Survival (monster spawner + waves). Capture Flag + Boss Battle + Adventure need map/AI features
below.

**Phase 3 — Power-ups & items**: Bomb (Kick, Remote, Sticky, Mine), Fire (Cross, Pierce),
Speed (Dash), Defense (Shield, Extra Life, Bomb Resistance), Utility (Magnet, Item Radar, Ghost
Walk). Each is an item type + loadout/effect handler on the Task 8 seam.

**Phase 4 — Traps & advanced map elements**: Spike, Ice, Conveyor Belt, Teleport, One-way Door,
Rotating Laser; Bush, Water, Bridge, Portal, Moving Platform, Cannon, Switch, Door, Key. Extend
`BomberGrid` cell types + per-cell behavior systems.

**Phase 5 — Boss Battle & Adventure**: boss entities (Giant Slime, Robot Tank, Dragon, Ghost
King, Fire Golem) with attack patterns (place bombs, summon, laser, jump, missiles); co-op
level progression (Adventure).

**Phase 6 — Identity & polish**: Characters (Ninja/Pirate/Robot/Knight/Wizard/Alien — visual
only), Cosmetics (Skin/Hat/Backpack/Explosion Effect/Bomb Skin/Footprint/Emoji), full HUD
theming.

**Phase 7 — Replay**: server-side record (inputs + authoritative snapshots) + playback client
(Free Camera, Slow Motion, Highlight Kill, Save Replay). Cross-cutting; likely a platform-level
capability reusable by other games.
```
