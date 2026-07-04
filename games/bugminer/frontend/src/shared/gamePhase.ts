import type { BattleArenaState, FairModeConfig, GamePhase } from './types';

export interface ChallengePhaseInput {
  setupLocked?: boolean;
  finished?: boolean;
  endReason?: string | null;
}

export function resolveGamePhase(
  fairMode: FairModeConfig,
  battle: BattleArenaState | null,
  forPlayerA: ChallengePhaseInput | null | undefined,
  forPlayerB: ChallengePhaseInput | null | undefined,
  countdown = 0,
  paused = false,
  winnerId: string | null = null,
): GamePhase {
  if (winnerId) return 'finished';

  if (fairMode.battle && battle) {
    if (battle.finished) return 'finished';
    if (countdown > 0) return 'countdown';
    if (paused) return 'paused';
    return 'playing';
  }

  const decisive = (c: ChallengePhaseInput | null | undefined) =>
    c?.finished && (c.endReason === 'target' || c.endReason === 'poison');

  if (decisive(forPlayerA) || decisive(forPlayerB)) return 'finished';

  if (fairMode.enabled && !fairMode.battle) {
    if (forPlayerA?.setupLocked && forPlayerB?.setupLocked) {
      if (forPlayerA.finished && forPlayerB.finished) return 'finished';
      if (countdown > 0) return 'countdown';
      if (paused) return 'paused';
      return 'playing';
    }
    return 'dual_setup';
  }

  if (!forPlayerA?.setupLocked || !forPlayerB?.setupLocked) return 'dual_setup';
  if (forPlayerA.finished && forPlayerB.finished) return 'finished';
  if (countdown > 0) return 'countdown';
  if (paused) return 'paused';
  return 'playing';
}
