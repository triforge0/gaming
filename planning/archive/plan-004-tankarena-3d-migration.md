# Implementation Plan — Tank Arena 2D → 3D Migration

**Plan ID:** 004
**Status:** Draft (awaiting confirmation on Open Questions)
**Author:** planning session 2026-07-02

## Overview

Migrate Tank Arena from a **2D tile-grid game** (Phaser client + 2D authoritative
Java server) to a **true 3D game with terrain elevation**: rewrite the authoritative
engine (ECS components, physics, collision, vision) from 2D `(x, y)` grid mechanics to
3D `(x, y, z)` mechanics, extend the protobuf wire contract accordingly, and replace the
Phaser frontend with **React (UI) + Three.js (render)**.

This is **not a frontend re-skin**. Because the server is authoritative and 2D
(`PositionComponentProto{x,y}`, 4-way `Direction`, tile-grid `CollisionDetector`,
`MovementSystem`, `FogOfWarSystem`), "true 3D" requires rewriting server-side simulation.
Estimated split: ~40% backend engine rewrite, ~50% frontend rewrite, ~10% wire/contract.

### Scope decisions (locked)

- **3D depth:** True 3D — terrain with elevation. Tanks drive on a heightfield; turret
  aims with yaw + pitch. Free-fly/jump mechanics are out of scope.
- **Bullets (locked):** **straight-line** along turret aim, with elevation — **no
  gravity/arc** in v1.
- **Camera (locked):** **third-person follow-cam** behind/above the self tank.
- **Aim input (locked):** **keyboard only** — no mouse-look/pointer-lock. Keys express
  *rotation intent*; the **server accumulates** hull yaw + turret pitch (authoritative).
- **Art (locked):** v1 uses **primitive geometry** (boxes/cylinders); real 3D
  models/textures are deferred to a follow-up plan.
- **Frontend:** React for UI shell (lobby, HUD, scoreboard); **Three.js drawn directly
  in a `requestAnimationFrame` loop**, never through React state per-frame.
- **Strategy:** New parallel frontend at `games/tankarena/frontend-3d/`. Keep the
  existing Phaser `frontend/` running for behavioural comparison until the 3D client
  reaches parity, then cut over.
- **Reuse:** `frontend/shared-ui` (WebSocket client, discovery, proto codec) is
  framework-agnostic and is reused 100% by the new client.

## Architecture Decisions

### Contract-first: the proto is the lock point

All 2D→3D divergence must be resolved in `proto/envelope.proto` **before** any engine or
client code changes. Backend and both frontends share this contract. Key changes:

| Message | 2D today | 3D target |
|---|---|---|
| `PositionComponentProto` | `float x, y` | add `float z` (elevation) |
| `DirectionComponentProto` | `Direction` enum (4-way) | replace with `OrientationComponentProto { float yaw; float pitch; }` (hull yaw + turret pitch) |
| `BulletComponentProto` | `float dx, dy` | add `float dz`; velocity is a 3D vector (straight-line, no gravity) |
| `InputCommand` | 4 bool move + shoot | hull-relative move bools (`moveForward/moveBackward`), hull-turn bools (`turnLeft/turnRight`), turret-pitch bools (`aimUp/aimDown`), keep `shoot`. Bools = rotation *intent*; server accumulates yaw/pitch. |
| `MapSnapshot` | `repeated TileType tiles` (flat grid) | add per-cell elevation: `repeated float heights` (heightfield), keep `tiles` for surface type |
| `TileChange` | `x, y, tile` | add optional `z`/height change for destructible terrain |

**Rule:** Proto changes land in one task, are reviewed, then locked. No further wire
changes without a new contract task. Regenerate Java (`protocol` module) **and** TS
(`npm run proto` in `frontend/shared-ui`) in the same task so both sides stay in lockstep.

Backwards compatibility: proto3 field additions are wire-compatible, so the **old Phaser
client keeps working** against the new server as long as the server still populates the
legacy fields (`x, y`, and a derived 4-way `Direction`) during the parity window. The
`OrientationComponentProto` is **added alongside** the legacy `DirectionComponentProto`,
not replacing it, until cutover (Task 14). This is what makes side-by-side comparison possible.

