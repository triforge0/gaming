import cityLoop from '../assets/tracks/city-loop.json';
import forestLake from '../assets/tracks/forest-lake.json';

export interface TrackPoint {
  x: number;
  y: number;
  z: number;
}

export interface TrackDefinition {
  id: string;
  displayName: string;
  trackWidth: number;
  centerline: TrackPoint[];
}

const TRACKS: Record<string, TrackDefinition> = {
  'city-loop': cityLoop as TrackDefinition,
  'forest-lake': forestLake as TrackDefinition,
};

export function loadTrackDefinition(trackId: string): TrackDefinition {
  return TRACKS[trackId] ?? TRACKS['city-loop'];
}
