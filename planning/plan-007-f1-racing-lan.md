# Implementation Plan — F1 Racing 3D (LAN Listen-Server)

> **Plan id:** `007` · **Game module:** `games/f1racing` · **Plugin id:** `f1racing`
> **Served at:** `/games/f1racing/` · **Model:** authoritative host (Triforge JAR), no central
> online services.

## Overview

Build a new **GamePlugin** for a **3D Formula-style racing game** that runs entirely on the
existing Triforge **LAN listen-server** model: one host runs `triforge-server`; players on
the same network open the browser client — no install, no accounts, no matchmaking cloud.

The host machine is the **authoritative server** for physics, collisions, checkpoints, lap
counting, and race results. Clients send **vehicle input only** and render **ECS snapshots**
plus game-specific `F1Message` broadcasts (race state, standings, lobby config).

### Vision vs this plan

The user's full F1 Online design (global ranking, battle pass, tournaments, voice chat,
anti-cheat cloud, asset streaming) is **explicitly out of scope**. This plan delivers the
**offline/LAN-complete** slice:

| In scope (MVP-0 → MVP-1) | Deferred (future plans) |
|---|---|
| Main menu: Single Player stub, Create/Join Room, Garage, Settings | Shop, Battle Pass, Premium currency |
| Host room config (map, laps, bots, max players, quali toggle, weather/time) | Global/season leaderboard |
| Join via room code, link, LAN discovery, IP | Friends, guilds, tournaments |
| Lobby (players, ping, car, ready, host kick/start) | Voice chat |
| **Qualifying → Race** session (grid by best lap) | Practice-only lobby sessions |
| Car–car collision (push + temporary control loss) | Full damage model |
| Arcade race on 1–2 seed tracks | All 6 biomes × many tracks |
| Primitive 3D cars + track (Three.js) | PBR art pass, RT reflections |
| HUD (lap, position, speed, gear, minimap, nitro) | Full simulation physics |
| Results screen + local XP-less stats | Persistent cloud profile |
| Local garage (localStorage) | Cross-device sync |
| Host-side replay file + basic playback | Shareable replay links |
| Bot drivers (simple) | Advanced racing AI |

### MVP-0 definition of done

Two browser tabs on the same LAN can: **host creates a room (default max 10 players) → share
code → guest joins → both pick a car in lobby → host starts → qualifying (best lap sets grid)
→ countdown → race 3 laps → finish with standings**. Car–car contact pushes and briefly unsettles
handling. Module tests green; fat JAR bundles the frontend.

### Decisions locked with the user (2026-07-04)

| # | Decision |
|---|---|
| 1 | **Max players:** host configures in room settings; **default = 10** (hard cap TBD, suggest 20 ceiling in validator). |
| 2 | **Cars:** **cosmetic only** — no performance stat tables in MVP. |
| 3 | **Qualifying:** **in scope** — Qualifying session → grid by best lap → Race session. |
| 4 | **Car–car collision:** **push + lose control** (impulse + temporary grip/yaw penalty); not ghost mode. |
| 5 | **Host disconnect:** **end the race/match immediately** for all players (no host migration). |

### Platform fit

Triforge already provides everything the offline architecture needs:

- **Listen server:** `launcher/triforge-server` + `GameRoom` 60 TPS loop
- **LAN discovery:** `DiscoveryService` + `/api/lobby/rooms`
- **Room creation:** client generates `f1racing:<trackId>:<CODE>`, WebSocket join triggers
  `RoomRegistry.getOrCreate` (same pattern as Bug Miner)
- **Match phases:** `MatchPhaseMachine` (`LOBBY` → `COUNTDOWN` → `PLAYING` → `ENDED`)
- **3D wire primitives:** `PositionComponentProto{x,y,z}`, `OrientationComponentProto{yaw,pitch}`
- **3D client stack:** React + Three.js (Tank Arena frontend pattern)
- **Room chat:** plan-002 infra (text chat in lobby/race)

We **do not** fork a separate executable host — the JAR **is** the host.

---

## Architecture Decisions

### AD-1 — New plugin; do not extend Tank Arena

Tank Arena is grid-tile combat with turret aim. F1 needs **spline/track-bound vehicle
dynamics**, lap checkpoints, and quali/race phases. Create `games/f1racing/plugin`
(scaffold from `games/demo/plugin` for minimal surface, borrow **3D ECS patterns** from
Tank Arena — `PositionComponent`, `OrientationComponent`, snapshot writer — not combat
systems).

Register via `ServiceLoader`, wire into parent `pom.xml`, `server-runtime`,
`triforge-server`. Seed a default room in `TriforgeServer` (optional lobby entry); dynamic
rooms use the `f1racing:<trackId>:<code>` id prefix parsed by `RoomRegistry`.

### AD-2 — Contract-first: `F1Message` + `VehicleComponentProto`

