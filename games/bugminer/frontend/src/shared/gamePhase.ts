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
): GamePhase {
  if (fairMode.battle && battle) {
    return battle.finished ? 'finished' : 'playing';
  }

  if (fairMode.enabled && !fairMode.battle) {
    if (forPlayerA?.setupLocked && forPlayerB?.setupLocked) {
      if (forPlayerA.finished && forPlayerB.finished) return 'finished';
      return 'playing';
    }
    return 'dual_setup';
  }

  if (!forPlayerA?.setupLocked || !forPlayerB?.setupLocked) return 'dual_setup';
  if (forPlayerA.finished && forPlayerB.finished) return 'finished';
  return 'playing';
}
