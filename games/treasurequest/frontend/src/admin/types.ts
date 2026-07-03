export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  points: number;
  timeLimitSec: number;
}

export interface QuizSet {
  id: string;
  passThreshold: number;
  questions: QuizQuestion[];
}

export interface QuizFile {
  quizzes: QuizSet[];
}

export interface ExpeditionConfigJson {
  encounterRadiusTiles?: number;
  stealPct?: number;
  pvpCooldownSecs?: number;
  stealImmunitySecs?: number;
  shieldSecs?: number;
  duelQuestionCount?: number;
  duelTimeLimitSecs?: number;
  treasureLockSecs?: number;
  powerKnowledgeWeight?: number;
}

export interface RectDef {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CheckpointReward {
  points: number;
  item: string | null;
}

export interface CheckpointDef {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  quizId: string;
  next: string[];
  isBoss: boolean;
  risk: string;
  hint: string;
  reward: CheckpointReward;
}

export interface CheckpointOverlay {
  width: number;
  height: number;
  tileSize: number;
  start: string;
  checkpoints: CheckpointDef[];
  treasure: RectDef;
}