### Engine stays generic

Per CLAUDE.md, `engine-ecs` / `engine-core` must contain **no tank/team/map types**. All
3D math primitives (`Vec3`, heightfield sampling, 3D AABB) live either in `engine-ecs`
(if truly generic) or in a new `games/tankarena/plugin/.../world3d` package (if
tank-specific). Default: put reusable 3D math in a small `engine-ecs` `math` package;
keep terrain/heightfield semantics in the tank plugin.

### State ownership

- Server remains **sole authority** for position, elevation, collision, hit detection.
- Client stays **dumb**: renders interpolated 3D snapshots, sends input (including
  aim yaw/pitch). No client-side physics or hit detection. This constraint is unchanged.

### Rendering boundary (frontend)

- **Three.js render loop** owns per-frame draw + interpolation (ported from
  `GameScene.interpolateTanks/Bullets`, now 3D lerp + slerp).
- **React** owns only the DOM overlay UI and scene transitions, driven by throttled
  state updates (not per-tick). A thin `GameBridge` (plain TS, framework-agnostic) sits
  between `shared-ui`'s `GameClient` handlers and both the Three.js scene and React state.

## Task List

> Ordered bottom-up. Contract → engine slices → frontend slices → cutover.
> No task exceeds size M; L-sized work has been split.

### Task 1: Lock the 3D wire contract

#### Description
Extend `proto/envelope.proto` with 3D fields (z, orientation yaw/pitch, bullet dz, aim
input, map heightfield) **additively**, keeping legacy 2D fields intact. Regenerate Java
and TypeScript bindings.

#### Acceptance Criteria
- [ ] `PositionComponentProto.z`, `OrientationComponentProto{yaw,pitch}`,
  `BulletComponentProto.dz`, `InputCommand.aimYaw/aimPitch`,
  `MapSnapshot.heights` added; legacy fields untouched.
- [ ] `protocol` module regenerates and compiles.
- [ ] `frontend/shared-ui` `npm run proto` regenerates `proto.js/.d.ts` cleanly.

#### Verification
- [ ] `mvn -pl protocol -am compile` passes.
- [ ] Old Phaser client still builds against regenerated `shared-ui`.

#### Dependencies
None.

#### Files
- `proto/envelope.proto`
- `frontend/shared-ui/src/net/proto.js`, `proto.d.ts` (generated)

#### Scope
S

---

### Task 2: 3D math + component foundation in the engine

#### Description
Introduce reusable 3D math (`Vec3`) and convert the tank plugin's spatial components to
3D: `PositionComponent(x,y,z)` with prev-state, and a new `OrientationComponent(yaw,pitch)`
alongside (not yet removing) `DirectionComponent`.

#### Acceptance Criteria
- [ ] `Vec3` value type with add/sub/scale/length (engine-ecs `math` package).
- [ ] `PositionComponent` carries `z` + `savePrevious/revertToPrevious` for 3 axes.
- [ ] `OrientationComponent` added; `DirectionComponent` retained for legacy mapping.
- [ ] Existing 2D callers updated to `z=0` defaults; module compiles.

#### Verification
- [ ] `mvn -pl engine/engine-ecs -am test` passes.
- [ ] `mvn -pl games/tankarena/plugin test` compiles (behaviour unchanged, z=0).

#### Dependencies
Task 1.

#### Files
- `engine/engine-ecs/.../math/Vec3.java` (new)
- `games/tankarena/plugin/.../components/PositionComponent.java`
- `games/tankarena/plugin/.../components/OrientationComponent.java` (new)

#### Scope
M

---

### Task 3: Terrain heightfield map model

#### Description
Extend the map model from a flat tile grid to a **heightfield**: each cell keeps its
`TileType` (surface) plus an elevation. Update `GameMap`, `MapLoader`, and map JSON to
carry per-cell height; add `heightAt(worldX, worldZ)` bilinear sampling.

#### Acceptance Criteria
- [ ] Map JSON gains an optional `heights[]` (defaults flat when absent).
- [ ] `GameMap.heightAt(x, z)` returns interpolated ground elevation.
- [ ] `TankArenaMapSnapshotService` populates `MapSnapshot.heights`.
- [ ] Legacy flat maps load unchanged (all-zero heightfield).

