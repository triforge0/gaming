export interface RoomSummaryDto {
  roomId?: string;
  roomName?: string;
  playerCount?: number;
  maxPlayers?: number;
  gamePluginId?: string;
  gameDisplayName?: string;
}

export interface RoomsResponseDto {
  rooms?: RoomSummaryDto[];
}

const TIMEOUT_MS = 3000;

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export function fetchRooms(): Promise<RoomsResponseDto> {
  return fetchJson<RoomsResponseDto>('/api/lobby/rooms');
}
