import { useEffect, useRef } from 'react';
import { GameClient, MatchPhase, toNum } from '@triforge/shared-ui';
import type { FairModeConfig, GameState, ItemType, PlayerRole, RoomSummary } from '../shared';
import { DEFAULT_FAIR_MODE } from '../shared';
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

export function useSocket() {
  const clientRef = useRef<GameClient | null>(null);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/lobby/rooms');
      if (res.ok) {
        const data = await res.json();
        if (data?.rooms) {
          const bugminerRooms: RoomSummary[] = data.rooms
            .filter((r: { gamePluginId?: string }) => r.gamePluginId === 'bugminer')
            .map((r: { roomId: string; roomName?: string; playerCount?: number; maxPlayers?: number }) => {
              let parsedLevelId = 'easy-mine';
              const parts = r.roomId.split(':');
              if (parts.length >= 3) parsedLevelId = parts[1];
              return {
                roomId: r.roomId,
                playerCount: r.playerCount || 0,
                maxPlayers: r.maxPlayers || 2,
                phase: 'lobby' as const,
                levelId: parsedLevelId,
                hostName: 'Server',
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
    if (clientRef.current) return;

    const fullRoomId = roomId === 'bugminer' || roomId.startsWith('bugminer:')
      ? roomId
      : `bugminer:easy-mine:${roomId}`;

    const client = new GameClient(fullRoomId, playerName, {
      onDisconnected: () => {
        useGameStore.getState().setError('Mất kết nối server');
      },
      onLobbySnapshot: (snapshot) => {
        const { setPlayer, setScreen } = useGameStore.getState();
        const me = snapshot.players?.find((p) => toNum(p.playerId) === client.selfPlayerId);
        const isHost = me?.isHost ?? false;

        setPlayer(
          client.selfPlayerId.toString(),
          playerName,
          fullRoomId,
          (isHost ? 'host' : 'player') as PlayerRole,
        );

        const shortRoomId = fullRoomId.startsWith('bugminer:') ? fullRoomId.substring(fullRoomId.indexOf(':') + 1) : fullRoomId;
        const url = new URL(window.location.href);
        url.searchParams.set('room', shortRoomId);
        window.history.pushState({}, '', url);

        const currentState = useGameStore.getState().gameState;
        const host = snapshot.players?.find((p) => p.isHost);
        useGameStore.getState().setGameState({
          ...(currentState || {}),
          roomId: fullRoomId,
          phase: snapshot.phase === MatchPhase.LOBBY ? 'lobby' : (currentState?.phase || 'lobby'),
          hostId: host ? toNum(host.playerId).toString() : '',
          fairMode: currentState?.fairMode ?? { ...DEFAULT_FAIR_MODE },
          players: snapshot.players?.map((p) => ({
            id: toNum(p.playerId).toString(),
            name: p.displayName || '',
            role: null,
            ready: p.ready || false,
          })) || [],
        } as GameState);

        if (snapshot.phase === MatchPhase.LOBBY) setScreen('lobby');
        else if (snapshot.phase === MatchPhase.PLAYING) setScreen('game');
      },
      onMatchPhaseUpdate: (update) => {
        const { setScreen } = useGameStore.getState();
        if (update.phase === MatchPhase.LOBBY) setScreen('lobby');
        else if (update.phase === MatchPhase.COUNTDOWN) setScreen('lobby');
      },
      onBugMinerMessage: (message) => {
        if (!message.board) return;
        const current = useGameStore.getState();
        const pA = message.board.forPlayerA;
        const pB = message.board.forPlayerB;
        const fairMode = mapFairMode(message.board.fairMode);
        const battleProto = message.board.battle;

        const itemTypeMap: Record<number, ItemType> = {
          1: 'gold', 2: 'bigGold', 3: 'diamond', 4: 'rock', 5: 'mysteryBag', 6: 'poison',
          7: 'mouse', 8: 'pig', 9: 'strengthDrink',
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

        const mapItems = (items?: Array<{ id?: string | null; type?: number | null; x?: number | null; y?: number | null; collected?: boolean | null }> | null) =>
          items?.map((item) => ({
            id: item.id || '',
            type: itemTypeMap[item.type ?? 0] || 'gold',
            position: { x: item.x || 0, y: item.y || 0 },
            collected: item.collected || false,
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
          setupLocked: true,
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
            strengthBuffRemaining: 0,
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
            strengthBuffA: 0,
            strengthBuffB: 0,
          };
        };

        const battle = mapBattleState();
        const playerAId = battle?.playerAId
          || (pA ? String(toNum(pA.playerId)) : current.gameState?.players[0]?.id || '1');
        const playerBId = battle?.playerBId
          || (pB ? String(toNum(pB.playerId)) : current.gameState?.players[1]?.id || '2');

        let phase: GameState['phase'] = 'playing';
        if (fairMode.battle && battle) {
          phase = battle.finished ? 'finished' : 'playing';
        } else if (!pA?.setupLocked || !pB?.setupLocked) {
          phase = 'dual_setup';
        } else if (pA?.finished && pB?.finished) {
          phase = 'finished';
        }

        const newState: GameState = {
          ...(current.gameState || {}),
          roomId: fullRoomId,
          phase,
          fairMode,
          battle,
          challenges: {
            forPlayerA: mapChallengeState(pA) ?? emptyChallenge(playerAId, playerBId),
            forPlayerB: mapChallengeState(pB) ?? emptyChallenge(playerBId, playerAId),
          },
          hostId: current.gameState?.hostId || '',
          players: current.gameState?.players || [],
          winnerId: battle?.winnerId ?? current.gameState?.winnerId ?? null,
          endReason: battle?.endReason ?? current.gameState?.endReason ?? null,
          countdown: current.gameState?.countdown ?? 0,
        };
        current.setGameState(newState);
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
      if (clientRef.current) return;
      const ADJECTIVES = ['LAZY', 'CRAZY', 'ANGRY', 'HAPPY', 'SLEEPY', 'HUNGRY', 'BUGGY', 'SUPER', 'FAST', 'SLOW'];
      const NOUNS = ['DEV', 'QC', 'BA', 'PM', 'CAT', 'DOG', 'DUCK', 'BUG', 'CODE', 'SERVER'];
      const id = `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]}-${NOUNS[Math.floor(Math.random() * NOUNS.length)]}-${Math.floor(Math.random() * 100)}`;
      connectToGame(`bugminer:${levelId}:${id}`, playerName);
    },
    joinRoom: (roomId: string, playerName: string) => {
      const normalized = roomId.trim();
      if (!normalized) return;
      connectToGame(normalized.includes(':') ? normalized : normalized.toUpperCase(), playerName);
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
    pause: (_paused: boolean) => { /* not implemented in proto */ },
    restart: () => { /* not implemented in proto */ },
    leave: () => clientRef.current?.close(),
    refreshRoomList: fetchRooms,
    configureFairMode: (config: Partial<FairModeConfig>) => {
      patchFairMode(config);
      clientRef.current?.sendBugMinerMessage({ configureFairMode: config });
    },
  };
}