#### Verification
- [ ] `mvn -pl games/tankarena/plugin test`; new `MapLoader`/`GameMap` height tests pass.

#### Dependencies
Task 2.

#### Files
- `games/tankarena/plugin/.../map/GameMap.java`
- `games/tankarena/plugin/.../map/MapLoader.java`
- `games/tankarena/plugin/.../sync/TankArenaMapSnapshotService.java`
- `games/tankarena/plugin/src/main/resources/maps/*.json`

#### Checkpoint
- [ ] Build succeeds; existing 2D tests green; map snapshot carries heights.

---

### Task 4: 3D movement on the heightfield (end-to-end slice)

#### Description
Rewrite `MovementSystem` so hull movement is heading-relative on the XZ plane (forward/back
along hull yaw), with the tank's `y` clamped to `GameMap.heightAt`. The **server accumulates**
hull yaw from `turnLeft/turnRight` intent and turret pitch from `aimUp/aimDown` intent into
`OrientationComponent` (clamped pitch range). Server still emits a derived 4-way `Direction`
for legacy clients (mapped from hull yaw).

#### Acceptance Criteria
- [ ] Tanks follow terrain elevation (`y = heightAt(x,z)` each tick).
- [ ] Hull moves forward/back along accumulated yaw; `turnLeft/turnRight` rotate yaw at a
  fixed rad/tick; `aimUp/aimDown` adjust turret pitch within clamp.
- [ ] Legacy `DirectionComponentProto` still populated (nearest 4-way) during parity window.
- [ ] `RoomInputProcessor` maps the new intent bools onto `InputComponent`.

#### Verification
- [ ] `mvn -pl games/tankarena/plugin test`; new movement tests (slope following, yaw) pass.

#### Dependencies
Task 3.

#### Files
- `games/tankarena/plugin/.../systems/MovementSystem.java`
- `games/tankarena/plugin/.../components/InputComponent.java`
- `games/tankarena/plugin/.../input/RoomInputProcessor.java`

#### Scope
M

---

### Task 5: 3D collision + world bounds

#### Description
Rewrite `CollisionDetector`, `MapCollisionSystem`, `WorldBoundsCollisionSystem`,
`TankTankCollisionSystem` from 2D tile-AABB to 3D: tank AABB vs solid terrain columns and
vs terrain slope walls, tank-vs-tank in 3D, and 3D world bounds (`WorldBounds`,
`TankGeometry`).

#### Acceptance Criteria
- [ ] Tanks cannot pass through solid tiles/steep terrain (3D AABB test).
- [ ] Tank-tank overlap resolved in 3D; world bounds clamp x/y/z.
- [ ] Revert-on-collision uses 3D previous position.

#### Verification
- [ ] `mvn -pl games/tankarena/plugin test`; ported + new 3D collision tests pass.

#### Dependencies
Task 4.

#### Files
- `games/tankarena/plugin/.../collision/CollisionDetector.java`
- `games/tankarena/plugin/.../systems/{MapCollisionSystem,WorldBoundsCollisionSystem,TankTankCollisionSystem}.java`
- `games/tankarena/plugin/.../world/{WorldBounds,TankGeometry}.java`

#### Scope
M

---

### Task 6: 3D ballistics — shooting & bullet collision

#### Description
Rewrite `ShootingSystem` and bullet handling so bullets spawn from the turret with a 3D
velocity from yaw+pitch, travel in 3D (optional gravity — see Q1), and collide with tanks
(3D sphere-AABB) and terrain (heightfield/solid columns). Update `BulletComponent` to
`(dx,dy,dz)`.

#### Acceptance Criteria
- [ ] Bullets spawn along turret aim; velocity is 3D.
- [ ] Bullet-vs-tank and bullet-vs-terrain hits detected in 3D.
- [ ] `TankArenaSnapshotWriter` emits `dz` and bullet z.

#### Verification
- [ ] `mvn -pl games/tankarena/plugin test`; shooting/collision tests pass.

#### Dependencies
Task 5.

