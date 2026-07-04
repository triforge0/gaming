// src/ui/Toasts.tsx
import { useEffect, useState } from 'react';
import { ACHIEVEMENTS } from '../core/achievements';
import { SKINS } from '../skins';
import { useGame } from '../state/store';

interface Toast { id: number; text: string }
let toastId = 0;

export function Toasts() {
  const summary = useGame((s) => s.winSummary);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (!summary) return;
    const texts = [
      ...summary.newAchievements.map((id) => {
        const a = ACHIEVEMENTS.find((x) => x.id === id)!;
        return `${a.icon} Badge mới: ${a.title}`;
      }),
      ...summary.newSkins.map((id) => `${SKINS[id].icon} Skin mới: ${SKINS[id].name}`),
    ];
    if (texts.length === 0) return;
    const items = texts.map((text) => ({ id: ++toastId, text }));
    setToasts((t) => [...t, ...items]);
    setTimeout(
      () => setToasts((t) => t.filter((x) => !items.includes(x))), 5000,
    );
  }, [summary]);

  return (
    <div className="toasts">
      {toasts.map((t) => <div key={t.id} className="toast">{t.text}</div>)}
    </div>
  );
}
