import type { ComponentType } from 'react';

export type Category = 'game' | 'utility' | 'education' | 'arcade';

export interface CatalogEntry {
  id: string;
  title: string;
  description: string;
  category: Category;
  path: string;
  /** Màu đặc trưng của entry, dùng cho glow/hover (CSS var --accent). */
  accent: string;
  /** Chỉ game plugin có — khoá merge dữ liệu live theo gamePluginId. */
  pluginId?: string;
  /** Placeholder: render mờ, không click được. */
  comingSoon?: boolean;
  Art: ComponentType;
}

export interface PluginLiveStats {
  rooms: number;
  players: number;
}

export interface LobbyStatus {
  online: boolean;
  totalPlayers: number;
  byPlugin: Record<string, PluginLiveStats>;
}

export const OFFLINE_STATUS: LobbyStatus = {
  online: false,
  totalPlayers: 0,
  byPlugin: {},
};
