import { LEVELS } from './levels';

const LEVEL_IDS = new Set(LEVELS.map((l) => l.id));

/** Full engine room id, e.g. bugminer:easy-mine:CRAZY-CODE-40 */
export function resolveBugMinerRoomId(input: string, defaultLevelId = 'easy-mine'): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  const lower = trimmed.toLowerCase();
  if (lower.startsWith('bugminer:')) {
    const parts = trimmed.split(':');
    if (parts.length >= 3) {
      const levelId = parts[1].toLowerCase();
      const code = parts.slice(2).join(':').toUpperCase();
      return `bugminer:${LEVEL_IDS.has(levelId) ? levelId : defaultLevelId}:${code}`;
    }
    return trimmed;
  }

  const parts = trimmed.split(':');
  if (parts.length >= 2 && LEVEL_IDS.has(parts[0].toLowerCase())) {
    const levelId = parts[0].toLowerCase();
    const code = parts.slice(1).join(':').toUpperCase();
    return `bugminer:${levelId}:${code}`;
  }

  return `bugminer:${defaultLevelId}:${trimmed.toUpperCase()}`;
}

/** Short join code shown in lobby / copy-paste, e.g. CRAZY-CODE-40 */
export function formatJoinCode(fullRoomId: string): string {
  if (!fullRoomId.startsWith('bugminer:')) {
    return fullRoomId.toUpperCase();
  }
  const parts = fullRoomId.split(':');
  if (parts.length >= 3) {
    return parts.slice(2).join(':').toUpperCase();
  }
  if (parts.length === 2) {
    return parts[1].toUpperCase();
  }
  return fullRoomId;
}

export function formatRoomLevelLabel(fullRoomId: string): string | null {
  if (!fullRoomId.startsWith('bugminer:')) return null;
  const parts = fullRoomId.split(':');
  if (parts.length < 2) return null;
  const level = LEVELS.find((l) => l.id === parts[1]);
  return level?.name ?? parts[1];
}
