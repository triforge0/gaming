import { REPLAY_STORAGE_KEY, type ReplayDocument } from './types';

export function readCachedReplay(): ReplayDocument | null {
  try {
    const raw = localStorage.getItem(REPLAY_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ReplayDocument;
  } catch {
    return null;
  }
}

export function writeCachedReplay(document: ReplayDocument): void {
  localStorage.setItem(REPLAY_STORAGE_KEY, JSON.stringify(document));
}

export async function fetchLastReplay(): Promise<ReplayDocument | null> {
  try {
    const response = await fetch('/api/f1/replays/last');
    if (!response.ok) return null;
    const document = await response.json() as ReplayDocument;
    if (document?.frames?.length) {
      writeCachedReplay(document);
    }
    return document;
  } catch {
    return null;
  }
}
