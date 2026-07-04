import type { FairModeConfig } from './types';

export const DEFAULT_FAIR_MODE: FairModeConfig = {
  enabled: false,
  battle: false,
  levelId: 'easy-mine',
  timeLimit: 90,
};

export type RoomSetupMode = 'free' | 'fair' | 'battle';

export function getRoomSetupMode(fairMode: FairModeConfig = DEFAULT_FAIR_MODE): RoomSetupMode {
  if (!fairMode.enabled) return 'free';
  if (fairMode.battle) return 'battle';
  return 'fair';
}
