# AGENTS.md — Canonical Context

> **This file is the single source of truth for how to work in this codebase.** It is
> **tool-agnostic**: every AI CLI (Claude Code, Gemini CLI, Codex, Cursor, Antigravity, …)
> should read *this* file so they all share the exact same context. Tool-specific files like
> `CLAUDE.md` are thin **pointers** that import this one — never duplicate rules into them;
> edit them here.

---

## How Each Tool Gets This Context

| Tool | Mode | File | Notes |
|---|---|---|---|
| **Claude Code** | pointer | `CLAUDE.md` → `@AGENTS.md` | auto-loaded by Claude Code |
| **Gemini CLI** | pointer | `GEMINI.md` → `@AGENTS.md` | auto-loaded by Gemini |
| **OpenAI Codex CLI** | native | *(none)* | reads `AGENTS.md` itself |
| **GitHub Copilot CLI** | native | *(none)* | reads `AGENTS.md` itself |
| **Cursor** (`agent`) | native | *(none)* | reads `AGENTS.md` itself |
| **Google Antigravity** (`agy`) | native | *(none)* | reads `AGENTS.md` itself |

**Adding a future CLI:** check whether it reads `AGENTS.md` natively (→ nothing to do) or
wants its own memory file (→ add `<TOOL>.md` at root containing a one-line note +
`@AGENTS.md`). Pointer files stay **thin** — never duplicate rules into them.

---

## Product

LAN-first, web-based multiplayer tank game (Battle City style). One host runs a single JAR;
players on the same Wi-Fi open `http://<host-ip>:8080` — no client install.

Target: 4–16 players per room. **Authoritative server**: clients send input only; the host
runs the 60 TPS game loop and broadcasts protobuf snapshots.

---

## Maven Modules

```
triforge-gaming/
├── proto/envelope.proto              Shared wire schema (protobuf)
├── protocol/                         Generated Java from proto
├── engine/
│   ├── engine-ecs/                   ECS only — no protocol or game deps
│   ├── engine-api/                   GamePlugin SPI, Game, match/room/sync interfaces
│   ├── engine-match/                 Match phase machine + proto mapping
│   ├── engine-sync/                  Delta tracking implementation
│   └── engine-core/                  Game loop + snapshot assembly
├── server/
│   └── server-runtime/               Rooms, sessions, Netty transport, UDP discovery
├── launcher/
│   └── triforge-server/              Fat JAR entry point + static frontend bundle
├── games/
│   ├── tankarena/
│   │   ├── plugin/                   Maven artifact: tankarena-game
│   │   └── frontend/                 React + Three.js (Vite) — 3D client
│   ├── treasurequest/
│   │   ├── plugin/                   Maven artifact: treasurequest-game
│   │   └── frontend/                 Game-specific frontend
│   └── demo/
│       └── plugin/                   Maven artifact: demo-game
└── frontend/                         Platform web shell + shared client library
    ├── shared-ui/                    @triforge/shared-ui — WebSocket client, discovery, proto
    └── launcher-web/                 React + Vite hub — catalog + live lobby status (served at /)
```

Tank Arena is a React + Three.js 3D client served at `/games/tankarena/` (plan-004
migrated it from Phaser 2D to Three.js 3D; the authoritative server is fully 3D with
terrain elevation). Launcher home is `/`. The wire proto still carries the legacy 2D
`Direction`/`x,y` fields alongside the 3D `z`/orientation fields.

Build order: `protocol → engine-ecs → engine-api → engine-match → engine-sync → engine-core → tankarena-game → demo-game → server-runtime → triforge-server`

---

## Commands

From repository root:

```bash
mvn clean test                                              # all modules; skips frontend build
mvn clean package -pl launcher/triforge-server -am          # builds frontend + fat JAR
java -jar launcher/triforge-server/target/triforge-server-1.0.0-SNAPSHOT.jar
```

Skip frontend during package (e.g. offline backend-only build):

```bash
mvn package -pl launcher/triforge-server -am -Dskip.frontend=true
```

Single module test:

```bash
mvn test -pl games/tankarena/plugin
mvn test -pl engine/engine-ecs
mvn test -pl engine/engine-api
mvn test -pl engine/engine-match
mvn test -pl server/server-runtime -Dtest=LobbyJoinTest
```

Frontend shared library (inside `frontend/shared-ui/`):