#### Files
- `games/tankarena/plugin/.../systems/ShootingSystem.java`
- `games/tankarena/plugin/.../systems/CollisionSystem.java`
- `games/tankarena/plugin/.../components/BulletComponent.java`
- `games/tankarena/plugin/.../TankArenaSnapshotWriter.java`

#### Checkpoint
- [ ] Full backend match simulation runs headless in 3D; all plugin tests green.

---

### Task 7: 3D vision, fog & line-of-sight

#### Description
Update `FogOfWarSystem`, `FogOfWarCalculator`, `LineOfSight`, `VisibilityMap`,
`CoverDetector` to account for elevation (higher ground sees further / over cover;
terrain blocks LOS). Keep fog snapshot as a 2D grid overlay (projected), but compute
visibility using 3D LOS.

#### Acceptance Criteria
- [ ] LOS blocked by terrain height and solid tiles in 3D.
- [ ] Fog snapshot still serialized as the existing 2D `FogSnapshot` grid.
- [ ] Elevation affects vision range/cover per agreed rule.

#### Verification
- [ ] `mvn -pl games/tankarena/plugin test`; fog/LOS tests pass.

#### Dependencies
Task 6.

#### Files
- `games/tankarena/plugin/.../systems/FogOfWarSystem.java`
- `games/tankarena/plugin/.../vision/FogOfWarCalculator.java`
- `games/tankarena/plugin/.../map/{LineOfSight,VisibilityMap,CoverDetector}.java`

#### Scope
M

---

### Task 8: 3D spawns, HQ & match integration

#### Description
Update spawn placement (`SpawnRegionResolver`, `SpawnRegionDefinition`,
`TankEntityFactory`), headquarters (`HeadquartersDefinition`, `MatchHeadquarters`,
`MatchProtoMapper`), and `TankArenaGame` wiring so entities spawn at correct 3D positions
on the terrain and HQ damage/geometry works in 3D. Ensures a full match plays end-to-end
server-side in 3D.

#### Acceptance Criteria
- [ ] Tanks spawn on-terrain at region positions with correct elevation.
- [ ] HQ placement, damage, and destruction work with 3D coordinates.
- [ ] `TankArenaGame` schedules all rewritten systems; a scripted match completes.

#### Verification
- [ ] `mvn -pl games/tankarena/plugin test` fully green (all systems 3D).
- [ ] `mvn -pl server/server-runtime test` green (integration/lobby tests unaffected).

#### Dependencies
Task 7.

#### Files
- `games/tankarena/plugin/.../map/{SpawnRegionResolver,SpawnRegionDefinition,HeadquartersDefinition,MatchHeadquarters}.java`
- `games/tankarena/plugin/.../entities/TankEntityFactory.java`
- `games/tankarena/plugin/.../match/MatchProtoMapper.java`
- `games/tankarena/plugin/.../TankArenaGame.java`

#### Checkpoint
- [ ] **Backend 3D-complete.** Full `mvn clean test` green. Old Phaser client can still
  connect (legacy fields populated) and render a flattened top-down view.

---

### Task 9: Scaffold `frontend-3d` (React + Three.js + shared-ui)

#### Description
Create `games/tankarena/frontend-3d/` — Vite + React + TypeScript + Three.js, depending on
`@triforge/shared-ui` via `file:` link (mirroring the existing frontend). Establish the
`GameBridge` seam and an empty Three.js canvas + React shell that connects to a room.

#### Acceptance Criteria
- [ ] `npm install && npm run build` produces a bundle.
- [ ] Connects to a server room via `shared-ui` `GameClient`; logs snapshots.
- [ ] React shell + Three.js `<canvas>` mount; `GameBridge` wires client handlers.

#### Verification
- [ ] `cd games/tankarena/frontend-3d && npm run build` passes.
- [ ] Manual: open dev server, join a room, see snapshot logs.

#### Dependencies
Task 1 (proto). Can start in parallel with backend tasks 2–8.

#### Files
- `games/tankarena/frontend-3d/` (package.json, vite.config.ts, index.html, tsconfig)
- `games/tankarena/frontend-3d/src/net/GameBridge.ts` (new)
- `games/tankarena/frontend-3d/src/main.tsx`, `App.tsx`