**Do not** overload `InputCommand` bools for analog steering/throttle. Racing input rides
the game-owned proto arm (consistent with `TreasureQuestMessage`, `BugMinerMessage`).

Add `GameMessage.f1 = 18` (next free field number after `bugminer = 17`). Regenerate Java
(`protocol`) and TS (`npm run proto` in `frontend/shared-ui`) in the **same task** that
lands proto changes.

Spatial state (car transform, speed) rides **`EntityProto`** via a new
`VehicleComponentProto`. Non-spatial race state (standings, sector times, room config)
rides **`F1Message`**.

### AD-3 — Hybrid state: spatial in ECS, race logic in services

Mirrors TreasureQuest / Tank Arena:

- **ECS (delta-sync each tick):** car entity position, orientation (yaw), `VehicleComponent`
  (speed, gear, rpm, nitro level, current lap, race position).
- **Plain-Java services (event + periodic broadcast):** `LapTimer`, `CheckpointDetector`,
  `RaceStandings`, `RoomConfig`, `ReplayRecorder`. Broadcast via `F1Message` when lap
  times, positions, or config change; not every tick.

`InterestFilter`: **PassThrough** for MVP (whole track visible to all racers).

### AD-4 — Authoritative arcade physics at 60 TPS

**MVP physics tier:** `Arcade` only (user's Semi-Arcade / Simulation are future config
flags that swap a `PhysicsProfile` — design the interface now, implement arcade first).

Arcade model (server-side, deterministic given inputs + seed):

- State per car: `(x, y, z, yaw, speed, lateralGrip, nitroRemaining, controlLossTicks)`.
- Each tick: apply throttle/brake/steer/handbrake/nitro from last received `F1VehicleInput`.
- **Track constraint:** project position onto track centerline spline; reject or slow when
  outside track `width`; soft wall pushback at track edge (independent of car–car setting).
- **Car–car collision (locked):** when `F1CollisionMode = ON` and car hulls overlap, apply
  **separation impulse** (push apart along contact normal) and a **control-loss window**
  (~0.5–1.5 s): reduced `lateralGrip`, added yaw perturbation — simulates “mất lái”. When
  `F1_COLLISION_OFF`, cars **ghost through** each other (track walls still apply).
- No client-side prediction authority; client may interpolate/extrapolate visually only.

Damage (**None** / **Visual** / **Full**) is a room flag stored in config; MVP implements
**None** only (collision affects handling only, not mesh/perf), others deferred.

### AD-5 — Track content as JSON on classpath (+ optional host data dir)

Tracks load from `games/f1racing/plugin/src/main/resources/tracks/<id>.json`. Schema:

```json
{
  "id": "city-loop",
  "displayName": "City Loop",
  "biome": "city",
  "defaultLaps": 3,
  "lengthMeters": 3200,
  "trackWidth": 14,
  "centerline": [{"x": 0, "y": 0, "z": 0}, "..."],
  "checkpoints": [{"index": 0, "x": 0, "y": 0, "z": 0, "radius": 8}],
  "startGrid": [{"slot": 0, "x": 0, "y": 0, "z": 0, "yaw": 0}],
  "environment": {"weather": "sunny", "timeOfDay": "noon"}
}
```

Checkpoints are **ordered**; crossing checkpoint `N` then `N+1` (with start/finish at index
0) increments lap. `TrackCatalog` lists available tracks for lobby UI.

Optional host writable dir `-Df1racing.data.dir` mirrors TreasureQuest: custom tracks +
replays under `custom_tracks/` and `replays/` (MVP ships classpath tracks only; replay dir
used in Task 15).

### AD-6 — Room config owned by host player

`F1RoomConfig` lives in the game instance, mutable in **LOBBY** by host via `F1Message`.
Fields for MVP:

- `trackId`, `lapCount`, **`maxPlayers` (default 10, host-set)**, `botCount`, `password`
  (optional — enforced on join via `F1JoinRequest`), `collisionMode` (car–car on/off),
  `damageMode`, `weather`, `timeOfDay`, **`enableQualifying` (default true)**,
  **`qualifyingDurationSec` (default 180)**.

Join rejected when `playerCount >= maxPlayers`. Broadcast full config on change. Clients
render lobby from server state only.

Room identity:

- Full id: `f1racing:city-loop:LAZY-DEV-42`
- Short join code: `LAZY-DEV-42` (frontend resolves via `resolveF1RoomId`, like Bug Miner)
- Share link: `http://<host-ip>:8080/games/f1racing/?room=city-loop:LAZY-DEV-42`
- Deep link convention: `game://join/f1racing:city-loop:LAZY-DEV-42` (parsed by frontend)

QR code: client generates from share link (no server work).

### AD-7 — Garage is client-local only

