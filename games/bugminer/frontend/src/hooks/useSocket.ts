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
            .map((r: any) => ({
              roomId: r.roomId,
              name: r.roomName || 'BugMiner Room',
              players: [], // Not provided by the summary API
              playerCount: r.playerCount || 0,
              maxPlayers: r.maxPlayers || 2,
              hostName: 'Server', // Not provided by the summary API
              state: 'waiting',
              levelId: '1'
            }));
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
    
    // Ensure roomId has the bugminer: prefix for the backend
    const fullRoomId = roomId.startsWith('bugminer:') ? roomId : `bugminer:${roomId}`;

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
        
        // MatchPhase mapping
        if (snapshot.phase === MatchPhase.LOBBY) {
           setScreen('lobby');
        } else if (snapshot.phase === MatchPhase.PLAYING) {
           setScreen('game');
        }
      },
      onBugMinerMessage: (message) => {
        // Implement when Java backend starts sending bugminer messages
      }
    });
    
    client.connect();
    clientRef.current = client;
  };

  return {
    emit: () => false,
    createRoom: (playerName: string, levelId: string) => {
      // Generate a random 4-character string
      const randomId = Math.random().toString(36).substring(2, 6).toUpperCase();
      connectToGame(randomId, playerName);
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
