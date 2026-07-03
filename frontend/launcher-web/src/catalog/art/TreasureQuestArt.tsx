import { useId } from 'react';

export function TreasureQuestArt() {
  const uid = useId().replace(/:/g, '');
  const bgId = `tq-bg-${uid}`;
  const glowId = `tq-glow-${uid}`;
  const chestId = `tq-chest-${uid}`;
  return (
    <svg viewBox="0 0 400 200" className="key-art" role="img" aria-label="Treasure Quest" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a2c14" />
          <stop offset="1" stopColor="#0e1420" />
        </linearGradient>
        <radialGradient id={glowId} cx="0.7" cy="0.25" r="0.7">
          <stop offset="0" stopColor="#f0b866" stopOpacity="0.3" />
          <stop offset="1" stopColor="#f0b866" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={chestId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a6430" />
          <stop offset="1" stopColor="#5f421c" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill={`url(#${bgId})`} />
      <rect width="400" height="200" fill={`url(#${glowId})`} className="art-pulse" />
      <g>
        <rect x="140" y="96" width="100" height="52" rx="8" fill={`url(#${chestId})`} />
        <path d="M140 104 q50 -34 100 0 v10 h-100 z" fill="#a87c3c" />
        <rect x="182" y="104" width="16" height="20" rx="3" fill="#f0b866" />
        <circle cx="190" cy="118" r="3" fill="#5f421c" />
      </g>
      <circle cx="150" cy="78" r="5" fill="#f0b866" className="art-float" />
      <circle cx="252" cy="70" r="4" fill="#f0d066" className="art-float" />
      <text x="24" y="182" className="art-title" fill="#eef0ff">TREASURE QUEST</text>
    </svg>
  );
}