Car, skin, paint, wheel, nitro VFX selection stored in **`localStorage`** (`f1racing:garage`
JSON). On lobby join, client sends `F1GarageLoadout` via `F1Message`; server stores per
player for broadcast to others (cosmetic replication). **No server persistence** for garage.
**All car ids share identical physics** — cosmetics affect rendering only (locked).

Settings (graphics/audio/controls) also `localStorage` (`f1racing:settings`); not synced.

### AD-8 — Replay on host disk

During `PLAYING`, append compact tick records `(tick, entityId, x,y,z,yaw,speed, inputs…)`
to an in-memory buffer; flush to `<f1racing.data.dir>/replays/<roomId>-<timestamp>.f1replay`
at race end. Playback is a **client-only** re-simulation render reading the file (Task 15) —
no upload, no replay service.

### AD-9 — Single-player modes reuse the same race runtime

Practice / Time Trial / Race vs Bots spawn a **single-player room** (`f1racing:sp:<uuid>`)
with `botCount` filled by server AI. No separate engine — only UI entry differs.

### AD-10 — Session flow: Qualifying → Race (locked)

Reuse engine `MatchPhaseMachine` for coarse gates; **session type** lives in `F1RaceState`:

| `MatchPhase` | `F1SessionPhase` | Behaviour |
|---|---|---|
| `LOBBY` | `LOBBY` | Car select, ready, host config (`maxPlayers` default 10), chat |
| `COUNTDOWN` | `QUALIFYING` or `RACE` | 3-2-1 before each timed session |
| `PLAYING` | `QUALIFYING` | Open session: best **single lap** per driver recorded; no race lap count; standings by best lap; ends when `qualifyingDurationSec` elapses **or** host skips |
| `COUNTDOWN` | `RACE` | Grid locked from quali results (best lap → pole); bots fill tail slots |
| `PLAYING` | `RACE` | Lap count from config; car–car collision active per room flag |
| `ENDED` | — | `F1RaceResult` (race standings; quali times in payload); replay flush |

If `enableQualifying = false`, host **Start** skips straight to race grid (lobby join order
or random). **Practice** single-player skips quali.

**Host disconnect (locked):** if the host player leaves during `QUALIFYING` or `RACE`,
immediately transition to `ENDED`, broadcast `F1RaceResult` with `abortedReason =
HOST_DISCONNECTED`, discard in-progress quali grid assignment.

### AD-11 — Max players default 10

`F1RoomConfig.maxPlayers` defaults to **10** on room create. Host may lower (min 2) or raise
up to **`F1Constants.MAX_PLAYERS` (20)** in UI validator. Server rejects joins at cap.
`botCount + humanCount` must not exceed `maxPlayers` at race start.

---

## Wire Contract (proto additions)

Add to `proto/envelope.proto`; field numbers are illustrative — use next available in file.

