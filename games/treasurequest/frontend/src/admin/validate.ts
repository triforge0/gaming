import type {
  CheckpointDef,
  CheckpointOverlay,
  ExpeditionConfigJson,
  QuizFile,
  QuizQuestion,
  QuizSet,
} from './types';

export function validateQuizzes(data: QuizFile): string[] {
  const errors: string[] = [];
  if (!data.quizzes?.length) {
    errors.push('At least one quiz is required.');
    return errors;
  }
  const ids = new Set<string>();
  for (const quiz of data.quizzes) {
    errors.push(...validateQuizSet(quiz, ids));
  }
  return errors;
}

function validateQuizSet(quiz: QuizSet, ids: Set<string>): string[] {
  const errors: string[] = [];
  const label = quiz.id || '(unnamed quiz)';
  if (!quiz.id?.trim()) {
    errors.push('Every quiz needs an id.');
  } else if (ids.has(quiz.id)) {
    errors.push(`Duplicate quiz id "${quiz.id}".`);
  } else {
    ids.add(quiz.id);
  }
  if (quiz.passThreshold < 0) {
    errors.push(`Quiz "${label}": passThreshold must be >= 0.`);
  }
  if (!quiz.questions?.length) {
    errors.push(`Quiz "${label}": at least one question is required.`);
    return errors;
  }
  const qIds = new Set<string>();
  for (const question of quiz.questions) {
    errors.push(...validateQuestion(question, label, qIds));
  }
  return errors;
}

function validateQuestion(question: QuizQuestion, quizId: string, ids: Set<string>): string[] {
  const errors: string[] = [];
  const label = `${quizId}/${question.id || '?'}`;
  if (!question.id?.trim()) {
    errors.push(`Question in "${quizId}" needs an id.`);
  } else if (ids.has(question.id)) {
    errors.push(`Duplicate question id "${question.id}" in quiz "${quizId}".`);
  } else {
    ids.add(question.id);
  }
  if (!question.text?.trim()) {
    errors.push(`Question "${label}": text is required.`);
  }
  if (!question.options || question.options.length < 2) {
    errors.push(`Question "${label}": at least two options are required.`);
  } else if (question.correctIndex < 0 || question.correctIndex >= question.options.length) {
    errors.push(`Question "${label}": correctIndex out of range.`);
  }
  if (question.points < 0) {
    errors.push(`Question "${label}": points must be >= 0.`);
  }
  if (question.timeLimitSec <= 0) {
    errors.push(`Question "${label}": timeLimitSec must be > 0.`);
  }
  return errors;
}

export function validateConfig(data: ExpeditionConfigJson): string[] {
  const errors: string[] = [];
  if (data.encounterRadiusTiles != null && data.encounterRadiusTiles <= 0) {
    errors.push('encounterRadiusTiles must be > 0.');
  }
  if (data.stealPct != null && (data.stealPct < 0 || data.stealPct > 1)) {
    errors.push('stealPct must be between 0 and 1.');
  }
  for (const field of [
    'pvpCooldownSecs',
    'stealImmunitySecs',
    'shieldSecs',
    'duelQuestionCount',
    'duelTimeLimitSecs',
    'treasureLockSecs',
  ] as const) {
    const value = data[field];
    if (value != null && value <= 0) {
      errors.push(`${field} must be > 0.`);
    }
  }
  if (data.powerKnowledgeWeight != null && (data.powerKnowledgeWeight < 0 || data.powerKnowledgeWeight > 1)) {
    errors.push('powerKnowledgeWeight must be between 0 and 1.');
  }
  return errors;
}

export function validateCheckpoints(data: CheckpointOverlay, quizIds: Set<string>): string[] {
  const errors: string[] = [];
  if (data.width <= 0 || data.height <= 0 || data.tileSize <= 0) {
    errors.push('Map dimensions must be positive.');
  }
  if (!data.start?.trim()) {
    errors.push('Start checkpoint id is required.');
  }
  if (!data.checkpoints?.length) {
    errors.push('At least one checkpoint is required.');
    return errors;
  }
  if (!data.treasure) {
    errors.push('Treasure zone is required.');
  }

  const ids = new Set<string>();
  let bossCount = 0;
  for (const cp of data.checkpoints) {
    errors.push(...validateCheckpoint(cp, data, quizIds, ids));
    if (cp.isBoss) {
      bossCount++;
    }
  }
  if (bossCount !== 1) {
    errors.push('Exactly one checkpoint must be marked as boss.');
  }
  if (data.start && !ids.has(data.start)) {
    errors.push(`Start checkpoint "${data.start}" was not found.`);
  }
  if (data.treasure) {
    errors.push(...validateRect(data.treasure, data, 'treasure'));
  }
  return errors;
}

function validateCheckpoint(
  cp: CheckpointDef,
  map: CheckpointOverlay,
  quizIds: Set<string>,
  ids: Set<string>,
): string[] {
  const errors: string[] = [];
  if (!cp.id?.trim()) {
    errors.push('Every checkpoint needs an id.');
    return errors;
  }
  if (ids.has(cp.id)) {
    errors.push(`Duplicate checkpoint id "${cp.id}".`);
  } else {
    ids.add(cp.id);
  }
  if (!quizIds.has(cp.quizId)) {
    errors.push(`Checkpoint "${cp.id}" references unknown quiz "${cp.quizId}".`);
  }
  errors.push(...validateRect(cp, map, cp.id));
  for (const nextId of cp.next ?? []) {
    if (!nextId.trim()) {
      errors.push(`Checkpoint "${cp.id}" has an empty next id.`);
    }
  }
  if (!cp.hint?.trim()) {
    errors.push(`Checkpoint "${cp.id}": hint text is recommended.`);
  }
  return errors;
}

function validateRect(
  rect: { x: number; y: number; w: number; h: number },
  map: CheckpointOverlay,
  label: string,
): string[] {
  const errors: string[] = [];
  if (rect.w <= 0 || rect.h <= 0) {
    errors.push(`Zone "${label}": width and height must be > 0.`);
  }
  if (rect.x < 0 || rect.y < 0 || rect.x + rect.w > map.width || rect.y + rect.h > map.height) {
    errors.push(`Zone "${label}" is outside the map bounds (${map.width}x${map.height}).`);
  }
  return errors;
}
