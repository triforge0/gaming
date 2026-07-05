import { useEffect, useRef } from 'react';
import { GameClient, MatchPhase, toNum } from '@triforge/shared-ui';
import type { FairModeConfig, GameState, ItemType, RoomSummary } from '../shared';
import { DEFAULT_FAIR_MODE, formatJoinCode, resolveBugMinerRoomId, resolveGamePhase } from '../shared';
import { mergePlayingPhaseUpdate, resolveActiveWinner, shouldInterruptForLobbyPhase } from '../shared/boardStateSync';
import { useGameStore } from '../store/gameStore';

function mapFairMode(proto?: { enabled?: boolean | null; battle?: boolean | null; levelId?: string | null; timeLimit?: number | null } | null): FairModeConfig {
  if (!proto) return { ...DEFAULT_FAIR_MODE };
  return {
    enabled: proto.enabled ?? false,
    battle: proto.battle ?? false,
    levelId: proto.levelId || DEFAULT_FAIR_MODE.levelId,
    timeLimit: proto.timeLimit ?? DEFAULT_FAIR_MODE.timeLimit,
  };
}

function handleBoardEvents(
  events: Array<{
    eventType?: string | null;
    playerId?: unknown;
    thiefId?: unknown;
    victimId?: unknown;
    itemId?: string | null;
    value?: number | null;
  }> | null | undefined,
  myId: string | null,
) {
  if (!events?.length || !myId) return;
  const store = useGameStore.getState();
  for (const event of events) {
    const type = event.eventType || '';
    const playerId = event.playerId != null ? String(toNum(event.playerId as number)) : '';
    const thiefId = event.thiefId != null ? String(toNum(event.thiefId as number)) : '';
    const victimId = event.victimId != null ? String(toNum(event.victimId as number)) : '';

    if (type === 'item:collected' && playerId === myId) {
      store.addCollection(event.value ?? 0, 'gold');
    }
    if (type === 'poison:hit' && playerId === myId) {
      store.setPoisonFlash(true);
      setTimeout(() => store.setPoisonFlash(false), 2000);
    }
    if (type === 'battle:clash') {
      store.setError('⚡ Va chạm móc! Mất lượt phóng.');
      setTimeout(() => store.setError(null), 1500);
    }
    if (type === 'battle:steal' && thiefId === myId) {
      store.setError('🪝 Cướp được vật phẩm từ đối thủ!');
      setTimeout(() => store.setError(null), 1500);
    }
    if (type === 'battle:steal' && victimId === myId) {
      store.setError('😱 Đối thủ cướp mất vật phẩm bạn đang kéo!');
      setTimeout(() => store.setError(null), 2000);
    }
    if (type === 'battle:bombLaunched' && playerId === myId) {
      store.setError('💣 Đã ném bom!');
      setTimeout(() => store.setError(null), 1200);
    }
    if (type === 'battle:bombHit' && victimId === myId) {
      store.setError('💥 Trúng bom! Móc bị đứt!');
      setTimeout(() => store.setError(null), 1800);
    }
    if (type === 'battle:ropeCut' && victimId === myId) {
      store.setError('⛓️‍💥 Dây câu đứt — vật phẩm rơi!');
      setTimeout(() => store.setError(null), 2000);
    }
  }
}

function hasChallengeProto(
  c?: { designerId?: unknown; playerId?: unknown } | null,
): boolean {
  if (!c) return false;
  return toNum(c.designerId as number) > 0 || toNum(c.playerId as number) > 0;
}

function isJoinableBugMinerRoom(r: {
  gamePluginId?: string;
  roomId?: string;
  playerCount?: number;
}): boolean {
  if (r.gamePluginId !== 'bugminer') return false;
  const roomId = r.roomId || '';
  if (!roomId.includes(':') || roomId === 'bugminer') return false;
  if (roomId.startsWith('presence-')) return false;
  return (r.playerCount ?? 0) > 0;
}