```proto
// ── F1 Racing (game-specific arm) ─────────────────────────────────

message F1Message {
  oneof content {
    // client → server (rate-limited, every tick or ~20 Hz)
    F1VehicleInput vehicleInput = 1;
    F1GarageLoadout garageLoadout = 2;
    F1JoinRequest joinRequest = 3;       // password gate (optional)

    // host-only, LOBBY phase
    F1SetRoomConfig setRoomConfig = 4;
    F1AddBot addBot = 5;
    F1KickPlayer kickPlayer = 6;
    F1StartRace startRace = 7;
    F1SkipQualifying skipQualifying = 14;   // host-only

    // server → client(s)
    F1RoomConfig roomConfig = 8;
    F1RaceState raceState = 9;
    F1LapEvent lapEvent = 10;
    F1SectorTime sectorTime = 11;
    F1RaceResult raceResult = 12;
    F1StandingUpdate standings = 13;
    F1QualifyingResult qualifyingResult = 15;
  }
}

message F1VehicleInput {
  float steer = 1;       // -1.0 .. 1.0
  float throttle = 2;    //  0.0 .. 1.0
  float brake = 3;       //  0.0 .. 1.0
  bool handbrake = 4;
  bool nitro = 5;
  bool resetCar = 6;       // teleports to track if stuck (rate-limited)
}

message F1GarageLoadout {
  string carId = 1;
  string liveryId = 2;
  string primaryColor = 3;
  string wheelId = 4;
  string nitroFxId = 5;
}

message F1JoinRequest {
  string password = 1;   // empty if room has no password
}

message F1SetRoomConfig {
  string trackId = 1;
  uint32 lapCount = 2;
  uint32 maxPlayers = 3;              // default 10
  uint32 botCount = 4;
  string password = 5;
  F1CollisionMode collision = 6;        // car–car push/ghost
  F1DamageMode damage = 7;
  F1Weather weather = 8;
  F1TimeOfDay timeOfDay = 9;
  bool enableQualifying = 10;           // default true
  uint32 qualifyingDurationSec = 11;  // default 180
}

enum F1SessionPhase { F1_SESSION_LOBBY = 0; F1_SESSION_QUALIFYING = 1; F1_SESSION_RACE = 2; }
enum F1AbortReason { F1_ABORT_NONE = 0; F1_ABORT_HOST_DISCONNECTED = 1; F1_ABORT_TIME_CAP = 2; }

enum F1CollisionMode { F1_COLLISION_ON = 0; F1_COLLISION_OFF = 1; }
enum F1DamageMode { F1_DAMAGE_NONE = 0; F1_DAMAGE_VISUAL = 1; F1_DAMAGE_FULL = 2; }
enum F1Weather { F1_WEATHER_SUNNY = 0; F1_WEATHER_RAIN = 1; F1_WEATHER_SNOW = 2; F1_WEATHER_FOG = 3; F1_WEATHER_RANDOM = 4; }
enum F1TimeOfDay { F1_TIME_MORNING = 0; F1_TIME_NOON = 1; F1_TIME_SUNSET = 2; F1_TIME_NIGHT = 3; }

message F1RoomConfig {
  string trackId = 1;
  string trackDisplayName = 2;
  uint32 lapCount = 3;
  uint32 maxPlayers = 4;                // default 10
  uint32 botCount = 5;
  bool passwordProtected = 6;
  F1CollisionMode collision = 7;
  F1DamageMode damage = 8;
  F1Weather weather = 9;
  F1TimeOfDay timeOfDay = 10;
  bool enableQualifying = 11;
  uint32 qualifyingDurationSec = 12;
}

message F1RaceState {
  uint32 lapCount = 1;
  uint64 raceElapsedMs = 2;
  bool raceStarted = 3;
  F1SessionPhase sessionPhase = 4;
  uint64 sessionRemainingMs = 5;        // quali countdown; 0 in race unless time-limit race added later
}

message F1LapEvent {
  uint64 playerId = 1;
  uint32 lapNumber = 2;
  uint64 lapTimeMs = 3;
  bool finished = 4;
}

message F1SectorTime {
  uint64 playerId = 1;
  uint32 sectorIndex = 2;
  uint64 sectorTimeMs = 3;
}

message F1StandingEntry {
  uint64 playerId = 1;
  string displayName = 2;
  uint32 position = 3;
  uint32 lap = 4;
  uint64 lastLapMs = 5;
  uint64 bestLapMs = 6;
  uint64 totalTimeMs = 7;
  bool finished = 8;
  bool isBot = 9;
}

message F1StandingUpdate {
  repeated F1StandingEntry entries = 1;
}

message F1RaceResult {
  repeated F1StandingEntry finalStandings = 1;
  uint64 raceDurationMs = 2;
  string replayFileName = 3;
  F1AbortReason abortReason = 4;
  repeated F1QualifyingEntry qualifyingGrid = 5;  // pole → tail, used for results screen
}

message F1QualifyingEntry {
  uint64 playerId = 1;
  string displayName = 2;
  uint32 gridSlot = 3;
  uint64 bestLapMs = 4;
  bool isBot = 5;
}

message F1QualifyingResult {
  repeated F1QualifyingEntry entries = 1;  // broadcast when quali ends, before race countdown
}

message VehicleComponentProto {
  float speed = 1;
  float rpm = 2;
  int32 gear = 3;
  float nitro = 4;           // 0..1 remaining
  uint32 currentLap = 5;
  uint32 racePosition = 6;
  string carId = 7;          // cosmetic id for client model swap
  string primaryColor = 8;
}
```

Add to `GameMessage` oneof: `F1Message f1 = 18;`

Add to `EntityProto`: `VehicleComponentProto vehicle = 9;`

**Routing:** extend `CommandDispatcher` to pass `GameMessage.f1` to
`GameRoom.handleGameMessage` (same seam as `oaq` / `bugminer`). No `instanceof` in
`GameRoom` beyond dispatch.

---

## Task List

Tasks ordered so **`mvn -pl games/f1racing/plugin test` stays green after each task** once
the module exists. Frontend tasks assume proto is locked from Task 1.

## Task 1: Lock wire contract (`F1Message` + `VehicleComponentProto`)

### Description

Add all F1 proto messages to `envelope.proto` (including `F1SessionPhase`, qualifying
config, `F1QualifyingResult`, `F1AbortReason`), regenerate Java and TS, and add a minimal
compile-only test that builds sample messages (no game logic yet).

### Acceptance Criteria

- [ ] `F1Message` and `VehicleComponentProto` compile in `protocol` and `shared-ui` proto output.
- [ ] `GameMessage.f1` field number documented in plan matches landed proto.
- [ ] `mvn -pl protocol test` and `npm run proto` in `frontend/shared-ui` succeed.

### Verification

