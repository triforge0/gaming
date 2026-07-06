import type { ChallengeState } from './types';
import { countUnplacedItems } from './autoArrange';

export interface SetupUiState {
  canEdit: boolean;
  myLocked: boolean;
  oppLocked: boolean;
  waitingForOpponent: boolean;
  bothReady: boolean;
  canLock: boolean;
  unplacedCount: number;
  allPlaced: boolean;
}

export function getSetupUiState(
  myDesign: ChallengeState | null,
  oppDesign: ChallengeState | null,
): SetupUiState {
  if (!myDesign) {
    return {
      canEdit: false,
      myLocked: false,
      oppLocked: false,
      waitingForOpponent: false,
      bothReady: false,
      canLock: false,
      unplacedCount: 0,
      allPlaced: false,
    };
  }

  const unplacedCount = countUnplacedItems(myDesign.items);
  const myLocked = myDesign.setupLocked;
  const oppLocked = oppDesign?.setupLocked ?? false;

  return {
    canEdit: !myLocked,
    myLocked,
    oppLocked,
    waitingForOpponent: myLocked && !oppLocked,
    bothReady: myLocked && oppLocked,
    canLock: unplacedCount === 0 && !myLocked,
    unplacedCount,
    allPlaced: unplacedCount === 0,
  };
}
