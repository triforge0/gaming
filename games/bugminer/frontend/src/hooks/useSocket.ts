import { useEffect, useRef } from 'react';
import { GameClient, MatchPhase, toNum } from '@triforge/shared-ui';
import type { GameState, ItemType, PlayerRole, RoomSummary } from '../shared';
import { useGameStore } from '../store/gameStore';

export function useSocket() {
  const clientRef = useRef<GameClient | null>(null);

  const fetchRooms = async () => {
    try {
      const res = await fetch('/api/lobby/rooms');
      if (res.ok) {
        const data = await res.json();
        if (data && data.rooms) {
          const bugminerRooms = data.rooms
            .filter((r: any) => r.gamePluginId === 'bugminer')
            .map((r: any) => {
              let parsedLevelId = 'easy-mine';
              const parts = r.roomId.split(':');
              if (parts.length >= 3) {
                parsedLevelId = parts[1];
              }

              return {
                roomId: r.roomId,
                name: r.roomName || 'BugMiner Room',
                players: [], // Not provided by the summary API
                playerCount: r.playerCount || 0,
                maxPlayers: r.maxPlayers || 2,
                hostName: 'Server', // Not provided by the summary API
                state: 'waiting',
                levelId: parsedLevelId
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
    const intervalId = setInterval(fetchRooms, 5000); // Auto-refresh every 5s

    return () => {
      clearInterval(intervalId);
      clientRef.current?.close();
    };
  }, []);

  const connectToGame = (roomId: string, playerName: string) => {
    if (clientRef.current) return;
    
    // Ensure roomId has the bugminer: prefix for the backend, unless it's the exact seeded room 'bugminer'
    const fullRoomId = (roomId === 'bugminer' || roomId.startsWith('bugminer:')) ? roomId : `bugminer:easy-mine:${roomId}`;

    const client = new GameClient(fullRoomId, playerName, {
      onDisconnected: () => {
        useGameStore.getState().setError('Mất kết nối server');
      },
      onLobbySnapshot: (snapshot) => {
        const { setPlayer, setScreen } = useGameStore.getState();
        const me = snapshot.players?.find(p => toNum(p.playerId) === client.selfPlayerId);
        const isHost = me?.isHost ?? false;
        
        setPlayer(
          client.selfPlayerId.toString(), 
          playerName, 
          fullRoomId, 
          (isHost ? 'host' : 'player') as any
        );
        
        // Update URL to include the room ID for easy sharing (without the prefix)
        const shortRoomId = fullRoomId.startsWith('bugminer:') ? fullRoomId.substring(9) : fullRoomId;
        const url = new URL(window.location.href);
        url.searchParams.set('room', shortRoomId);
        window.history.pushState({}, '', url);
        
        // Update GameState with lobby players
        const currentState = useGameStore.getState().gameState;
        const host = snapshot.players?.find(p => p.isHost);
        useGameStore.getState().setGameState({
          ...(currentState || {}),
          phase: snapshot.phase === MatchPhase.LOBBY ? 'lobby' : (currentState?.phase || 'lobby'),
          hostId: host ? toNum(host.playerId).toString() : '',
          players: snapshot.players?.map(p => ({
            id: toNum(p.playerId).toString(),
            name: p.displayName || '',
            role: null,
            ready: p.ready || false
          })) || []
        } as any);

        // MatchPhase mapping
        if (snapshot.phase === MatchPhase.LOBBY) {
           setScreen('lobby');
        } else if (snapshot.phase === MatchPhase.PLAYING) {
           setScreen('game');
        }
      },
      onMatchPhaseUpdate: (update) => {
        const { setScreen } = useGameStore.getState();
        if (update.phase === MatchPhase.LOBBY) {
           setScreen('lobby');
        } else if (update.phase === MatchPhase.PLAYING) {
           // We let the board state determine if it's setup or game
        } else if (update.phase === MatchPhase.COUNTDOWN) {
           setScreen('lobby'); // or a countdown screen
        }
      },
      onBugMinerMessage: (message) => {
        if (message.board) {
          const current = useGameStore.getState();
          const pA = message.board.forPlayerA;
          const pB = message.board.forPlayerB;
          
          let phase: any = 'playing';
          if (!pA?.setupLocked || !pB?.setupLocked) {
             phase = 'dual_setup';
          }
          if (pA?.finished && pB?.finished) {
             phase = 'finished';
          }

          const newState: any = {
             ...(current.gameState || {}),
             phase,
             challenges: {
                forPlayerA: pA ? { ...pA, designerId: String(toNum(pA.designerId)), playerId: String(toNum(pA.playerId)) } : null,
                forPlayerB: pB ? { ...pB, designerId: String(toNum(pB.designerId)), playerId: String(toNum(pB.playerId)) } : null
             }
          };
          current.setGameState(newState);
        }
      }
    });
    
    client.connect();
    clientRef.current = client;
  };

  return {
    emit: () => false,
    createRoom: (playerName: string, levelId: string) => {
      if (clientRef.current) return;
      
      const ADJECTIVES = ["LAZY", "CRAZY", "ANGRY", "HAPPY", "SLEEPY", "HUNGRY", "BUGGY", "SUPER", "FAST", "SLOW"];
      const NOUNS = ["DEV", "QC", "BA", "PM", "CAT", "DOG", "DUCK", "BUG", "CODE", "SERVER"];
      const randAdj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
      const randNoun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
      const num = Math.floor(Math.random() * 100);
      const id = `${randAdj}-${randNoun}-${num}`;
      
      const fullRoomId = `bugminer:${levelId}:${id}`;
      connectToGame(fullRoomId, playerName);
    },
    joinRoom: (roomId: string, playerName: string) => connectToGame(roomId, playerName),
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
    pause: (paused: boolean) => { /* not implemented in proto */ },
    restart: () => { /* not implemented in proto */ },
    leave: () => clientRef.current?.close(),
    refreshRoomList: fetchRooms,
  };
}
