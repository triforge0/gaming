import {
  toNum,
  type IF1QualifyingResult,
  type IF1RaceResult,
  type IF1RaceState,
  type IF1StandingUpdate,
} from '@triforge/shared-ui';

type StandingProto = NonNullable<IF1StandingUpdate['entries']>[number];
type QualifyingProto = NonNullable<IF1QualifyingResult['entries']>[number];

export interface StandingEntryView {
  playerId: string;
  displayName: string;
  position: number;
  lap: number;
  bestLapMs: number;
  lastLapMs: number;
  totalTimeMs: number;
  finished: boolean;
  isBot: boolean;
}

export interface QualifyingEntryView {
  playerId: string;
  displayName: string;
  gridSlot: number;
  bestLapMs: number;
  isBot: boolean;
}

export interface RaceResultView {
  finalStandings: StandingEntryView[];
  qualifyingGrid: QualifyingEntryView[];
  raceDurationMs: number;
  abortReason: number;
  replayFileName: string;
}

export interface RaceStateView {
  lapCount: number;
  sessionPhase: number;
  sessionRemainingMs: number;
  raceStarted: boolean;
}

export interface LiveTelemetry {
  speed: number;
  gear: number;
  nitro: number;
  currentLap: number;
  racePosition: number;
}

export function mapRaceState(proto: IF1RaceState): RaceStateView {
  return {
    lapCount: proto.lapCount ?? 3,
    sessionPhase: proto.sessionPhase ?? 0,
    sessionRemainingMs: toNum(proto.sessionRemainingMs),
    raceStarted: proto.raceStarted ?? false,
  };
}

export function mapStandingEntry(entry: StandingProto): StandingEntryView {
  return {
    playerId: String(toNum(entry.playerId)),
    displayName: entry.displayName || 'Driver',
    position: entry.position ?? 0,
    lap: entry.lap ?? 0,
    bestLapMs: toNum(entry.bestLapMs),
    lastLapMs: toNum(entry.lastLapMs),
    totalTimeMs: toNum(entry.totalTimeMs),
    finished: entry.finished ?? false,
    isBot: entry.isBot ?? false,
  };
}

export function mapQualifyingEntry(entry: QualifyingProto): QualifyingEntryView {
  return {
    playerId: String(toNum(entry.playerId)),
    displayName: entry.displayName || 'Driver',
    gridSlot: entry.gridSlot ?? 0,
    bestLapMs: toNum(entry.bestLapMs),
    isBot: entry.isBot ?? false,
  };
}

export function mapRaceResult(result: IF1RaceResult): RaceResultView {
  return {
    finalStandings: (result.finalStandings ?? []).map(mapStandingEntry),
    qualifyingGrid: (result.qualifyingGrid ?? []).map(mapQualifyingEntry),
    raceDurationMs: toNum(result.raceDurationMs),
    abortReason: result.abortReason ?? 0,
    replayFileName: result.replayFileName ?? '',
  };
}

export function formatLapTime(ms: number): string {
  if (ms <= 0) return '—';
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;
  return minutes > 0
    ? `${minutes}:${seconds.toFixed(3).padStart(6, '0')}`
    : seconds.toFixed(3);
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/** F1SessionPhase numeric values from proto. */
export const F1SessionPhase = {
  LOBBY: 0,
  QUALIFYING: 1,
  RACE: 2,
} as const;

/** F1AbortReason numeric values from proto. */
export const F1AbortReason = {
  NONE: 0,
  HOST_DISCONNECTED: 1,
  TIME_CAP: 2,
} as const;

export const F1CollisionMode = {
  ON: 0,
  OFF: 1,
} as const;
