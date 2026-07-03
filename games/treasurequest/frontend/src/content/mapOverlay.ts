/** Checkpoint + treasure zones for the seed map (mirrors maps/quest-village.json). */
export interface MapZone {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  boss?: boolean;
}

export interface QuestMapOverlay {
  checkpoints: MapZone[];
  treasure: MapZone;
}

export const QUEST_VILLAGE_OVERLAY: QuestMapOverlay = {
  checkpoints: [
    { id: 'cp1', x: 2, y: 6, w: 2, h: 2 },
    { id: 'cp2a', x: 8, y: 2, w: 2, h: 2 },
    { id: 'cp2b', x: 8, y: 11, w: 2, h: 2 },
    { id: 'cp3', x: 13, y: 6, w: 2, h: 2 },
    { id: 'boss', x: 16, y: 6, w: 2, h: 2, boss: true },
  ],
  treasure: { id: 'treasure', x: 16, y: 11, w: 2, h: 2 },
};
