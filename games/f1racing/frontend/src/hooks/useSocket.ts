import { useEffect, useRef } from 'react';
import {
  MatchPhase,
  fetchLobbySnapshot,
  toNum,
  type IF1RoomConfig,
  type IRoomLobbySnapshot,
} from '@triforge/shared-ui';
import { RaceBridge } from '../net/RaceBridge';
import {
  DEFAULT_TRACK_ID,
  F1CollisionMode,
  formatJoinCode,
  generateRoomCode,
  buildSoloRoomId,
  isSoloRoomId,
  mapRaceResult,
  mapRaceState,
  mapStandingEntry,
  resolveF1RoomId,
  type LobbyPlayerView,
  type RoomConfigView,
  type RoomSummary,
} from '../shared';
import { fetchLastReplay } from '../replay/storage';
import { readGarageLoadout } from '../garage/storage';
import { useF1Store } from '../store/f1Store';

function mapRoomConfig(proto: IF1RoomConfig | null | undefined): RoomConfigView | null {
  if (!proto) return null;
  return {
    trackId: proto.trackId || DEFAULT_TRACK_ID,
    trackDisplayName: proto.trackDisplayName || 'City Loop',
    lapCount: proto.lapCount ?? 3,
    maxPlayers: proto.maxPlayers ?? 10,
    enableQualifying: proto.enableQualifying ?? true,
    qualifyingDurationSec: proto.qualifyingDurationSec ?? 180,
    collisionOn: (proto.collision ?? F1CollisionMode.ON) === F1CollisionMode.ON,
  };
}

function mapPlayers(snapshot: IRoomLobbySnapshot): LobbyPlayerView[] {
  return (snapshot.players ?? []).map((player) => ({
    id: String(toNum(player.playerId)),
    name: player.displayName || 'Driver',
    ready: player.ready ?? false,
    host: player.isHost ?? false,
  }));
}

function resolveHostId(players: LobbyPlayerView[]): string | null {
  return players.find((player) => player.host)?.id ?? players[0]?.id ?? null;
}

function isJoinableF1Room(room: {
  gamePluginId?: string;
  roomId?: string;
  playerCount?: number;
}): boolean {
  if (room.gamePluginId !== 'f1racing') return false;
  const roomId = room.roomId || '';
  if (roomId.includes(':sp:')) return false;
  if (!roomId.includes(':') || roomId === 'f1racing') return false;
  return (room.playerCount ?? 0) >= 0;
}

function applyLobbySnapshot(
  bridge: RaceBridge,
  snapshot: IRoomLobbySnapshot,
  fullRoomId: string,
  playerName: string,
) {
  const players = mapPlayers(snapshot);
  const store = useF1Store.getState();
  const solo = isSoloRoomId(fullRoomId);
  store.setPlayer(String(bridge.client.selfPlayerId), playerName, fullRoomId);
  store.setLobby({
    players,
    hostId: resolveHostId(players),
    canStart: snapshot.canStart ?? false,
    matchPhase: snapshot.phase ?? MatchPhase.LOBBY,
  });
  if (solo) {
    store.setScreen('race');
    return;
  }
  if ((snapshot.phase ?? MatchPhase.LOBBY) === MatchPhase.LOBBY) {
    store.setScreen('lobby');
  }
}

function sendGarageLoadout(bridge: RaceBridge): void {
  const loadout = readGarageLoadout();
  bridge.client.sendF1Message({
    garageLoadout: {
      carId: loadout.carId,
      primaryColor: loadout.primaryColor,
      liveryId: loadout.liveryId ?? '',
      wheelId: loadout.wheelId ?? '',
      nitroFxId: loadout.nitroFxId ?? '',
    },
  });
}

