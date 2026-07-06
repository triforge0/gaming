import { useId } from 'react';

export function PuzzleGameKidsArt() {
  const uid = useId().replace(/:/g, '');
  const bgId = `puzz-bg-${uid}`;
  const glowId = `puzz-glow-${uid}`;

  return (
    <svg viewBox="0 0 400 200" className="key-art" role="img" aria-label="Puzzle Game Kids" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#306b96" />
          <stop offset="1" stopColor="#1a3b5c" />
        </linearGradient>
        <radialGradient id={glowId} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#E8A23C" stopOpacity="0.4" />
          <stop offset="1" stopColor="#E8A23C" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Background */}
      <rect width="400" height="200" fill={`url(#${bgId})`} />
      <rect width="400" height="200" fill={`url(#${glowId})`} className="art-pulse" />

      {/* Decorative stars */}
      <text x="80" y="60" fill="#FFE270" fontSize="24" opacity="0.8" className="art-float">★</text>
      <text x="320" y="140" fill="#FFE270" fontSize="20" opacity="0.6" className="art-float" style={{ animationDelay: '1s' }}>★</text>
      <text x="300" y="50" fill="#FFE270" fontSize="16" opacity="0.7" className="art-float" style={{ animationDelay: '2s' }}>★</text>
      <text x="60" y="150" fill="#FFE270" fontSize="18" opacity="0.5" className="art-float" style={{ animationDelay: '0.5s' }}>★</text>

      {/* Owl Mascot (Centered and scaled) */}
      <g transform="translate(140, 40) scale(1)" className="art-float">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <ellipse cx="60" cy="70" rx="42" ry="40" fill="#B98A5A"/>
          <ellipse cx="60" cy="65" rx="34" ry="32" fill="#E8C79A"/>
          <polygon points="30,35 42,55 20,55" fill="#B98A5A"/>
          <polygon points="90,35 100,55 78,55" fill="#B98A5A"/>
          <circle cx="44" cy="62" r="14" fill="#fff"/>
          <circle cx="76" cy="62" r="14" fill="#fff"/>
          <circle cx="44" cy="62" r="7" fill="#2B3A4A"/>
          <circle cx="76" cy="62" r="7" fill="#2B3A4A"/>
          <polygon points="60,72 52,84 68,84" fill="#E8A23C"/>
          <ellipse cx="60" cy="108" rx="16" ry="7" fill="#D9A85C"/>
        </svg>
      </g>
      
      {/* Title */}
      <text x="24" y="182" className="art-title" fill="#eef0ff">PUZZLE GAME KIDS</text>
    </svg>
  );
}