- [ ] All tests pass
- [ ] Manual: inspect generated `F1Message` Java class exists
- [ ] System builds without regression

### Dependencies

None.

### Files

- `proto/envelope.proto`
- `protocol/` (generated)
- `frontend/shared-ui/src/net/proto.*` (generated)

### Scope

S

---

## Task 2: Plugin scaffold + reactor wiring

### Description

Create `games/f1racing/plugin` from demo scaffold: `F1RacingPlugin`, `F1RacingFactory`,
stub `F1RacingGame` implementing `Game`, `META-INF/services` registration, Maven module +
parent POM, dependencies on `server-runtime` and `triforge-server`. Register default room
seed optional. Wire `CommandDispatcher` to route `f1` messages.

### Acceptance Criteria

- [ ] Plugin appears in `GET /api/lobby/plugins` as `f1racing`.
- [ ] Joining room `f1racing:test:ROOM1` creates a room and returns `JoinResponse`.
- [ ] `mvn -pl games/f1racing/plugin test` passes (smoke test).

### Verification

- [ ] All tests pass
- [ ] Manual: start JAR, hit plugins API, WebSocket join stub room
- [ ] System builds without regression

### Dependencies

Task 1.

### Files

- `games/f1racing/plugin/**`
- `pom.xml`, `server/server-runtime/pom.xml`, `launcher/triforge-server/pom.xml`
- `launcher/triforge-server/.../TriforgeServer.java`
- `server/.../CommandDispatcher.java`

### Scope

S

---

## Task 3: Track catalog + JSON schema + seed track

### Description

Implement `TrackDefinition`, `TrackCatalog`, `TrackLoader` loading `city-loop.json` from
classpath. Unit-test checkpoint order, start grid slots, centerline length sanity.

### Acceptance Criteria

- [ ] `city-loop` track loads with ≥ 8 checkpoints and ≥ 8 grid slots.
- [ ] Invalid track JSON fails fast with clear error in tests.
- [ ] Module tests green.

### Verification

- [ ] All tests pass
- [ ] Manual: log track name on game init in stub
- [ ] System builds without regression

### Dependencies

Task 2.

### Files

- `games/f1racing/plugin/src/main/resources/tracks/city-loop.json`
- `games/f1racing/plugin/src/main/java/.../track/**`
- `games/f1racing/plugin/src/test/.../TrackLoaderTest.java`

### Scope

S

---

## Checkpoint

- [ ] Build succeeds
- [ ] Tests pass
- [ ] Proto + plugin + track data load end-to-end
- [ ] No broken contracts

---

## Task 4: Arcade vehicle physics + car–car collision

### Description

Pure-Java `ArcadeVehiclePhysics` + `VehicleState`: integrate throttle/brake/steer/handbrake/
nitro per tick; project onto centerline; enforce track width. Add `CarCarCollisionResolver`:
hull overlap → separation impulse + `controlLossTicks` (grip/yaw penalty — “mất lái”).
Respect `F1CollisionMode` (OFF = skip car–car). Unit tests only.

### Acceptance Criteria

- [ ] Car accelerates, turns, and brakes deterministically in tests (fixed seed + inputs).
- [ ] Off-track position is corrected or speed penalized.
- [ ] Two overlapping cars with collision ON: pushed apart + control loss applied; OFF: pass through.
- [ ] `resetCar` teleports to nearest on-track point (logic tested).

### Verification

- [ ] All tests pass
- [ ] Manual: N/A (unit tests cover)
- [ ] System builds without regression

### Dependencies

Task 3.

### Files

- `games/f1racing/plugin/src/main/java/.../physics/**`
- `games/f1racing/plugin/src/test/.../ArcadeVehiclePhysicsTest.java`
- `games/f1racing/plugin/src/test/.../CarCarCollisionTest.java`

### Scope

M

---

## Task 5: Checkpoint, lap, and finish detection

### Description

Implement `CheckpointDetector` and `LapCounter`: ordered checkpoint crossing, lap increment,
race finish when `lapCount` complete; compute `F1StandingEntry` ordering (lap desc, then
distance to next checkpoint, then total time).

### Acceptance Criteria

- [ ] Completing checkpoint sequence `0→1→…→0` increments lap.
- [ ] Skipping a checkpoint does not count lap.
- [ ] Standings sort correctly in multi-car simulation test.

### Verification

- [ ] All tests pass
- [ ] Manual: N/A
- [ ] System builds without regression

### Dependencies

Task 3.

### Files

- `games/f1racing/plugin/src/main/java/.../race/**`
- `games/f1racing/plugin/src/test/.../LapCounterTest.java`

### Scope

S

---

## Task 6: ECS car entities + snapshot sync + vehicle input

### Description