#### Scope
M

---

### Task 10: Three.js world render — terrain, tanks, bullets, camera

#### Description
Port the render/interpolation core of `GameScene` to Three.js: heightfield terrain mesh
from `MapSnapshot`, tank meshes (hull + turret) oriented by yaw/pitch, bullet meshes,
3D camera (follow-cam behind/above self tank), and per-frame 3D interpolation (lerp
position, slerp orientation).

#### Acceptance Criteria
- [ ] Terrain mesh built from `MapSnapshot.tiles + heights`.
- [ ] Tanks/bullets render at interpolated 3D positions; self-tank highlighted.
- [ ] Follow camera tracks self tank; entities culled off-view.

#### Verification
- [ ] Manual: two clients in a match show each other moving over terrain in 3D.

#### Dependencies
Task 9; needs server emitting 3D (Task 8) for full validation.

#### Files
- `games/tankarena/frontend-3d/src/render/{Terrain,TankMesh,BulletMesh,SceneRoot,Camera,interpolate}.ts` (new)

#### Scope
M

---

### Task 11: Input — keyboard movement + keyboard aim

#### Description
Capture keyboard for hull movement (forward/back), hull turn (left/right), turret pitch
(up/down keys), and shoot; map to `InputCommand` intent bools. No mouse-look. Send via
`GameClient.sendInput`, matching server expectations from Task 4 (server accumulates
yaw/pitch).

#### Acceptance Criteria
- [ ] Keybinds: e.g. W/S move, A/D turn hull, Q/E (or ↑/↓) turret pitch, Space shoot.
- [ ] Each produces the correct intent bools in `InputCommand`; no absolute aim sent.
- [ ] Held keys keep sending intent so server keeps rotating smoothly.

#### Verification
- [ ] Manual: local tank moves/turns/aims/shoots; server responds authoritatively.

#### Dependencies
Task 10.

#### Files
- `games/tankarena/frontend-3d/src/input/InputController.ts` (new)

#### Checkpoint
- [ ] **Playable 3D vertical slice:** join → move over terrain → aim → shoot → hit,
  fully authoritative, two clients.

---

### Task 12: React UI shell — lobby, HUD, scoreboard, fog

#### Description
Port `LobbyScene`, `RoomLobbyScene`, `MatchHud`, `KillFeed`, `MatchStatusBanner`,
`ObjectivesPanel`, `ReloadBar`, `ScoreboardScene` and `playerRegistry`/`matchUi` logic to
React components driven by throttled `GameBridge` state. Render fog as a Three.js overlay
or projected texture.

#### Acceptance Criteria
- [ ] Lobby (team/spawn/ready/start), in-match HUD, kill feed, objectives, reload bar,
  and scoreboard all functional in React.
- [ ] Fog-of-war visualized from `FogSnapshot`.
- [ ] Match phase transitions (countdown → playing → ended → scoreboard) work.

#### Verification
- [ ] Manual: full match flow lobby→result identical in behaviour to Phaser client.

#### Dependencies
Task 11.

#### Files
- `games/tankarena/frontend-3d/src/ui/*.tsx` (new)
- `games/tankarena/frontend-3d/src/render/FogOverlay.ts` (new)

#### Scope
M

---

### Task 13: Build & serve integration

#### Description
Wire `frontend-3d` into the package pipeline so its bundle is served (initially at a
distinct path, e.g. `/games/tankarena-3d/`, to run beside the Phaser build). Update
`StaticAssetResolver`, launcher bundling, and the `-Dskip.frontend` flow.

#### Acceptance Criteria
- [ ] `mvn clean package -pl launcher/triforge-server -am` builds both frontends.
- [ ] 3D client served and reachable; Phaser client still served at its path.
- [ ] `-Dskip.frontend=true` still works.

#### Verification
- [ ] Run the fat JAR; open both client URLs; both connect to the same server.

#### Dependencies
Task 12.

#### Files
- `server/server-runtime/.../transport/netty/StaticAssetResolver.java`
- `launcher/triforge-server/pom.xml`, launcher static-bundle wiring
- root/`games` `pom.xml` (frontend build hook)

