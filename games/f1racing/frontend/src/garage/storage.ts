import {
  DEFAULT_GARAGE_LOADOUT,
  GARAGE_STORAGE_KEY,
  type GarageLoadout,
} from '../shared';
import { normalizeGarageLoadout } from './catalog';

export function readGarageLoadout(): GarageLoadout {
  try {
    const raw = localStorage.getItem(GARAGE_STORAGE_KEY);
    if (!raw) return normalizeGarageLoadout(DEFAULT_GARAGE_LOADOUT);
    return normalizeGarageLoadout(JSON.parse(raw) as Partial<GarageLoadout>);
  } catch {
    return normalizeGarageLoadout(DEFAULT_GARAGE_LOADOUT);
  }
}

export function writeGarageLoadout(loadout: GarageLoadout): void {
  localStorage.setItem(GARAGE_STORAGE_KEY, JSON.stringify(normalizeGarageLoadout(loadout)));
}