Wire physics into ECS: `CarEntityFactory`, `VehicleComponent`, reuse engine
`PositionComponent`/`OrientationComponent`, `F1RacingSnapshotWriter` populating
`VehicleComponentProto`. Handle `F1VehicleInput` in `handleGameMessage`; apply latest input
each tick in `PLAYING`. `PassThroughInterestFilter`.

### Acceptance Criteria

- [ ] Two cars in a test room receive delta snapshots with moving positions when inputs sent.
- [ ] Speed/gear/rpm appear in `VehicleComponentProto`.
- [ ] Module + integration test green.

### Verification

- [ ] All tests pass
- [ ] Manual: connect test client, see entities in snapshot dump
- [ ] System builds without regression

### Dependencies

Tasks 4, 5.

### Files

- `games/f1racing/plugin/.../F1RacingGame.java`, `.../entities/**`, `.../sync/**`

### Scope

M

---

## Checkpoint

- [ ] Build succeeds
- [ ] Tests pass
- [ ] Server simulates cars on track with authoritative snapshots
- [ ] No broken contracts

---

## Task 7: Lobby, loadout, room config, host controls

### Description

Implement LOBBY-phase `F1Message` handling: guests send `F1GarageLoadout`; host sends
`F1SetRoomConfig` (**`maxPlayers` default 10**), `F1KickPlayer`, `F1AddBot`, `F1StartRace`.
Broadcast `F1RoomConfig` on change. Reject join when room at `maxPlayers`. Optional password
via `F1JoinRequest`. Reuse `LobbyCommand` ready; host-gated start.

### Acceptance Criteria

- [ ] Host can set track, lap count, max players (default 10); all clients receive `F1RoomConfig`.
- [ ] Join rejected when `playerCount >= maxPlayers`.
- [ ] Non-host `F1SetRoomConfig` rejected.
- [ ] Ready + host start transitions toward qualifying or race (Task 8).

### Verification

- [ ] All tests pass
- [ ] Manual: two-player lobby test; third join rejected when max=2
- [ ] System builds without regression

### Dependencies

Task 6.

### Files

- `games/f1racing/plugin/.../F1RacingGame.java`, `.../lobby/**`

### Scope

M

---

## Task 8: Session flow — qualifying, grid, race, host abort

### Description

Integrate `MatchPhaseMachine` with `F1SessionPhase`:

1. **Qualifying** (if `enableQualifying`): countdown → PLAYING/QUALIFYING; record each
   driver's best single lap; timer from `qualifyingDurationSec`; host `F1SkipQualifying`
   ends early; broadcast `F1QualifyingResult`.
2. **Grid assignment:** sort by best lap → `startGrid` slots; bots fill remaining slots.
3. **Race:** countdown → PLAYING/RACE; lap counting; car–car collision per config.
4. **End:** all finished or leader done → `F1RaceResult` with race + quali grid data.
5. **Host disconnect:** on host `handleLeaveRequest` during quali/race → `ENDED` +
   `abortReason = HOST_DISCONNECTED`.

### Acceptance Criteria

- [ ] Full flow LOBBY → QUALIFYING → grid → RACE → ENDED in integration test.
- [ ] Qualifying disabled skips straight to race grid.
- [ ] `F1QualifyingResult` sent before race countdown; pole sitter on grid slot 0.
- [ ] Host leave mid-race aborts match for all clients.

### Verification

- [ ] All tests pass
- [ ] Manual: two-player quali + race; host tab close ends guest session
- [ ] System builds without regression

### Dependencies

Task 7.

### Files

- `games/f1racing/plugin/.../F1RacingGame.java`, `.../match/**`

### Scope

M

---

## Task 9: Frontend shell — main menu, create/join, discovery

### Description

Scaffold `games/f1racing/frontend` (React + Vite + Three.js deps, `@triforge/shared-ui`).
Screens: **Main Menu** (Single Player disabled stub, Create Room, Join Room, Garage, Settings,
Exit-to-home link). Create room generates code + shows share link/QR. Join resolves short
code, LAN room list from `/api/lobby/rooms`, manual IP/port from discovery hosts API.
Implement `resolveF1RoomId` + `formatJoinCode`.

### Acceptance Criteria

- [ ] Create room connects host to new `f1racing:<track>:<code>`.
- [ ] Join via code or LAN list reaches lobby WebSocket.
- [ ] `npm run build` succeeds.

### Verification

- [ ] All tests pass (add vitest for `roomIds.ts` if needed)
- [ ] Manual: two tabs create + join on dev server
- [ ] System builds without regression

### Dependencies

Tasks 1–2.

### Files

- `games/f1racing/frontend/**`
- `launcher/triforge-server` static bundle config (mirror other games)

### Scope

M

---

## Checkpoint

- [ ] Build succeeds
- [ ] Tests pass
- [ ] Create/join + lobby config works server-side; frontend reaches lobby
- [ ] No broken contracts

---

## Task 10: Frontend 3D race scene

### Description

