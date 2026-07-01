import { SpawnRegion, Team, TeamValue, SpawnRegionValue } from '@triforge/shared-ui';

/** Tank fill / UI accent per team. Self is outlined separately so allies stay distinguishable. */
export const TEAM_COLOR: Record<number, number> = {
  [Team.TEAM_NONE]: 0x9aa0a6,
  [Team.TEAM_RED]: 0xe5484d,
  [Team.TEAM_BLUE]: 0x3b82f6,
};

export const TEAM_CSS: Record<number, string> = {
  [Team.TEAM_NONE]: '#9aa0a6',
  [Team.TEAM_RED]: '#e5484d',
  [Team.TEAM_BLUE]: '#3b82f6',
};

export function teamLabel(team: TeamValue | number | null | undefined): string {
  switch (team) {
    case Team.TEAM_RED:
      return 'Red';
    case Team.TEAM_BLUE:
      return 'Blue';
    default:
      return 'Unassigned';
  }
}

/** Map labels match the lobby spawn picker (4 corners). */
export const SPAWN_LABEL: Record<number, string> = {
  [SpawnRegion.REGION_UNSPECIFIED]: '—',
  [SpawnRegion.TOP_LEFT]: 'A',
  [SpawnRegion.TOP_RIGHT]: 'B',
  [SpawnRegion.BOTTOM_LEFT]: 'C',
  [SpawnRegion.BOTTOM_RIGHT]: 'D',
};

export const SPAWN_OPTIONS: { region: SpawnRegionValue; label: string }[] = [
  { region: SpawnRegion.TOP_LEFT, label: 'A' },
  { region: SpawnRegion.TOP_RIGHT, label: 'B' },
  { region: SpawnRegion.BOTTOM_LEFT, label: 'C' },
  { region: SpawnRegion.BOTTOM_RIGHT, label: 'D' },
];

export const RED_CORNER_OPTIONS = SPAWN_OPTIONS.filter(
  (opt) => opt.region === SpawnRegion.TOP_LEFT || opt.region === SpawnRegion.BOTTOM_LEFT,
);

export const BLUE_CORNER_OPTIONS = SPAWN_OPTIONS.filter(
  (opt) => opt.region === SpawnRegion.TOP_RIGHT || opt.region === SpawnRegion.BOTTOM_RIGHT,
);

export function formatClock(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
