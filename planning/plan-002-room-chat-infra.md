# Implementation Plan — Room Chat Box Infrastructure

## Overview

Add a **platform-level, room-wide text chat** to Triforge. Every player in a room can
send a short text message; the server broadcasts it to **all** connected players in that
room. Chat works in **both** the lobby phase and during an in-progress match. Chat is
**generic** — it is not tied to any game plugin (Tank Arena / TreasureQuest) and rides the
shared `GameMessage` envelope, exactly like lobby/match messages.

Scope decisions (locked with the user):
- **Scope:** room-wide "all-chat" only. No team-only channel in this iteration.
- **Phase:** available in both LOBBY and PLAYING phases.
- **System announcements:** yes — join/leave and match-start lines are emitted as
  `ChatMessage` with `senderPlayerId = 0`.
- **Frontends:** mount in **both** Tank Arena and TreasureQuest.
- **Limits:** ≤ 5 msg / 2 s per player; text capped at 200 chars (truncate, don't drop).

This plan is **infrastructure-first**: it delivers the end-to-end pipe (proto → server →
client API → minimal UI) as a working vertical slice. Rich UI polish is out of scope.

## Architecture Decisions

### Contract (protobuf) — lock first
Two new messages added to `proto/envelope.proto`, wired into the top-level `GameMessage`
oneof (the shared platform envelope, **not** `TreasureQuestMessage`):

```protobuf
// client → server: a chat message the player wants to send
message ChatCommand {
  string text = 1;            // raw player input; server trims + length-caps
}

// server → all clients in room: an authoritative, stamped chat line
message ChatMessage {
  uint64 senderPlayerId = 1;  // 0 = system/server message
  string senderName = 2;      // resolved server-side (NOT taken from client)
  string text = 3;            // sanitized text
  uint64 tick = 4;            // server tick when broadcast (for ordering/display)
}
```

`GameMessage.oneof content` gains:
```
ChatCommand chatCommand = 13;
ChatMessage chatMessage = 14;
```
(Field numbers 13/14 are the next free tags after `tq = 12`.)

### State ownership & authority rules
- **Sender identity is authoritative and server-stamped.** The client sends only `text`.
  The server resolves `senderPlayerId` from the channel attribute (`PLAYER_ID_KEY`) and
  `senderName` from the session layer. Client-supplied names are never trusted.
- **Display name source:** `RoomSessionManager` gains a `playerId → displayName` map,
  populated at join time and updated when a player runs `SetNameAction`. This keeps chat
  independent of any game plugin (no coupling to lobby snapshot internals). Fallback name
  `"Player <id>"` if unknown.
- **Sanitization is server-side.** Trim, reject blank, cap length (e.g. 200 chars,
  truncate rather than drop), and enforce a simple per-player rate limit (e.g. ≤ 5 msg /
  2 s) — dropped silently. Clients are dumb; they never format authoritative content.
- **No history / persistence (impl), but the seam ships now.** Chat is fire-and-forget;
  late joiners do not see prior lines. `RoomChatService` calls a `ChatHistory` interface
  whose default is `NoOpChatHistory`, so swapping in `RingBufferHistory` later needs zero
  changes to the service. (Impl deferred — see Phase 2.)

### Component decomposition (server) — chat logic lives OUTSIDE GameRoom
`GameRoom` must not accrete per-interaction logic (chat, later emote/ping/reaction). It only
routes: `chatService.handle(playerId, text)`. Collaborators, all in `server-runtime`:

- **`RoomChatService`** — validates, sanitizes, resolves sender name, appends to
  `ChatHistory`, builds the `ChatMessage`, and broadcasts. Also exposes `announce(text)` for
  system lines (`senderPlayerId = 0`). Owns the collaborators below.
- **`ChatRateLimiter`** — `boolean allow(long playerId)`; sliding/token-bucket ≤ 5 / 2 s.
  Isolated so the algorithm can change without touching the service.
- **`ChatHistory`** (interface) + **`NoOpChatHistory`** (default impl) — `append`, `recent`.

### Broadcast surface — reuse the existing generic method, do NOT add per-type methods
`RoomBroadcastAccess` **already** exposes `void broadcast(GameMessage)`. `RoomChatService`
builds `GameMessage{chatMessage}` and calls that. **No `broadcastChat` / `broadcastNotice` /
`broadcastAnnouncement` added** — the interface stays flat as new interaction types arrive.

### Message flow (mirrors existing lobby-command path)
1. Client `GameClient.sendChat(text)` → `GameMessage{chatCommand}` over WS.
2. `CommandDispatcher` new `case CHATCOMMAND`: reads `PLAYER_ID_KEY`, `enqueueCommand`
   onto the room loop → `room.handleChatCommand(playerId, text)`.
3. `GameRoom.handleChatCommand` delegates straight to `chatService.handle(playerId, text)`.
4. `RoomChatService` rate-limits → sanitizes → resolves name → `history.append` → builds
   `GameMessage{chatMessage}` → `broadcaster.broadcast(msg)` (existing generic method).
5. Client `handleMessage` new branch `gameMessage.chatMessage` → fans out to all chat
   subscribers (see below).
6. `shared-ui` `ChatOverlay` component renders + provides an input box, consumed by each
   game frontend.

### Client subscription — additive, scoped to chat (not a full event-bus rewrite)
The `handlers.onX` single-slot object is swapped per active scene, which would drop chat on
scene transitions. Rather than converting every handler to an event bus (large, touches all
snapshot/lobby call-sites — out of scope), add a **chat-only** multi-listener seam:
`client.onChat(fn): () => void` returning an unsubscribe. `ChatOverlay` owns its own
subscription, independent of scene handler swaps. Existing handlers are left untouched; a
future plan can migrate them to the same pattern.

### Layering
- Proto/contract: `proto/envelope.proto` (+ regenerated Java in `protocol`, TS in `shared-ui`).
- Application/server layer only (no engine or plugin changes): `server-runtime`.
- **No new method on `RoomBroadcastAccess`** — chat rides the existing `broadcast(GameMessage)`.
  Chat logic (`RoomChatService`, `ChatRateLimiter`, `ChatHistory`) is `server-runtime` only.
  **No `games.*` imports** — the `GameRoom` no-plugin-coupling constraint is preserved.
- Client library + reusable UI: `frontend/shared-ui`. Game frontends only mount the widget.

### Patterns followed
- Same enqueue-onto-room-loop pattern as `INPUTCOMMAND` / `LOBBYCOMMAND` / `TQ`.
- Same `buildEnvelope` + `broadcastToAll` broadcast pattern (via existing `broadcast`).

---

## Task List

### Task 1: Define & lock the chat wire contract

#### Description
Add `ChatCommand` and `ChatMessage` to `proto/envelope.proto` and wire both into the
`GameMessage` oneof. Regenerate Java and TypeScript bindings.

#### Acceptance Criteria
- [ ] `ChatCommand{text}` and `ChatMessage{senderPlayerId, senderName, text, tick}` exist.
- [ ] `GameMessage.content` includes `chatCommand = 13` and `chatMessage = 14`.
- [ ] `mvn -pl protocol install` regenerates Java classes successfully.
- [ ] `npm run proto` in `frontend/shared-ui` regenerates `proto.js`/`proto.d.ts` with the
      new messages.

> **Contract-locking note:** only the **oneof tags 13/14** are permanent-on-the-wire and
> must not change later. Adding scalar fields *inside* `ChatMessage` afterwards (e.g.
> `messageId = 5`, `serverUnixMillis = 6`) is **non-breaking** in proto3 — that is why the
> Phase-2 fields are safely deferred without wire debt. `tick` stays for now as a coarse
> ordering hint; wall-clock display waits for `serverUnixMillis` (Phase 2).

#### Verification
- [ ] `mvn -pl protocol -am install` succeeds.
- [ ] Generated `EnvelopeProto`/`GameMessage` expose the two new content cases.
- [ ] TS types `IChatCommand` / `IChatMessage` present in `proto.d.ts`.

#### Dependencies
- None

#### Files
- `proto/envelope.proto`
- `protocol/` (generated output)
- `frontend/shared-ui/src/net/proto.js`, `frontend/shared-ui/src/net/proto.d.ts` (generated)

#### Scope
- S

---

### Task 2: Server-side sender-name tracking

#### Description
Track authoritative display names per player in `RoomSessionManager` so chat can stamp a
trusted `senderName` without depending on any game plugin.

#### Acceptance Criteria
- [ ] `RoomSessionManager` stores `playerId → displayName` and exposes `displayNameOf(id)`
      with a `"Player <id>"` fallback.
- [ ] Name is recorded at join (from the resolved join name) and updated on `SetNameAction`.
- [ ] Name entry removed on `unregister`.

#### Verification
- [ ] Unit test: register → `displayNameOf` returns name; after rename returns new name;
      after unregister returns fallback.
- [ ] `mvn -pl server/server-runtime test` passes.

#### Dependencies
- Task 1 (uses no proto, but keeps ordering simple; can start in parallel)

#### Files
- `server/server-runtime/src/main/java/com/triforge/server/application/room/RoomSessionManager.java`
- `server/server-runtime/src/main/java/com/triforge/server/application/room/GameRoom.java` (hook join/rename)
- `server/server-runtime/src/test/java/.../RoomSessionManagerTest.java` (new)

#### Scope
- S

---

### Task 3: RoomChatService + rate limiter + dispatch (end-to-end backend slice)

#### Description
Introduce `RoomChatService` (with `ChatRateLimiter` and a `ChatHistory`/`NoOpChatHistory`
seam) that owns all chat logic. `GameRoom` only delegates. Add a `CHATCOMMAND` case in
`CommandDispatcher`. Chat broadcasts via the **existing** `RoomBroadcastAccess.broadcast(
GameMessage)` — no new interface method. Completes the server pipe: WS in → validated →
broadcast out.

#### Acceptance Criteria
- [ ] `RoomChatService.handle(long playerId, String text)`: rate-limits → trims/drops blank
      → truncates to 200 chars → resolves name from `RoomSessionManager` → `history.append`
      → builds `GameMessage{chatMessage}` → `broadcaster.broadcast(msg)`.
- [ ] `RoomChatService.announce(String text)` emits a system line (`senderPlayerId = 0`).
- [ ] `ChatRateLimiter.allow(long playerId)` enforces ≤ 5 msg / 2 s; over-limit dropped.
- [ ] `ChatHistory` interface + `NoOpChatHistory` default wired into the service (no persist).
- [ ] `GameRoom.handleChatCommand(playerId, text)` is a one-line delegate to `chatService`.
- [ ] `GameRoom` calls `chatService.announce(...)` on player join, leave, and match start.
- [ ] `CommandDispatcher` handles `CHATCOMMAND`, requiring non-null `PLAYER_ID_KEY`,
      enqueuing onto the room loop.
- [ ] Works regardless of match phase (no phase gate).
- [ ] **No `broadcastChat` added** to `RoomBroadcastAccess` — existing `broadcast(GameMessage)`
      is reused.

#### Verification
- [ ] Unit: `RoomChatService` with a fake broadcaster + fake session-name lookup — asserts
      authoritative `senderName`, truncation, blank-drop, and rate-limit behaviour.
- [ ] Unit: `ChatRateLimiter` allows 5 then blocks the 6th within the window; recovers after.
- [ ] Integration: two mock sessions; A sends chat; both A and B receive the `ChatMessage`.
- [ ] Integration: join/leave/match-start produce system `ChatMessage{senderPlayerId=0}`.
- [ ] `mvn -pl server/server-runtime test` passes.

#### Dependencies
- Task 1, Task 2

#### Files
- `server/server-runtime/src/main/java/com/triforge/server/application/room/chat/RoomChatService.java` (new)
- `server/server-runtime/src/main/java/com/triforge/server/application/room/chat/ChatRateLimiter.java` (new)
- `server/server-runtime/src/main/java/com/triforge/server/application/room/chat/ChatHistory.java` (new interface)
- `server/server-runtime/src/main/java/com/triforge/server/application/room/chat/NoOpChatHistory.java` (new)
- `server/server-runtime/src/main/java/com/triforge/server/application/room/GameRoom.java` (delegate + announce hooks)
- `server/server-runtime/src/main/java/com/triforge/server/transport/netty/CommandDispatcher.java`
- `server/server-runtime/src/test/java/.../room/chat/` (new tests)

#### Scope
- M

---

## Checkpoint A (after Tasks 1–3)
- [ ] `mvn clean test` passes for all backend modules.
- [ ] Backend chat pipe verified end-to-end by test (send → broadcast → receive).
- [ ] No `games.*` imports leaked into `GameRoom`; chat logic lives in `RoomChatService`.
- [ ] Oneof tags 13/14 locked; Phase-2 scalar fields remain safely addable (non-breaking).

---

### Task 4: Client library — send + chat subscription seam

#### Description
Extend `GameClient` (shared-ui) with `sendChat(text)` and a **multi-listener** chat
subscription `onChat(fn): () => void` (returns unsubscribe). This is additive and scoped to
chat only — the existing single-slot `handlers.onX` object is left untouched (no event-bus
rewrite of snapshot/lobby handlers). Re-export the new proto types.

#### Acceptance Criteria
- [ ] `GameClient.sendChat(text: string)` sends `GameMessage{chatCommand:{text}}`.
- [ ] `GameClient.onChat(fn: (msg: IChatMessage) => void): () => void` registers a listener
      and returns an unsubscribe; multiple listeners supported.
- [ ] `handleMessage` routes `gameMessage.chatMessage` → fan-out to all chat listeners.
- [ ] Chat listeners survive `handlers` reassignment across scene swaps (stored separately).
- [ ] `ChatCommand`/`ChatMessage`/`IChatMessage` re-exported from `client.ts`.

#### Verification
- [ ] `cd frontend/shared-ui && npm run build` (or `tsc --noEmit`) succeeds.
- [ ] Manual: two listeners both receive a broadcast line; unsubscribe stops delivery.

#### Dependencies
- Task 1 (regenerated TS proto), Task 3 (server to talk to)

#### Files
- `frontend/shared-ui/src/net/client.ts`

#### Scope
- S

---

### Task 5: Reusable ChatOverlay UI component (shared-ui)

#### Description
A minimal, framework-agnostic chat widget in `shared-ui`: a scrollable message list + a
text input with send-on-Enter, wired to a `GameClient`. Rendered as a DOM overlay so it
works over both Phaser games without engine-specific code.

#### Acceptance Criteria
- [ ] `ChatOverlay` mounts to a container, subscribes via `client.onChat(...)` and stores
      the returned unsubscribe for teardown, appends incoming lines (`senderName: text`),
      and sends on Enter via `client.sendChat`.
- [ ] Trims input, ignores empty sends, caps rendered history (e.g. last 100 lines).
- [ ] System messages (`senderPlayerId === 0`) render distinctly.
- [ ] Does not steal game keyboard input while typing (input focus isolation).

#### Verification
- [ ] `cd frontend/shared-ui && npm run build` succeeds.
- [ ] Manual: two tabs in the same room exchange messages live.

#### Dependencies
- Task 4

#### Files
- `frontend/shared-ui/src/ui/ChatOverlay.ts` (new)
- `frontend/shared-ui/src/index.ts` (export, if barrel exists)

#### Scope
- S

---

### Task 6: Mount chat in game frontends (integration slice)

#### Description
Mount `ChatOverlay` in **both** the Tank Arena and TreasureQuest frontends, in both lobby
and match/play scenes, using the existing shared `GameClient` instance.

#### Acceptance Criteria
- [ ] Chat visible + functional in the lobby scene and the match scene, in **both** games.
- [ ] Uses the registry-shared `GameClient` (no second WS connection).
- [ ] Overlay's `client.onChat(...)` subscription is independent of scene handler swaps and
      is unsubscribed on teardown.

#### Verification
- [ ] `mvn clean package -pl launcher/triforge-server -am` builds the fat JAR.
- [ ] Manual LAN test: `java -jar …`; two browsers join the same room; messages appear in
      both, in lobby and mid-match.

#### Dependencies
- Task 5

#### Files
- `games/tankarena/frontend/src/**` (lobby + match scene mount points)
- `games/treasurequest/frontend/src/**` (if in scope)

#### Scope
- M

---

## Checkpoint B (after Tasks 4–6)
- [ ] `mvn clean package -pl launcher/triforge-server -am` succeeds (frontend + fat JAR).
- [ ] Manual end-to-end: two players, same room, chat works in lobby and mid-match.
- [ ] No regression in existing lobby/match/snapshot flows.
- [ ] Plan document moved to `planning/archive/`.

---

## Risks

- **Handler swap fragility:** RESOLVED by design — chat uses a dedicated multi-listener
  `client.onChat(...)` seam (Task 4), independent of the per-scene `handlers` slot.
- **Event-bus scope creep:** converting *all* handlers to an event bus was rejected as too
  broad for this feature; only the chat seam is added. Full migration is a separate plan.
- **Spam / abuse:** `ChatRateLimiter` (≤ 5 / 2 s) + 200-char cap (Task 3). No profanity
  filtering in scope.
- **No history for late joiners:** intentional; the `ChatHistory`/`NoOpChatHistory` seam
  ships now so a `RingBufferHistory` + `JoinResponse` replay drops in later with no service
  changes.
- **Proto tag churn:** only oneof tags 13/14 are permanent; must not change. Adding scalar
  fields inside `ChatMessage` later is non-breaking (Phase 2). Locked in Task 1.
- **Keyboard capture:** Phaser input vs. HTML input focus can conflict; overlay must
  release/capture keys correctly (Task 5).

## Phase 2 (deferred — safe to add later, no wire debt)

- **`messageId` (`ChatMessage` scalar field):** dedup, client cache, future delete/replay.
- **`serverUnixMillis` (`ChatMessage` scalar field):** wall-clock display (e.g. `20:35`);
  `tick` is only a coarse ordering hint today.
- **`RingBufferHistory`:** bounded server-side scrollback, replayed to late joiners via
  `JoinResponse`. Swaps in behind the existing `ChatHistory` interface.
- **Full `GameClient` event-bus migration:** move snapshot/lobby/match handlers to the same
  multi-listener model introduced for chat.
- **Team / whisper channels:** add a `channel`/`scope` field to `ChatCommand`/`ChatMessage`
  and filter recipients in `RoomChatService` (recipient filtering, not a new broadcast API).

## Open Questions

_All resolved with the user:_
1. **System announcements** — yes; emit join/leave + match-start as `ChatMessage`
   `senderPlayerId = 0` (folded into Task 3).
2. **Frontends** — both Tank Arena and TreasureQuest (Task 6).
3. **Limits** — ≤ 5 msg / 2 s per player, 200-char cap with truncation (Task 3).