Three.js scene: extrude/render track from centerline + width (primitive mesh MVP), car boxes
with loadout color, interpolation from snapshots, third-person follow camera + cockpit toggle
stub. Separate rAF loop from React state (Tank Arena pattern).

### Acceptance Criteria

- [ ] Host + guest see both cars moving smoothly from server snapshots.
- [ ] Camera follows local player car.
- [ ] 60 FPS render on typical laptop (no per-frame React setState).

### Verification

- [ ] All tests pass
- [ ] Manual: two-tab race visual sync
- [ ] System builds without regression

### Dependencies

Tasks 6, 9.

### Files

- `games/f1racing/frontend/src/render/**`, `src/net/**`

### Scope

M

---

## Task 11: Frontend lobby + HUD + results

### Description

Lobby UI: player list, ping, selected car, ready toggle, host config panel (**max players
default 10**, quali toggle + duration, collision on/off), start button.
Race HUD: session label (Qualifying / Race), quali timer + best lap OR race lap/position/speed/
gear/nitro/minimap. Results screen from `F1RaceResult` (grid + race standings, abort banner).
Input controller maps keys/gamepad to `F1VehicleInput`.

### Acceptance Criteria

- [ ] Full loop: lobby → qualifying → race HUD → results in two browsers.
- [ ] Qualifying UI shows session timer and personal best lap.
- [ ] Host disconnect shows abort reason on guest results screen.

### Verification

- [ ] All tests pass
- [ ] Manual: complete quali + 3-lap race two-tab; test host disconnect
- [ ] System builds without regression

### Dependencies

Tasks 8, 10.

### Files

- `games/f1racing/frontend/src/screens/**`, `src/ui/**`, `src/input/**`

### Scope

M

---

## Task 12: Local garage + settings persistence

### Description

Garage screen reads/writes `localStorage` (`f1racing:garage`, `f1racing:settings`). Catalog
of 4 car presets (Formula Classic/Modern/EV/Prototype) — **cosmetic ids only, identical
physics** (locked). Send loadout on lobby enter. Settings: graphics quality preset, volume,
key bindings (stored client-side).

### Acceptance Criteria

- [ ] Garage selection persists across browser refresh.
- [ ] Other players see primary color + car id in lobby/race.

### Verification

- [ ] All tests pass
- [ ] Manual: change livery, rejoin, appearance preserved
- [ ] System builds without regression

### Dependencies

Task 9.

### Files

- `games/f1racing/frontend/src/garage/**`, `src/settings/**`

### Scope

S

---

## Checkpoint

- [ ] Build succeeds
- [ ] Tests pass
- [ ] **MVP-0:** playable LAN quali + race end-to-end with HUD, garage cosmetics, results
- [ ] No broken contracts

---

## Task 13: Bot drivers

### Description

Server-side `BotDriverAI`: follow centerline with noise, throttle/brake into corners, obey
track limits. Spawn bot entities on `F1AddBot` or auto-fill from `botCount` at race start.
Bots count toward standings and finish the race.

### Acceptance Criteria

- [ ] Room with `botCount=3` races without human opponents finishing last by default.
- [ ] Bots appear in `F1StandingUpdate` with `isBot=true`.

### Verification

- [ ] All tests pass
- [ ] Manual: single human + 3 bots complete race
- [ ] System builds without regression

### Dependencies

Task 8.

### Files

- `games/f1racing/plugin/.../ai/BotDriverAI.java`

### Scope

M

---

## Task 14: Single-player entry modes

### Description

Enable Main Menu **Single Player** flows: Practice (no AI, no timer), Time Trial (solo lap
time), Race vs Bots — each creates a solo room and auto-starts. Reuse same race runtime.

### Acceptance Criteria

- [ ] Three single-player modes reachable from menu and completable.
- [ ] No WebSocket errors when only one human connected.

### Verification

- [ ] All tests pass
- [ ] Manual: each mode one-tab smoke test
- [ ] System builds without regression

### Dependencies

Tasks 11, 13.

### Files

- `games/f1racing/frontend/src/screens/SinglePlayerScreen.tsx`
- `games/f1racing/plugin/.../F1RacingGame.java` (solo room defaults)

### Scope

S

---

## Task 15: Replay record + playback

### Description

Host records tick snapshots during `PLAYING`; writes `.f1replay` JSON to
`f1racing.data.dir/replays/`. Main menu **Replay** lists local files (host machine only via
API stub or frontend local index — MVP: file picker / fixed list from last race metadata in
`F1RaceResult.replayFileName`). Playback scene reuses render loop with recorded states; camera
modes (follow, free orbit) + slow motion.

### Acceptance Criteria

- [x] Finished race produces replay file on host.
- [x] Client can play back last race with pause/slow-mo.

### Verification

- [x] All tests pass
- [ ] Manual: record + replay same session
- [x] System builds without regression

