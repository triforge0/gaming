# Baseline Tests — Gaming / Bug Miner Plugin

Branch: `feature/bugminer-sync` · Gaming tag: `v0-gaming-bugminer-before-sync`

## Standalone baseline (source of truth)

Project gốc: `D:\TRANGDTH\Game` — **114 vitest tests** tại tag `v1-standalone-pre-migration`.

## Frontend shared tests (trong plugin)

```bash
cd games/bugminer/frontend
npm install
npm test
```

Chạy các file `src/shared/*.test.ts` đã sync từ standalone.

## Java plugin tests (cần Maven + JDK 21)

```bash
mvn test -pl games/bugminer/plugin -am
```

Máy dev hiện **chưa cài Maven** — build qua Docker hoặc CI:

```bash
docker compose up --build -d
# → http://localhost:8080/games/bugminer/
```

## Thay đổi đã sync

- Frontend: Fair/Battle screens, shared logic + tests
- Proto: `BMConfigureFairModeCommand`, `BugMinerFairModeConfig`, `BugMinerBattleState`
- Java: `FairModeConfig`, fair/battle mode, `BattleArena`

## Regression gate

1. `npm test` trong `D:\TRANGDTH\Game` (114 pass)
2. `npm test` trong `games/bugminer/frontend` (shared tests)
3. `mvn test -pl games/bugminer/plugin` khi có Maven