```bash
cd frontend/shared-ui
npm install
npm run proto    # generates TS from ../../proto/envelope.proto
```

Tank Arena client — React + Three.js (inside `games/tankarena/frontend/`):

```bash
cd games/tankarena/frontend
npm install
npm run build    # React + Three.js; depends on @triforge/shared-ui via file: link (dev port 3002)
```

Launcher web (inside `frontend/launcher-web/`):

```bash
cd frontend/launcher-web
npm install
npm run build
npm test         # vitest
```

Regenerate TS proto after editing `proto/envelope.proto`: `npm run proto` in `frontend/shared-ui`.

---

## Architecture Layers

| Layer | Module / package | Responsibility |
|-------|------------------|----------------|
| Launcher | `triforge-server` … `com.triforge.launcher` | `main()`, fat JAR, bundles plugins + static frontend |
| Application | `server-runtime` … `com.triforge.server.*` | Room shell, sessions, Netty, UDP discovery |
| Infrastructure | `protocol`, transport codec | Protobuf envelope, WebSocket framing |
| Engine ECS | `engine-ecs` … `com.triforge.engine.ecs` | Entity, Component, System — zero game knowledge |
| Engine API | `engine-api` … `com.triforge.engine.game`, `match`, `room`, `sync` | GamePlugin SPI, Game, match/room callbacks |
| Engine match | `engine-match` … `com.triforge.engine.match` | MatchPhaseMachine, proto mapping |
| Engine sync | `engine-sync` … `com.triforge.engine.sync` | StandardDeltaService, PassThroughInterestFilter |
| Engine runtime | `engine-core` … `com.triforge.engine.loop`, `snapshot` | GameLoop, SnapshotService |
| Game | `tankarena-game` … `com.triforge.games.tankarena.*` | Tank rules, map, components, systems, match lobby |

---

## Plugin Discovery

Game plugins register via Java `ServiceLoader`:

```
META-INF/services/com.triforge.engine.game.GamePlugin
→ com.triforge.games.tankarena.TankArenaPlugin
→ com.triforge.games.demo.DemoPlugin   (scaffold)
```

Create a new game: copy `games/demo/plugin/`, implement `Game` + `GamePlugin`, register in `META-INF/services`.
Add the module under `games/<name>/plugin/` in the parent `pom.xml` and as a dependency of `server-runtime` and `triforge-server`.

`GameRoom` loads the default plugin with `GamePlugins.defaultPlugin()` (id: `tankarena`).
Create a room with another plugin: `registry.ensureRoom("lab", "Lab", "demo")`.

Host default plugin: `-Dtriforge.game.pluginId=tankarena` or env `TRIFORGE_GAME_PLUGINID`.
Legacy alias still supported: `tankarena.game.pluginId` / `TANKARENA_GAME_PLUGINID`.

HTTP: `GET /api/lobby/plugins` lists registered plugins; room list includes `gamePluginId` per room.

`GameRoom` (application layer) has **no imports from `games.tankarena`** — tank-specific test
helpers live in `TankArenaRoomSupport` under integration tests.

---

## Key Constraints

- **Clients are dumb** — no authoritative position or hit detection on the frontend.
- **Rooms are isolated** — each room owns its game loop, ECS world, and plugin instance.
- **Engine stays generic** — no `Team`, `GameMap`, or tank types in `engine-core` / `engine-ecs`.

---

## Stack

| Concern | Choice |
|---------|--------|
| Frontend | Tank Arena: React + Three.js, Vite (TypeScript) · Launcher: React + Vite |
| Backend | Java 21, Netty, Maven multi-module |
| Wire format | Protobuf (`proto/envelope.proto`, package `com.triforge.protocol.proto`) |
| Game loop | 60 TPS (`engine.loop.GameLoop`) |
| Maps | JSON tiles in `games/tankarena/plugin/src/main/resources/maps/` |

---

## Maps

Tile-based JSON: `{ "width", "height", "tiles": [...] }`. Types include Water, Tree,
Brick, Steel. Loaded via `MapLoader` on the plugin classpath.

---

## Working Guidelines

- Keep diffs minimal; run `mvn test` after refactors.
- Fat JAR shading merges `META-INF/services` for plugin discovery.
- **Context lives in `AGENTS.md`.** If a rule or workflow changes, edit *this* file, not
  `CLAUDE.md` or `GEMINI.md` (which only import this one). Keep every tool's context identical.
