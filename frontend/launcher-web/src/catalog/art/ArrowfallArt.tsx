import { useId } from 'react';

export function ArrowfallArt() {
  const uid = useId().replace(/:/g, '');
  const bgId = `af-bg-${uid}`;
  const fireId = `af-fire-${uid}`;
  const lightningId = `af-lightning-${uid}`;
  const frostId = `af-frost-${uid}`;
  
  return (
    <svg viewBox="0 0 400 200" className="key-art" role="img" aria-label="Arrowfall: Endless Siege" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1e1b4b" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <radialGradient id={fireId} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ef4444" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={lightningId} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fde047" stopOpacity="0.8" />
          <stop offset="1" stopColor="#fde047" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={frostId} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#60a5fa" stopOpacity="0.8" />
          <stop offset="1" stopColor="#60a5fa" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Background layer */}
      <rect width="400" height="200" fill={`url(#${bgId})`} />
      
      {/* Moon/Shattered Sky */}
      <circle cx="320" cy="50" r="40" fill="#f8fafc" opacity="0.1" className="art-pulse" />
      <path d="M300 20 L310 40 L340 30 L320 60 L330 80 L300 60 Z" fill="#94a3b8" opacity="0.2" />

      {/* Archer Silhouette */}
      <g transform="translate(60, 100)" className="art-float">
        <path d="M 0 30 Q -10 10 0 0 Q 10 -10 20 0 L 25 10 L 15 25 Z" fill="#cbd5e1" />
        {/* Bow */}
        <path d="M 15 -15 Q 35 15 15 45" stroke="#f1f5f9" strokeWidth="3" fill="none" />
        <path d="M 15 -15 L 15 45" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
      </g>
      
      {/* Arrows (Fire, Frost, Lightning) */}
      <g transform="translate(110, 115)">
        <rect x="0" y="-15" width="60" height="4" fill="#ef4444" />
        <circle cx="65" cy="-13" r="15" fill={`url(#${fireId})`} className="art-pulse" />
        
        <rect x="20" y="0" width="70" height="3" fill="#fde047" />
        <circle cx="95" cy="1" r="15" fill={`url(#${lightningId})`} className="art-pulse" />
        
        <rect x="10" y="15" width="50" height="3" fill="#60a5fa" />
        <circle cx="65" cy="16" r="15" fill={`url(#${frostId})`} className="art-pulse" />
      </g>
      
      {/* Horde Silhouette */}
      <g opacity="0.4" transform="translate(280, 130)">
        {/* Slime */}
        <path d="M 0 20 Q 10 0 20 20 Z" fill="#a3e635" />
        {/* Cursed Knight */}
        <rect x="40" y="-20" width="15" height="40" rx="3" fill="#64748b" />
        <circle cx="47" cy="-25" r="8" fill="#475569" />
        <path d="M 30 -5 L 45 -20" stroke="#94a3b8" strokeWidth="2" />
        {/* Beast */}
        <path d="M 70 20 L 75 0 L 90 0 L 95 20 Z" fill="#84cc16" />
      </g>

      <text x="24" y="182" className="art-title" fill="#eef0ff">ARROWFALL</text>
    </svg>
  );
}
