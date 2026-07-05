import { useId } from 'react';

export function TopdownAdventureArt() {
  const uid = useId().replace(/:/g, '');
  const bgId = `tda-bg-${uid}`;
  const grassId = `tda-grass-${uid}`;
  const charId = `tda-char-${uid}`;
  
  return (
    <svg viewBox="0 0 400 200" className="key-art" role="img" aria-label="Topdown Adventure" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a3b1a" />
          <stop offset="1" stopColor="#142218" />
        </linearGradient>
        <radialGradient id={grassId} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#4ade80" stopOpacity="0.25" />
          <stop offset="1" stopColor="#4ade80" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={charId} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1e3a8a" />
        </radialGradient>
      </defs>
      
      {/* Background layer */}
      <rect width="400" height="200" fill={`url(#${bgId})`} />
      <rect width="400" height="200" fill={`url(#${grassId})`} className="art-pulse" />
      
      {/* Terrain features - stylized topdown trees */}
      <circle cx="60" cy="50" r="30" fill="#166534" opacity="0.8" />
      <circle cx="50" cy="60" r="20" fill="#15803d" />
      
      <circle cx="340" cy="140" r="40" fill="#166534" opacity="0.8" />
      <circle cx="350" cy="130" r="25" fill="#15803d" />
      
      <circle cx="310" cy="40" r="25" fill="#166534" opacity="0.8" />
      <circle cx="320" cy="35" r="15" fill="#15803d" />
      
      {/* Small rocks / obstacles */}
      <rect x="150" y="40" width="16" height="16" rx="4" fill="#52525b" transform="rotate(15 150 40)" />
      <rect x="250" y="150" width="24" height="20" rx="6" fill="#3f3f46" transform="rotate(-10 250 150)" />
      
      {/* Character (Topdown view) */}
      <g className="art-float">
        {/* Shoulders / Body */}
        <rect x="182" y="90" width="36" height="18" rx="8" fill={`url(#${charId})`} />
        {/* Head */}
        <circle cx="200" cy="99" r="12" fill="#fcd34d" />
        {/* Sword sticking out */}
        <rect x="210" y="80" width="4" height="24" rx="2" fill="#cbd5e1" transform="rotate(30 210 80)" />
        <circle cx="212" cy="100" r="4" fill="#94a3b8" />
      </g>
      
      <text x="24" y="182" className="art-title" fill="#eef0ff">TOPDOWN ADVENTURE</text>
    </svg>
  );
}
