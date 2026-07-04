import { useEffect } from 'react';
import { moveSelection } from '../core/navigation';
import { useGame } from '../state/store';

const ARROWS: Record<string, [number, number]> = {
  ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1],
};

export function useKeyboard(resetCamera: () => void): void {
  useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      const s = useGame.getState();
      if (e.key === ' ') { e.preventDefault(); s.togglePause(); return; }
      if (s.status !== 'playing') return;

      if (e.key >= '1' && e.key <= '4') { s.fill(Number(e.key)); return; }
      if (e.key === 'h' || e.key === 'H') { s.hint(); return; }
      if (e.key === 'u' || e.key === 'U' || ((e.ctrlKey || e.metaKey) && e.key === 'z')) {
        e.preventDefault(); s.undo(); return;
      }
      if (e.key === 'r' || e.key === 'R') { resetCamera(); return; }
      if (e.key === 'Backspace' || e.key === 'Delete') { s.clearCell(); return; }
      const arrow = ARROWS[e.key];
      if (arrow) {
        e.preventDefault();
        const from = s.selected ?? 0;
        s.select(moveSelection(from, arrow[0], arrow[1]));
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [resetCamera]);
}
