export const GARAGE_STORAGE_KEY = 'f1racing:garage';
export const SETTINGS_STORAGE_KEY = 'f1racing:settings';

export interface GarageLoadout {
  carId: string;
  primaryColor: string;
  liveryId?: string;
  wheelId?: string;
  nitroFxId?: string;
}

export const DEFAULT_GARAGE_LOADOUT: GarageLoadout = {
  carId: 'formula-modern',
  primaryColor: '#e10600',
  liveryId: 'solid',
  wheelId: 'standard',
  nitroFxId: 'blue',
};

export interface RoomSummary {
  roomId: string;
  playerCount: number;
  maxPlayers: number;
  hostName: string;
  trackId: string;
}

export interface LobbyPlayerView {
  id: string;
  name: string;
  ready: boolean;
  host: boolean;
}

export interface RoomConfigView {
  trackId: string;
  trackDisplayName: string;
  lapCount: number;
  maxPlayers: number;
  enableQualifying: boolean;
  qualifyingDurationSec: number;
  collisionOn: boolean;
}

export { TRACKS, DEFAULT_TRACK_ID } from './tracks';
export * from './roomIds';
export * from './raceTypes';
export * from './solo';
