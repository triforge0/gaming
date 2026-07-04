import { generatePuzzle, type Difficulty } from './generator';

self.onmessage = (e: MessageEvent<{ difficulty: Difficulty; seed: number }>) => {
  self.postMessage(generatePuzzle(e.data.difficulty, e.data.seed));
};