#### Checkpoint
- [ ] Both clients build, serve, and play against one server. Parity comparison possible.

---

### Task 14: Parity validation & cutover

#### Description
Confirm the 3D client reaches functional parity, then make it the default Tank Arena
client: point `/games/tankarena/` at the 3D bundle, retire the Phaser `frontend/` (move
to an archive/remove), and drop legacy-only proto fields (`DirectionComponentProto`) if no
longer needed. Update CLAUDE.md.

#### Acceptance Criteria
- [ ] Parity checklist passed (movement, shooting, hits, fog, HQ, lobby, scoreboard).
- [ ] `/games/tankarena/` serves the 3D client; Phaser frontend removed/archived.
- [ ] Legacy 4-way `Direction` mapping removed from server if unused; proto cleaned.
- [ ] CLAUDE.md stack/table updated (Three.js + React, 3D engine).

#### Verification
- [ ] `mvn clean test` and full `package` green; multi-client 3D match on the fat JAR.

#### Dependencies
Task 13.

#### Files
- `games/tankarena/frontend/` (archived/removed)
- `proto/envelope.proto` (legacy cleanup)
- `CLAUDE.md`

#### Scope
M

## Checkpoints

- **After Task 3** — heightfield map loads; 2D tests still green.
- **After Task 6** — headless 3D match simulation runs; plugin tests green.
- **After Task 8** — backend fully 3D; `mvn clean test` green; old client still connects.
- **After Task 11** — playable 3D vertical slice (two clients, authoritative).
- **After Task 13** — both clients serve and play against one server.
- **After Task 14** — cutover complete; plan archived.

## Risks

- **Scope (highest):** This is effectively a game re-implementation, not a port. The 2D
  tile-grid assumption is baked into ~15 backend files. Mitigation: strict vertical slices,
  keep 2D tests as a regression net until Task 8, keep old client live until Task 14.
- **Gameplay design gap:** 2D→3D raises design questions (bullet gravity? verticality of
  aim? camera style?) that are gameplay, not just engineering. Unresolved answers stall
  Tasks 4/6/10. Mitigation: resolve Open Questions before starting Task 4.
- **Vision/fog in 3D:** LOS over terrain is materially more complex than grid raycasts;
  risk of perf regression at 60 TPS with many entities. Mitigation: keep fog projected to
  2D grid; benchmark in Task 7.
- **Interpolation feel:** 3D lerp+slerp with 100 ms buffer may feel worse on slopes than
  the flat 2D version. Mitigation: tune in Task 10; compare against Phaser client.
- **Asset pipeline:** 3D meshes/textures for tanks/terrain are new art work not covered by
  these engineering tasks. Mitigation: start with primitive geometry (boxes/cylinders),
  treat art as a follow-up plan.
- **Other games:** `demo`, `treasurequest` share the proto and `EntityProto`. Additive
  proto changes keep them compiling; verify their tests in Task 1/8.

## Open Questions

**Resolved (2026-07-02):**
1. ✅ **Gameplay model:** ground-bound tanks, no jump/flight; **straight-line bullets**
   (no gravity) for v1.
2. ✅ **Camera:** third-person follow-cam.
3. ✅ **Aim input:** keyboard only (rotation intent, server-accumulated) — no mouse-look.
5. ✅ **Art:** v1 primitives (boxes/cylinders); real models deferred to a follow-up plan.

**Still open:**
4. **Serve path during parity:** is `/games/tankarena-3d/` acceptable as the temporary
   second path, or do you want an env/flag toggle at the existing path instead?
   *(Non-blocking for Tasks 1–12; only matters at Task 13. Default: `/games/tankarena-3d/`.)*

## Reuse Notes (what survives untouched)

- `frontend/shared-ui` — WebSocket client, discovery, proto codec: **100% reused**.
- Lobby/match **state logic** (scores, phases, playerRegistry, matchUi color maps):
  ~90% reusable as framework-agnostic TS, just re-homed into React/GameBridge.
- Server room/session/Netty/dispatch layer (`server-runtime`), match phase machine,
  stats tracking: unchanged except where they touch 2D coordinates.
