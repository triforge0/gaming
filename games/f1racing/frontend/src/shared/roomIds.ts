import { TRACKS } from './tracks';

const TRACK_IDS = new Set(TRACKS.map((track) => track.id));

/** Full engine room id, e.g. f1racing:city-loop:FAST-DEV-42 */
export function resolveF1RoomId(input: string, defaultTrackId = 'city-loop'): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  const lower = trimmed.toLowerCase();
  if (lower.startsWith('f1racing:sp:')) {
    return trimmed;
  }

  if (lower.startsWith('f1racing:')) {
    const parts = trimmed.split(':');
    if (parts.length >= 3) {
      const trackId = parts[1].toLowerCase();
      const code = parts.slice(2).join(':').toUpperCase();
      return `f1racing:${TRACK_IDS.has(trackId) ? trackId : defaultTrackId}:${code}`;
    }
    return trimmed;
  }

  const parts = trimmed.split(':');
  if (parts.length >= 2 && TRACK_IDS.has(parts[0].toLowerCase())) {
    const trackId = parts[0].toLowerCase();
    const code = parts.slice(1).join(':').toUpperCase();
    return `f1racing:${trackId}:${code}`;
  }

  return `f1racing:${defaultTrackId}:${trimmed.toUpperCase()}`;
}

/** Short join code for lobby / share link, e.g. city-loop:FAST-DEV-42 */
export function formatJoinCode(fullRoomId: string): string {
  if (!fullRoomId.startsWith('f1racing:')) {
    return fullRoomId.toUpperCase();
  }
  const parts = fullRoomId.split(':');
  if (parts.length >= 3) {
    return `${parts[1]}:${parts.slice(2).join(':').toUpperCase()}`;
  }
  if (parts.length === 2) {
    return parts[1].toUpperCase();
  }
  return fullRoomId;
}

export function formatTrackLabel(fullRoomId: string): string | null {
  if (!fullRoomId.startsWith('f1racing:')) return null;
  const parts = fullRoomId.split(':');
  if (parts.length < 2) return null;
  const track = TRACKS.find((entry) => entry.id === parts[1]);
  return track?.name ?? parts[1];
}

export function buildShareUrl(fullRoomId: string): string {
  const joinCode = formatJoinCode(fullRoomId);
  const url = new URL(window.location.href);
  url.searchParams.set('room', joinCode);
  return url.toString();
}

export function generateRoomCode(): string {
  const ADJECTIVES = ['FAST', 'RED', 'WILD', 'PRO', 'TURBO', 'DRIFT', 'POLE', 'GRID'];
  const NOUNS = ['DEV', 'LAP', 'WING', 'PIT', 'RACE', 'TEAM', 'CAR', 'F1'];
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adj}-${noun}-${num}`;
}
