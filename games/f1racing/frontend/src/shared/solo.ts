import { generateRoomCode } from './roomIds';

export type SinglePlayerMode = 'practice' | 'trial' | 'bots';

export interface SinglePlayerModeSpec {
  id: SinglePlayerMode;
  title: string;
  description: string;
}

export const SINGLE_PLAYER_MODES: SinglePlayerModeSpec[] = [
  {
    id: 'practice',
    title: 'Practice',
    description: 'Free drive · no bots · no session timer',
  },
  {
    id: 'trial',
    title: 'Time Trial',
    description: '10-minute session · best lap counts',
  },
  {
    id: 'bots',
    title: 'Race vs Bots',
    description: '3-lap race against 3 AI drivers',
  },
];

/** Full room id for solo sessions, e.g. f1racing:sp:practice:city-loop:CODE */
export function buildSoloRoomId(mode: SinglePlayerMode, trackId: string): string {
  return `f1racing:sp:${mode}:${trackId}:${generateRoomCode()}`;
}

export function isSoloRoomId(roomId: string | null | undefined): boolean {
  return Boolean(roomId?.startsWith('f1racing:sp:'));
}

export function soloModeLabel(roomId: string | null | undefined): string | null {
  if (!isSoloRoomId(roomId)) return null;
  const mode = roomId!.split(':')[2];
  return SINGLE_PLAYER_MODES.find((entry) => entry.id === mode)?.title ?? mode;
}
