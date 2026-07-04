import type { CatalogEntry } from './types';
import { TankArenaArt } from './art/TankArenaArt';
import { TreasureQuestArt } from './art/TreasureQuestArt';
import { OAnQuanArt } from './art/OAnQuanArt';
import { UtilityArt, EducationArt, ArcadeArt } from './art/PlaceholderArt';
import { SudokuCubeArt } from './art/SudokuCubeArt';

export const REGISTRY: CatalogEntry[] = [
  {
    id: 'tankarena',
    title: 'Tank Arena',
    description: 'Bắn tăng LAN kiểu Battle City — 4–16 người, 3D, host authoritative.',
    category: 'game',
    path: '/games/tankarena/',
    accent: '#7ee29b',
    pluginId: 'tankarena',
    Art: TankArenaArt,
  },
  {
    id: 'treasurequest',
    title: 'Treasure Quest',
    description: 'Thám hiểm giáo dục — quiz checkpoint, đường đi phân nhánh, kho báu chung.',
    category: 'game',
    path: '/games/treasurequest/',
    accent: '#f0b866',
    pluginId: 'treasurequest',
    Art: TreasureQuestArt,
  },
  {
    id: 'oanquan',
    title: 'Ô ăn quan',
    description: 'Ô ăn quan dân gian — cờ 2 người theo lượt trên bàn 3D.',
    category: 'game',
    path: '/games/oanquan/',
    accent: '#6ee2d6',
    pluginId: 'oanquan',
    Art: OAnQuanArt,
  },
  {
    id: 'sudokucube',
    title: 'Mini Sudoku Cube',
    description: 'Sudoku 4x4 trên 6 mặt khối lập phương 3D.',
    category: 'game',
    path: '/games/sudokucube/',
    accent: '#3b82f6',
    pluginId: 'sudokucube',
    Art: SudokuCubeArt,
  },
  {
    id: 'scoreboard',
    title: 'Bảng điểm',
    description: 'Bảng điểm chung cho cả buổi chơi cùng nhau.',
    category: 'utility',
    path: '/apps/scoreboard/',
    accent: '#6c8cff',
    comingSoon: true,
    Art: UtilityArt,
  },
  {
    id: 'quiz',
    title: 'Quiz nhanh',
    description: 'Câu đố nhanh cho gia đình và lớp học.',
    category: 'education',
    path: '/apps/quiz/',
    accent: '#9f6cff',
    comingSoon: true,
    Art: EducationArt,
  },
  {
    id: 'caro',
    title: 'Cờ caro',
    description: 'Cờ caro chạy ngay trên trình duyệt, không cần server.',
    category: 'arcade',
    path: '/apps/caro/',
    accent: '#ff7e9b',
    comingSoon: true,
    Art: ArcadeArt,
  },
];