function resolveHostId(
  players: Array<{ playerId?: unknown; isHost?: boolean | null }> | null | undefined,
): string {
  const hostPlayer = players?.find((p) => p.isHost);
  if (hostPlayer?.playerId != null) {
    return String(toNum(hostPlayer.playerId as number));
  }
  const first = players?.[0];
  return first?.playerId != null ? String(toNum(first.playerId as number)) : '';
}

function mapLobbyPlayers(
  players: Array<{ playerId?: unknown; displayName?: string | null; ready?: boolean | null }> | null | undefined,
) {
  return players?.map((p) => ({
    id: String(toNum(p.playerId as number)),
    name: p.displayName || '',
    role: null,
    ready: p.ready || false,
  })) ?? [];
}

function applyLobbySnapshot(
  snapshot: { players?: Array<{ playerId?: unknown; displayName?: string | null; isHost?: boolean | null; ready?: boolean | null }> | null; phase?: number | null },
  selfPlayerId: number,
  fullRoomId: string,
  playerName: string,
) {
  const { setPlayer, setGameState, setScreen } = useGameStore.getState();
  const hostId = resolveHostId(snapshot.players);
  const prev = useGameStore.getState().gameState;

  setPlayer(
    selfPlayerId.toString(),
    playerName,
    fullRoomId,
    null,
  );

  setGameState({
    roomId: fullRoomId,
    phase: snapshot.phase === MatchPhase.LOBBY ? 'lobby' : (prev?.phase ?? 'lobby'),
    hostId,
    fairMode: prev?.fairMode ?? { ...DEFAULT_FAIR_MODE },
    players: mapLobbyPlayers(snapshot.players),
    challenges: snapshot.phase === MatchPhase.LOBBY ? undefined : prev?.challenges,
    battle: snapshot.phase === MatchPhase.LOBBY ? null : (prev?.battle ?? null),
    winnerId: snapshot.phase === MatchPhase.LOBBY ? null : (prev?.winnerId ?? null),
    endReason: snapshot.phase === MatchPhase.LOBBY ? null : (prev?.endReason ?? null),
    countdown: snapshot.phase === MatchPhase.LOBBY ? 0 : (prev?.countdown ?? 0),
  } as GameState);

  if (snapshot.phase === MatchPhase.LOBBY) setScreen('lobby');
  else if (snapshot.phase === MatchPhase.PLAYING) setScreen('game');
}

