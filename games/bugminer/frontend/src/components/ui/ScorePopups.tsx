import { ITEM_DEFINITIONS } from '../../shared';
import { useGameStore } from '../../store/gameStore';

export default function ScorePopups() {
  const collections = useGameStore((s) => s.collections);

  return (
    <>
      {collections.slice(-3).map((c, i) => (
        <div
          key={c.id}
          className="score-popup"
          style={{
            left: `${40 + i * 20}%`,
            top: `${30 + i * 5}%`,
            color: ITEM_DEFINITIONS[c.type]?.color ?? '#ffd700',
          }}
        >
          +{c.value} {ITEM_DEFINITIONS[c.type]?.emoji}
        </div>
      ))}
    </>
  );
}
