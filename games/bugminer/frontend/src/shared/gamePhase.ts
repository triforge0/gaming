import type { BattleArenaState, FairModeConfig, GamePhase } from './types';

export interface ChallengePhaseInput {
  setupLocked?: boolean;
  finished?: boolean;
}

export function resolveGamePhase(
  fairMode: FairModeConfig,
  battle: BattleArenaState | null,
  forPlayerA: ChallengePhaseInput | null | undefined,
  forPlayerB: ChallengePhaseInput | null | undefined,
  countdown = 0,
): GamePhase {
  if (fairMode.battle && battle) {
    if (battle.finished) return 'finished';
    if (countdown > 0) return 'countdown';
    return 'playing';
  }

  if (fairMode.enabled && !fairMode.battle) {
    if (forPlayerA?.setupLocked && forPlayerB?.setupLocked) {
      if (forPlayerA.finished && forPlayerB.finished) return 'finished';
      if (countdown > 0) return 'countdown';
      return 'playing';
    }
    return 'dual_setup';
  }

  if (!forPlayerA?.setupLocked || !forPlayerB?.setupLocked) return 'dual_setup';
  if (forPlayerA.finished && forPlayerB.finished) return 'finished';
  if (countdown > 0) return 'countdown';
  return 'playing';
}