export function useSocket() {
  const clientRef = useRef<GameClient | null>(null);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/lobby/rooms');
      if (res.ok) {
        const data = await res.json();
        if (data?.rooms) {
          const bugminerRooms: RoomSummary[] = data.rooms
            .filter(isJoinableBugMinerRoom)
            .map((r: {
              roomId: string;
              playerCount?: number;
              maxPlayers?: number;
              hostDisplayName?: string;
            }) => {
              let parsedLevelId = 'easy-mine';
              const parts = r.roomId.split(':');
              if (parts.length >= 3) parsedLevelId = parts[1];
              return {
                roomId: r.roomId,
                playerCount: r.playerCount || 0,
                maxPlayers: r.maxPlayers || 2,
                phase: 'lobby' as const,
                levelId: parsedLevelId,
                hostName: r.hostDisplayName?.trim() || '—',
                players: [],
                fairMode: { ...DEFAULT_FAIR_MODE, levelId: parsedLevelId },
              };
            });
          useGameStore.getState().setAvailableRooms(bugminerRooms);
        }
      }
      useGameStore.getState().setConnected(true);
    } catch (e) {
      console.error('Failed to fetch rooms', e);
      useGameStore.getState().setConnected(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    const intervalId = setInterval(fetchRooms, 5000);
    return () => {
      clearInterval(intervalId);
      clientRef.current?.close();
    };
  }, []);

  const connectToGame = (roomId: string, playerName: string) => {
    if (clientRef.current) {
      clientRef.current.close();
      clientRef.current = null;
    }

    useGameStore.setState({
      gameState: null,
      playerId: null,
      role: null,
      roomId: null,
      isPaused: false,
      error: null,
    });

    const fullRoomId = resolveBugMinerRoomId(roomId);

    const client = new GameClient(fullRoomId, playerName, {
      onDisconnected: () => {
        useGameStore.getState().setError('Mất kết nối server');
      },
      onLobbySnapshot: (snapshot) => {
        const joinCode = formatJoinCode(fullRoomId);
        const url = new URL(window.location.href);
        url.searchParams.set('room', joinCode);
        window.history.pushState({}, '', url);

        const name = useGameStore.getState().playerName || playerName;
        applyLobbySnapshot(snapshot, client.selfPlayerId, fullRoomId, name);
      },
      onJoinRejected: () => {
        clientRef.current?.close();
        clientRef.current = null;
        useGameStore.getState().setError('Không thể vào phòng (phòng đầy, đang chơi, hoặc tên đã được dùng)');
        useGameStore.getState().setScreen('home');
      },
      onMatchPhaseUpdate: (update) => {
        const store = useGameStore.getState();
        const { gameState } = store;

        if (update.phase === MatchPhase.ENDED) {
          return;
        }

        if (update.phase === MatchPhase.LOBBY || update.phase === MatchPhase.COUNTDOWN) {
          const wirePhase = update.phase === MatchPhase.LOBBY ? 'lobby' : 'countdown';
          if (shouldInterruptForLobbyPhase(wirePhase, gameState?.phase)) {
            store.setScreen('lobby');
          }
          return;
        }

        if (update.phase === MatchPhase.PLAYING && gameState) {
          store.setGameState(mergePlayingPhaseUpdate({
            ...gameState,
            phase: gameState.phase,
            winnerId: gameState.winnerId,
            endReason: gameState.endReason,
          }));
        } else if (update.phase === MatchPhase.PLAYING) {
          store.setScreen('game');
        }
      },
      onBugMinerMessage: (message) => {
        if (!message.board) return;
        const current = useGameStore.getState();
        const pA = message.board.forPlayerA;
        const pB = message.board.forPlayerB;
        const fairMode = mapFairMode(message.board.fairMode);
        const battleProto = message.board.battle;

        // Lobby sync: fair/battle settings before challenges exist
        if (!hasChallengeProto(pA) && !hasChallengeProto(pB) && !battleProto) {
          current.setGameState({
            ...(current.gameState || {}),
            roomId: fullRoomId,
            fairMode,
            hostId: current.gameState?.hostId || '',
            players: current.gameState?.players || [],
            phase: current.gameState?.phase ?? 'lobby',
            challenges: current.gameState?.challenges,
            battle: current.gameState?.battle ?? null,
            winnerId: current.gameState?.winnerId ?? null,
            endReason: current.gameState?.endReason ?? null,
            countdown: current.gameState?.countdown ?? 0,
          } as GameState);
          return;
        }

        const itemTypeMap: Record<number, ItemType> = {
          1: 'gold', 2: 'bigGold', 3: 'diamond', 4: 'rock', 5: 'mysteryBag', 6: 'poison',
          7: 'mouse', 8: 'pig', 9: 'strengthDrink', 10: 'bedrock',
        };
        const hookStateMap: Record<number, 'swinging' | 'extending' | 'retracting'> = {
          0: 'swinging', 1: 'swinging', 2: 'extending', 3: 'retracting',
        };

        const mapHook = (hook?: { angle?: number | null; length?: number | null; state?: number | null; attachedItemId?: string | null; swingDirection?: number | null } | null) => ({
          angle: hook?.angle ?? 0,
          length: hook?.length ?? 0,
          state: hookStateMap[hook?.state ?? 0] || 'swinging',
          attachedItemId: hook?.attachedItemId || null,
          swingDirection: (hook?.swingDirection || 1) as 1 | -1,
        });

        const mapItems = (items?: Array<{ id?: string | null; type?: number | null; x?: number | null; y?: number | null; collected?: boolean | null; scale?: number | null; moving?: boolean | null; vx?: number | null; vy?: number | null }> | null) =>
          items?.map((item) => ({
            id: item.id || '',
            type: itemTypeMap[item.type ?? 0] || 'gold',
            position: { x: item.x ?? 0, y: item.y ?? 0 },
            collected: item.collected || false,
            scale: item.scale ?? 1,
            moving: item.moving || false,
            velocity: item.moving ? { x: item.vx ?? 0, y: item.vy ?? 0 } : undefined,
          })) || [];

        const emptyChallenge = (playerAId: string, playerBId: string) => ({
          designerId: playerBId,
          playerId: playerAId,
          levelId: fairMode.levelId,
          timeLimit: fairMode.timeLimit,
          timeRemaining: fairMode.timeLimit,
          targetScore: 800,
          score: 0,
          items: [],
          hook: { angle: 0, length: 0, state: 'swinging' as const, attachedItemId: null, swingDirection: 1 as const },
          setupLocked: false,
          finished: false,
          endReason: null,
          strengthBuffRemaining: 0,
        });

        const mapChallengeState = (c: typeof pA) => {
          if (!c) return null;
          return {
            designerId: String(toNum(c.designerId)),
            playerId: String(toNum(c.playerId)),
            levelId: c.levelId || 'easy-mine',
            timeLimit: c.timeLimit || 90,
            timeRemaining: c.timeRemaining || 90,
            targetScore: c.targetScore || 800,
            score: c.score || 0,
            items: mapItems(c.items),
            hook: c.hook ? mapHook(c.hook) : mapHook(),
            setupLocked: c.setupLocked || false,
            finished: c.finished || false,
            endReason: (c.endReason as GameState['endReason']) || null,
            strengthBuffRemaining: c.strengthBuffRemaining ?? 0,
          };
        };

        const mapBattleState = () => {
          if (!battleProto) return null;
          return {
            levelId: battleProto.levelId || fairMode.levelId,
            timeLimit: battleProto.timeLimit || fairMode.timeLimit,
            timeRemaining: battleProto.timeRemaining || fairMode.timeLimit,
            targetScore: battleProto.targetScore || 800,
            items: mapItems(battleProto.items),
            playerAId: String(toNum(battleProto.playerAId)),
            playerBId: String(toNum(battleProto.playerBId)),
            hookA: mapHook(battleProto.hookA),
            hookB: mapHook(battleProto.hookB),
            scoreA: battleProto.scoreA || 0,
            scoreB: battleProto.scoreB || 0,
            finished: battleProto.finished || false,
            winnerId: battleProto.winnerId ? String(toNum(battleProto.winnerId)) : null,
            endReason: (battleProto.endReason as GameState['endReason']) || null,
            strengthBuffA: battleProto.strengthBuffA || 0,
            strengthBuffB: battleProto.strengthBuffB || 0,
            bombCooldownA: battleProto.bombCooldownA || 0,
            bombCooldownB: battleProto.bombCooldownB || 0,
            bombs: battleProto.bombs?.map((b) => ({
              id: b.id || '',
              ownerId: String(toNum(b.ownerId)),
              targetPlayerId: String(toNum(b.targetPlayerId)),
              position: { x: b.x ?? 0, y: b.y ?? 0 },
              velocity: { x: b.vx ?? 0, y: b.vy ?? 0 },
              ttl: b.ttl ?? 0,
            })) || [],
          };
        };

        const battle = mapBattleState();
        const playerAId = battle?.playerAId
          || (pA ? String(toNum(pA.playerId)) : current.gameState?.players[0]?.id || '1');
        const playerBId = battle?.playerBId
          || (pB ? String(toNum(pB.playerId)) : current.gameState?.players[1]?.id || '2');

        const toPhaseInput = (c: typeof pA) => {
          if (!hasChallengeProto(c)) return null;
          return {
            setupLocked: c?.setupLocked ?? false,
            finished: c?.finished ?? false,
            endReason: c?.endReason ?? null,
          };
        };

        const boardWinnerId = message.board.winnerId
          ? String(toNum(message.board.winnerId as number))
          : null;
        const boardEndReason = (message.board.matchEndReason as GameState['endReason']) || null;
        const { winnerId: activeWinnerId, endReason: activeEndReason } = resolveActiveWinner(
          battle,
          boardWinnerId,
          boardEndReason,
        );

        const phase = resolveGamePhase(
          fairMode,
          battle,
          fairMode.battle ? null : toPhaseInput(pA),
          fairMode.battle ? null : toPhaseInput(pB),
          message.board.playCountdown ?? 0,
          message.board.paused ?? false,
          activeWinnerId,
        );

        handleBoardEvents(message.board.events, current.playerId);

        const newState: GameState = {
          ...(current.gameState || {}),
          roomId: fullRoomId,
          phase,
          fairMode,
          battle,
          challenges: fairMode.battle
            ? undefined
            : {
                forPlayerA: mapChallengeState(pA) ?? emptyChallenge(playerAId, playerBId),
                forPlayerB: mapChallengeState(pB) ?? emptyChallenge(playerBId, playerAId),
              },
          hostId: current.gameState?.hostId || '',
          players: current.gameState?.players || [],
          winnerId: activeWinnerId,
          endReason: activeEndReason,
          countdown: message.board.playCountdown ?? 0,
        };
        current.setGameState(newState);
        if (message.board.paused) {
          current.setPaused(true);
        } else if (phase === 'playing') {
          current.setPaused(false);
        }
      },
    });

    client.connect();
    clientRef.current = client;
  };

  const patchFairMode = (config: Partial<FairModeConfig>) => {
    const gs = useGameStore.getState().gameState;
    if (gs) {
      useGameStore.getState().setGameState({
        ...gs,
        fairMode: { ...DEFAULT_FAIR_MODE, ...gs.fairMode, ...config },
      });
    }
  };

  return {
    emit: () => false,
    createRoom: (playerName: string, levelId: string) => {
      const ADJECTIVES = ['LAZY', 'CRAZY', 'ANGRY', 'HAPPY', 'SLEEPY', 'HUNGRY', 'BUGGY', 'SUPER', 'FAST', 'SLOW'];
      const NOUNS = ['DEV', 'QC', 'BA', 'PM', 'CAT', 'DOG', 'DUCK', 'BUG', 'CODE', 'SERVER'];
      const id = `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]}-${NOUNS[Math.floor(Math.random() * NOUNS.length)]}-${Math.floor(Math.random() * 100)}`;
      connectToGame(`bugminer:${levelId}:${id}`, playerName);
    },
    joinRoom: (roomId: string, playerName: string) => {
      const fullRoomId = resolveBugMinerRoomId(roomId);
      if (!fullRoomId) return;
      connectToGame(fullRoomId, playerName);
    },
    startGame: () => clientRef.current?.startMatch(),
    setChallengeLevel: (levelId: string) => {
      clientRef.current?.sendBugMinerMessage({ setLevel: { levelId } });
    },
    setChallengeTimeLimit: (timeLimit: number) => {
      clientRef.current?.sendBugMinerMessage({ setTimeLimit: { timeLimit } });
    },
    placeItem: (itemId: string, position: { x: number; y: number }) => {
      clientRef.current?.sendBugMinerMessage({ placeItem: { itemId, x: position.x, y: position.y } });
    },
    lockMap: () => clientRef.current?.sendBugMinerMessage({ lockMap: {} }),
    autoArrange: () => clientRef.current?.sendBugMinerMessage({ autoArrange: {} }),
    fireHook: () => clientRef.current?.sendBugMinerMessage({ fireHook: {} }),
    throwBomb: () => clientRef.current?.sendBugMinerMessage({ throwBomb: {} }),
    pause: (paused: boolean) => clientRef.current?.sendBugMinerMessage({ pause: { paused } }),
    restart: () => clientRef.current?.sendBugMinerMessage({ restart: {} }),
    leave: () => clientRef.current?.close(),
    refreshRoomList: fetchRooms,
    configureFairMode: (config: Partial<FairModeConfig>) => {
      patchFairMode(config);
      clientRef.current?.sendBugMinerMessage({ configureFairMode: config });
    },
  };
}