export function useSocket() {
  const bridgeRef = useRef<RaceBridge | null>(null);

  const fetchRooms = async (hostIp?: string, port?: number) => {
    try {
      const base = hostIp && port
        ? `${location.protocol}//${hostIp}:${port}`
        : undefined;
      const url = base ? `${base}/api/lobby/rooms` : '/api/lobby/rooms';
      const res = await fetch(url);
      if (!res.ok) throw new Error(`rooms ${res.status}`);
      const data = await res.json();
      const rooms: RoomSummary[] = (data?.rooms ?? [])
        .filter(isJoinableF1Room)
        .map((room: {
          roomId: string;
          playerCount?: number;
          maxPlayers?: number;
          hostDisplayName?: string;
        }) => {
          const parts = room.roomId.split(':');
          const trackId = parts.length >= 3 ? parts[1] : DEFAULT_TRACK_ID;
          return {
            roomId: room.roomId,
            playerCount: room.playerCount ?? 0,
            maxPlayers: room.maxPlayers ?? 10,
            hostName: room.hostDisplayName?.trim() || '—',
            trackId,
          };
        });
      useF1Store.getState().setAvailableRooms(rooms);
      useF1Store.getState().setConnected(true);
    } catch (error) {
      console.error('Failed to fetch F1 rooms', error);
      useF1Store.getState().setConnected(false);
    }
  };

  const fetchHosts = async () => {
    try {
      const snapshot = await fetchLobbySnapshot();
      const hosts = (snapshot.hosts ?? [])
        .filter((host) => !host.stale)
        .map((host) => ({ hostIp: host.hostIp, port: host.port }));
      useF1Store.getState().setLanHosts(hosts);
    } catch (error) {
      console.error('Failed to fetch LAN hosts', error);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchHosts();
    const roomsTimer = setInterval(() => fetchRooms(), 5000);
    const hostsTimer = setInterval(fetchHosts, 10000);
    const pingTimer = setInterval(() => {
      const bridge = bridgeRef.current;
      if (bridge) {
        useF1Store.getState().setPingMs(bridge.client.pingMs);
      }
    }, 1000);
    return () => {
      clearInterval(roomsTimer);
      clearInterval(hostsTimer);
      clearInterval(pingTimer);
      bridgeRef.current?.close();
    };
  }, []);

  const connectToGame = (
    roomId: string,
    playerName: string,
    connection?: { hostIp?: string; port?: number },
  ) => {
    bridgeRef.current?.close();
    bridgeRef.current = null;
    useF1Store.getState().resetSession();

    const fullRoomId = resolveF1RoomId(roomId);
    if (!fullRoomId) return;

    const bridge = new RaceBridge(fullRoomId, playerName, {
      onDisconnected: () => {
        useF1Store.getState().setError('Mất kết nối server');
        useF1Store.getState().setScreen('menu');
      },
      onJoinRejected: () => {
        bridgeRef.current?.close();
        bridgeRef.current = null;
        useF1Store.getState().setError('Không vào được phòng (đầy, đang đua, hoặc sai mật khẩu)');
        useF1Store.getState().setScreen('join');
      },
      onLobbySnapshot: (snapshot) => {
        const joinCode = formatJoinCode(fullRoomId);
        const url = new URL(window.location.href);
        url.searchParams.set('room', joinCode);
        window.history.replaceState({}, '', url);

        const name = useF1Store.getState().playerName || playerName;
        applyLobbySnapshot(bridge, snapshot, fullRoomId, name);
        sendGarageLoadout(bridge);
      },
      onF1Message: (message) => {
        if (message.roomConfig) {
          useF1Store.getState().setRoomConfig(mapRoomConfig(message.roomConfig));
        }
        if (message.raceState) {
          useF1Store.getState().setRaceState(mapRaceState(message.raceState));
          useF1Store.getState().setScreen('race');
        }
        if (message.standings?.entries) {
          useF1Store.getState().setStandings(
            message.standings.entries.map(mapStandingEntry),
          );
        }
        if (message.raceResult) {
          useF1Store.getState().setRaceResult(mapRaceResult(message.raceResult));
          useF1Store.getState().setScreen('results');
          if (message.raceResult.replayFileName) {
            void fetchLastReplay();
          }
        }
      },
      onMatchPhaseUpdate: (update) => {
        const phase = update.phase ?? MatchPhase.LOBBY;
        const store = useF1Store.getState();
        const solo = isSoloRoomId(store.roomId);
        store.setLobby({
          players: store.lobbyPlayers,
          hostId: store.hostId,
          canStart: store.canStart,
          matchPhase: phase,
        });
        store.setCountdownSeconds(
          phase === MatchPhase.COUNTDOWN ? Number(update.countdownSeconds ?? 0) : 0,
        );
        if (solo) {
          if (phase === MatchPhase.COUNTDOWN || phase === MatchPhase.PLAYING) {
            store.setScreen('race');
          }
          if (phase === MatchPhase.ENDED && store.raceResult) {
            store.setScreen('results');
          }
          return;
        }
        // Drop onto the track for the countdown so the grid is visible and the camera locks
        // during "3·2·1" — the server spawns the cars the moment the countdown begins.
        if (phase === MatchPhase.LOBBY) {
          if (store.screen !== 'results') {
            store.setScreen('lobby');
          }
        }
        if (phase === MatchPhase.COUNTDOWN || phase === MatchPhase.PLAYING) {
          store.setScreen('race');
        }
        if (phase === MatchPhase.ENDED && store.raceResult) {
          store.setScreen('results');
        }
      },
    }, connection);

    bridge.connect();
    bridgeRef.current = bridge;
  };

  return {
    createRoom: (playerName: string, trackId = DEFAULT_TRACK_ID) => {
      useF1Store.getState().setPlayer('', playerName, '');
      const code = generateRoomCode();
      connectToGame(`f1racing:${trackId}:${code}`, playerName);
    },
    joinRoom: (
      roomCode: string,
      playerName: string,
      connection?: { hostIp?: string; port?: number },
    ) => {
      useF1Store.getState().setPlayer('', playerName, '');
      connectToGame(roomCode, playerName, connection);
    },
    startSinglePlayer: (
      mode: import('../shared').SinglePlayerMode,
      trackId: string,
      playerName: string,
    ) => {
      useF1Store.getState().setPlayer('', playerName, '');
      connectToGame(buildSoloRoomId(mode, trackId), playerName);
    },
    setReady: (ready: boolean) => bridgeRef.current?.client.setReady(ready),
    startRace: () => bridgeRef.current?.client.startMatch(),
    sendGarageLoadout: () => {
      if (bridgeRef.current) sendGarageLoadout(bridgeRef.current);
    },
    updateRoomConfig: (config: Partial<RoomConfigView>) => {
      const current = useF1Store.getState().roomConfig;
      if (!bridgeRef.current || !current) return;
      bridgeRef.current.client.sendF1Message({
        setRoomConfig: {
          trackId: config.trackId ?? current.trackId,
          lapCount: config.lapCount ?? current.lapCount,
          maxPlayers: config.maxPlayers ?? current.maxPlayers,
          enableQualifying: config.enableQualifying ?? current.enableQualifying,
          qualifyingDurationSec: config.qualifyingDurationSec ?? current.qualifyingDurationSec,
          collision: (config.collisionOn ?? current.collisionOn)
            ? F1CollisionMode.ON
            : F1CollisionMode.OFF,
        },
      });
    },
    addBot: () => bridgeRef.current?.client.sendF1Message({ addBot: {} }),
    kickPlayer: (targetPlayerId: string) => bridgeRef.current?.client.sendF1Message({
      kickPlayer: { playerId: Number(targetPlayerId) },
    }),
    skipQualifying: () => bridgeRef.current?.client.sendF1Message({ skipQualifying: {} }),
    refreshRooms: (hostIp?: string, port?: number) => fetchRooms(hostIp, port),
    refreshHosts: fetchHosts,
    leave: () => {
      bridgeRef.current?.close();
      bridgeRef.current = null;
      useF1Store.getState().resetSession();
      useF1Store.getState().setScreen('menu');
    },
    getBridge: () => bridgeRef.current,
  };
}
