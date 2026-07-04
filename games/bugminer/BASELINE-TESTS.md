# Baseline Tests — Gaming / Bug Miner Plugin

Branch: `fix/bugminer-production`

## Frontend tests (`games/bugminer/frontend`)

```bash
cd games/bugminer/frontend
npm install
npm test
```

**Current:** 90 vitest tests across 16 files (all pass locally).

### Mode-flow regression suite

| File | Coverage |
|------|----------|
| `src/shared/gamePhase.test.ts` | Phase resolver: Free / Fair / Battle + stale winner |
| `src/shared/boardStateSync.test.ts` | Active winner resolution during battle |
| `src/shared/matchPhaseRouting.test.ts` | Lobby interrupt guard + PLAYING merge |
| `src/store/gameStore.test.ts` | Screen routing per mode (setup vs game vs result) |
| `src/shared/fairMode.test.ts` | `getRoomSetupMode` → free / fair / battle |

## Java plugin tests (`games/bugminer/plugin`)

```bash
mvn test -pl games/bugminer/plugin -am
```

Requires JDK 21 + Maven. Dev machine may not have Maven — run via CI or Docker build.

### Mode-flow regression suite

| File | Coverage |
|------|----------|
| `BugMinerGameTest` — `LobbyLifecycle` | Host start, 1-player block, scoreboard → lobby |
| `BugMinerGameTest` — `FreeModeFlow` | dual_setup, lock, levels, countdown, restart |
| `BugMinerGameTest` — `FairModeFlow` | configure, skip setup, identical maps, block manual |
| `BugMinerGameTest` — `BattleModeFlow` | arena start, block setup, rematch stale-winner |
| `BugMinerBoardTest` | Free/fair/battle board init, reset, stale winner |
| `BattleArenaTest` | Shared arena hooks and tick |

Test infra: `BugMinerRoomHost` captures board broadcasts; `BugMinerTestFixtures` provides join/start/tick helpers.

## Regression gate

1. `npm test` in `games/bugminer/frontend` — **90 pass**
2. `mvn test -pl games/bugminer/plugin -am` when Maven available
3. Manual smoke: lobby → configure mode → host Start → play → result → lobby

## Reference

Standalone source of truth: `D:\TRANGDTH\Game\server\src\game\GameRoom.test.ts` — ported to Java `BugMinerGameTest` nested classes.