### Dependencies

Task 11.

### Files

- `games/f1racing/plugin/.../replay/**`
- `games/f1racing/frontend/src/replay/**`

### Scope

M

---

## Task 16: Second seed track + launcher catalog + docs

### Description

Add `forest-lake.json` track (forest biome). Register game in `frontend/launcher-web` catalog.
Update `AGENTS.md` with F1 module build commands and LAN-first description. Full reactor
green + fat JAR packages frontend.

### Acceptance Criteria

- [x] Host can select `forest-lake` in lobby; race completes.
- [x] Launcher home links to `/games/f1racing/`.
- [ ] `mvn clean test` and `mvn clean package -pl launcher/triforge-server -am` succeed.

### Verification

- [x] All tests pass
- [ ] Manual: race on both tracks two-tab
- [ ] System builds without regression

### Dependencies

Tasks 1–15.

### Files

- `games/f1racing/plugin/src/main/resources/tracks/forest-lake.json`
- `frontend/launcher-web/src/catalog/**`
- `AGENTS.md`

### Scope

S

---

## Checkpoints

### Checkpoint A — after Tasks 1–3

- [ ] Proto locked, plugin loads, seed track parses.

### Checkpoint B — after Tasks 4–6

- [ ] Authoritative car simulation + lap logic + snapshots in tests.

### Checkpoint C — after Tasks 7–9

- [ ] Lobby + match flow server-complete; frontend create/join works.

### Checkpoint D — after Tasks 10–12 (MVP-0)

- [ ] Full LAN multiplayer **qualifying + race** with HUD, garage cosmetics, results.

### Checkpoint E — after Tasks 13–16 (MVP-1)

- [x] Bots, single-player, replay, second track, docs — plan complete.

---

## Risks

| Risk | Mitigation |
|---|---|
| **Arcade physics feel** at 60 TPS may feel floaty or snappy | Tune constants per track; expose `PhysicsProfile` hook early; playtest early in Task 4 |
| **Track authoring cost** — hand-written JSON centerlines are tedious | MVP: 2 tracks only; defer in-engine editor to future plan; optional glTF path import later |
| **Bandwidth** — sending analog input every tick | Rate-limit input to 20 Hz; server holds last input until next |
| **Client interpolation** on jittery LAN | Snapshot buffer + interpolation delay 100–150 ms (Tank Arena pattern) |
| **Three.js track mesh** from polyline may look crude | Accept primitives for MVP; biome art pass is future work |
| **Password rooms** without auth identity | Plain string compare on join; host rotates password by recreating config — document as LAN trust model |
| **Replay file size** on long races | Record at 20 Hz + delta compression in Task 15 if files exceed ~5 MB |
| **Car–car collision tuning** — push may feel unfair on LAN latency | Impulse caps + control-loss decay; visual scrape FX only on client |
| **Qualifying with bots** — bots need hot-lap times for grid | Bots submit synthetic best laps (noise around baseline) before race grid |
| **Scope creep** from full F1 spec (weather VFX, damage, 6 biomes) | Weather/timeOfDay are **config + lighting presets** only in MVP — no grip change until a future plan |

---

## Open Questions

1. **Mobile browsers:** support touch controls in MVP or desktop-first?
2. **Plugin display name:** "F1 Racing" vs trademark-safe "Formula Racing LAN"?
3. **Max players ceiling:** default **10** locked — allow host up to **16** (Triforge room default) or **20**?

---

## Future Work (separate plans — do not expand MVP tasks)

- **Biomes:** desert, snow, volcano, space tracks + environment VFX packs
- **Weather physics:** rain grip, snow ice, fog visibility
- **Damage model:** visual mesh swap + performance penalty
- **Semi-Arcade / Simulation** physics profiles
- **Track editor** + `custom_tracks/` import
- **Spectator mode** (read-only snapshot subscriber)
- **Achievements** (local only, no cloud)
- **Cinematic intro / finish cameras** polish pass
- **Mod support** (local skin packs)
- **Optional online services plan** if product pivots back to central server (auth, global ladder) — would be a **new platform**, not an extension of this LAN plugin

---

## Parallel Execution Notes

| Safe in parallel | Must stay sequential |
|---|---|
| Task 3 track JSON authoring while Task 2 scaffold proceeds | Task 6 after Task 4–5 |
| Task 9 frontend shell after Task 1 proto (mock lobby) | Task 10 after Task 6 snapshots |
| Task 12 garage UI while Task 10–11 in progress | Task 8 before Task 11 HUD race flow |
| Task 16 launcher catalog anytime after Task 9 | Replay (15) after race flow stable |

---

## Definition of Done (plan)

Plan is complete when Tasks 1–16 are done, Checkpoint E passes, and this document moves to
`planning/archive/plan-007-f1-racing-lan.md`.
