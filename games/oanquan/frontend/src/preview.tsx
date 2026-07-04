// Throwaway visual harness: mounts GameCanvas with the authoritative INITIAL board
// (5 dân per pit, 1 quan per quan pit) so the scene can be screenshotted without a
// server. Not part of the production build.
import ReactDOM from 'react-dom/client';
import { GameCanvas } from './scene/GameCanvas';
import './style.css';

const initialBoard = {
  //          0  1  2  3  4  Q5  6  7  8  9 10  Q11
  pitStones: [5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5, 0],
  quanPieces: [1, 1],
  scores: [
    { playerId: 1, seat: 0, capturedDan: 0, capturedQuan: 0, points: 0 },
    { playerId: 2, seat: 1, capturedDan: 0, capturedQuan: 0, points: 0 },
  ],
  currentPlayerId: 1,
  gameOver: false,
  turnTicksRemaining: 1800,
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GameCanvas
    selfPlayerId={1}
    onReady={(api) => api.pushBoard(initialBoard)}
    sendMove={() => {}}
  />,
);
