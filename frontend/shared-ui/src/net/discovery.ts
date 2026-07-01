export interface HostPresence {
  schemaVersion: string;
  hostId: string;
  hostIp: string;
  port: number;
  lastSeenMs: number;
  stale: boolean;
}

export interface LobbySnapshot {
  hosts: HostPresence[];
  timestampMs: number;
  ttlMs: number;
}

export interface LobbyRoom {
  roomId: string;
  roomName: string;
  playerCount: number;
  maxPlayers: number;
  gamePluginId?: string;
  gameDisplayName?: string;
}

export interface GamePluginEntry {
  id: string;
  displayName: string;
}

export interface PluginsResponse {
  schemaVersion: string;
  plugins: GamePluginEntry[];
  timestampMs: number;
}

export interface RoomsResponse {
  schemaVersion: string;
  hostId: string;
  hostIp: string;
  port: number;
  defaultGamePluginId?: string;
  rooms: LobbyRoom[];
  timestampMs: number;
}

export interface SelectedRoom {
  hostIp: string;
  port: number;
  roomId: string;
  roomName: string;
  gamePluginId?: string;
  gameDisplayName?: string;
  playerCount: number;
  maxPlayers: number;
}

export function apiBaseUrl(): string {
  const port = location.port === '3000' ? '8080' : location.port;
  const host = port ? `${location.hostname}:${port}` : location.hostname;
  return `${location.protocol}//${host}`;
}

export function hostApiBaseUrl(hostIp: string, port: number): string {
  return `${location.protocol}//${hostIp}:${port}`;
}

export function wsUrlFor(hostIp: string, port: number): string {
  const scheme = location.protocol === 'https:' ? 'wss' : 'ws';
  return `${scheme}://${hostIp}:${port}/ws`;
}

export async function fetchLobbySnapshot(): Promise<LobbySnapshot> {
  const response = await fetch(`${apiBaseUrl()}/api/lobby/hosts`);
  if (!response.ok) {
    throw new Error(`Lobby request failed: ${response.status}`);
  }
  return (await response.json()) as LobbySnapshot;
}

export async function fetchHostRooms(hostIp: string, port: number): Promise<RoomsResponse> {
  const query = new URLSearchParams({ host: hostIp, port: String(port) });
  const response = await fetch(`${hostApiBaseUrl(hostIp, port)}/api/lobby/rooms?${query}`);
  if (!response.ok) {
    throw new Error(`Room list request failed: ${response.status}`);
  }
  return (await response.json()) as RoomsResponse;
}

export async function fetchAvailablePlugins(hostIp: string, port: number): Promise<PluginsResponse> {
  const response = await fetch(`${hostApiBaseUrl(hostIp, port)}/api/lobby/plugins`);
  if (!response.ok) {
    throw new Error(`Plugin list request failed: ${response.status}`);
  }
  return (await response.json()) as PluginsResponse;
}

export function isHostOffline(host: HostPresence, ttlMs: number, nowMs = Date.now()): boolean {
  return host.stale || nowMs - host.lastSeenMs > ttlMs;
}
