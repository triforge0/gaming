// src/skins.ts
import type { SkinId } from './core/achievements';

export interface SkinPreset {
  id: SkinId; name: string; icon: string; unlockLabel: string;
  background: string; cellColor: string; coreColor: string;
  lightTints: [string, string, string, string];
  givenText: string; playerText: string;
  correct: string; wrong: string; select: string;
  lockA: string; lockB: string; particle: string;
}

export const SKINS: Record<SkinId, SkinPreset> = {
  sakura: {
    id: 'sakura', name: 'Sakura', icon: '🌸', unlockLabel: 'Mặc định',
    background: '#0f172a', cellColor: '#ffffff', coreColor: '#1e293b',
    lightTints: ['#ff9999', '#99ff99', '#9999ff', '#ffff99'],
    givenText: '#1e293b', playerText: '#3b82f6',
    correct: '#22c55e', wrong: '#ef4444', select: '#f59e0b',
    lockA: '#c4b5fd', lockB: '#a5f3fc', particle: '#fda4af',
  },
  ice: {
    id: 'ice', name: 'Ice Crystal', icon: '❄️', unlockLabel: 'Hoàn thành 10 cube',
    background: '#0c1b2a', cellColor: '#e0f2fe', coreColor: '#0e2a3f',
    lightTints: ['#7dd3fc', '#a5f3fc', '#bae6fd', '#e0f2fe'],
    givenText: '#0c4a6e', playerText: '#0284c7',
    correct: '#2dd4bf', wrong: '#f87171', select: '#fbbf24',
    lockA: '#bae6fd', lockB: '#99f6e4', particle: '#7dd3fc',
  },
  magma: {
    id: 'magma', name: 'Magma', icon: '🔥', unlockLabel: '25 cube Hard trở lên',
    background: '#1c1210', cellColor: '#fde8d7', coreColor: '#3b1a12',
    lightTints: ['#fb923c', '#f97316', '#fbbf24', '#ef4444'],
    givenText: '#431407', playerText: '#ea580c',
    correct: '#facc15', wrong: '#dc2626', select: '#fb923c',
    lockA: '#fdba74', lockB: '#fde047', particle: '#fb923c',
  },
  galaxy: {
    id: 'galaxy', name: 'Galaxy', icon: '🌌', unlockLabel: 'Hoàn thành 50 cube',
    background: '#0b0a1e', cellColor: '#ede9fe', coreColor: '#1e1b4b',
    lightTints: ['#a78bfa', '#818cf8', '#f472b6', '#38bdf8'],
    givenText: '#312e81', playerText: '#8b5cf6',
    correct: '#34d399', wrong: '#fb7185', select: '#fbbf24',
    lockA: '#c4b5fd', lockB: '#f0abfc', particle: '#a78bfa',
  },
  neon: {
    id: 'neon', name: 'Neon', icon: '⚡', unlockLabel: 'Thắng 1 ván Expert',
    background: '#09090b', cellColor: '#18181b', coreColor: '#010102',
    lightTints: ['#22d3ee', '#a3e635', '#e879f9', '#f472b6'],
    givenText: '#a1a1aa', playerText: '#22d3ee',
    correct: '#a3e635', wrong: '#f43f5e', select: '#e879f9',
    lockA: '#22d3ee', lockB: '#a3e635', particle: '#e879f9',
  },
  holiday: {
    id: 'holiday', name: 'Holiday', icon: '🎄', unlockLabel: 'Thắng 1 ván mùa lễ hội',
    background: '#101c14', cellColor: '#fefce8', coreColor: '#14532d',
    lightTints: ['#f87171', '#4ade80', '#fbbf24', '#f0fdf4'],
    givenText: '#14532d', playerText: '#b91c1c',
    correct: '#4ade80', wrong: '#f87171', select: '#fbbf24',
    lockA: '#bbf7d0', lockB: '#fecaca', particle: '#fbbf24',
  },
};
