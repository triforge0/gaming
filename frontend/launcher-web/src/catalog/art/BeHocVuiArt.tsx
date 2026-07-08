import { useId } from 'react';

export function BeHocVuiArt() {
  const uid = useId().replace(/:/g, '');
  const bgId = `bhv-bg-${uid}`;
  const glowId = `bhv-glow-${uid}`;

  return (
    <svg viewBox="0 0 400 200" className="key-art" role="img" aria-label="Bé Học Vui" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ec4899" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <radialGradient id={glowId} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#f472b6" stopOpacity="0.4" />
          <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Background */}
      <rect width="400" height="200" fill={`url(#${bgId})`} />
      <rect width="400" height="200" fill={`url(#${glowId})`} className="art-pulse" />

      {/* Twinkling Stars */}
      <g className="art-float">
        <text x="50" y="40" fill="#FFE270" fontSize="16" opacity="0.8">★</text>
        <text x="350" y="60" fill="#FFE270" fontSize="14" opacity="0.6" style={{ animationDelay: '1s' }}>★</text>
        <text x="80" y="140" fill="#FFE270" fontSize="18" opacity="0.7" style={{ animationDelay: '2s' }}>★</text>
        <text x="320" y="150" fill="#FFE270" fontSize="15" opacity="0.9" style={{ animationDelay: '1.5s' }}>★</text>
      </g>

      {/* Floating Bubbles */}
      <circle cx="90" cy="80" r="10" fill="#ffffff" opacity="0.15" className="art-float" style={{ animationDelay: '0.5s' }} />
      <circle cx="290" cy="110" r="15" fill="#ffffff" opacity="0.1" className="art-float" style={{ animationDelay: '1.8s' }} />
      <circle cx="120" cy="150" r="8" fill="#ffffff" opacity="0.2" className="art-float" style={{ animationDelay: '2.5s' }} />
      <circle cx="260" cy="40" r="12" fill="#ffffff" opacity="0.1" className="art-float" style={{ animationDelay: '1s' }} />

      {/* Mascot A (Emerald Color) */}
      <g transform="translate(110, 45) scale(0.95)" className="art-float">
        {/* Draw Letter A */}
        <path d="M 30,10 L 10,70 L 22,70 L 26,54 L 46,54 L 50,70 L 62,70 Z M 36,22 L 43,44 L 29,44 Z" fill="#2dd4bf" stroke="#115e59" strokeWidth="3" />
        {/* Left Eye */}
        <circle cx="30" cy="38" r="4.5" fill="#ffffff" />
        <circle cx="30" cy="38" r="2" fill="#000000" />
        <circle cx="31" cy="37" r="0.7" fill="#ffffff" />
        {/* Right Eye */}
        <circle cx="42" cy="38" r="4.5" fill="#ffffff" />
        <circle cx="42" cy="38" r="2" fill="#000000" />
        <circle cx="43" cy="37" r="0.7" fill="#ffffff" />
        {/* Smile */}
        <path d="M 33,45 Q 36,49 39,45" fill="none" stroke="#115e59" strokeWidth="2.5" strokeLinecap="round" />
        {/* Rosy Cheeks */}
        <ellipse cx="27" cy="41" rx="2" ry="1.2" fill="#f43f5e" opacity="0.7" />
        <ellipse cx="45" cy="41" rx="2" ry="1.2" fill="#f43f5e" opacity="0.7" />
      </g>

      {/* Mascot 1 (Warm Orange) */}
      <g transform="translate(190, 40) scale(0.95)" className="art-float" style={{ animationDelay: '1.2s' }}>
        {/* Draw Number 1 */}
        <path d="M 22,22 Q 32,15 36,10 L 46,10 L 46,70 L 32,70 L 32,22 Z" fill="#f97316" stroke="#7c2d12" strokeWidth="3" />
        {/* Left Eye */}
        <circle cx="32" cy="24" r="4.5" fill="#ffffff" />
        <circle cx="32" cy="24" r="2" fill="#000000" />
        {/* Right Eye */}
        <circle cx="41" cy="24" r="4.5" fill="#ffffff" />
        <circle cx="41" cy="24" r="2" fill="#000000" />
        {/* Smile */}
        <path d="M 34,31 Q 36.5,35 39,31" fill="none" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
        {/* Blush */}
        <ellipse cx="29" cy="26" rx="2" ry="1.2" fill="#ef4444" opacity="0.7" />
        <ellipse cx="44" cy="26" rx="2" ry="1.2" fill="#ef4444" opacity="0.7" />
      </g>

      {/* Mascot B (Golden Yellow) */}
      <g transform="translate(145, 80) scale(0.95)" className="art-float" style={{ animationDelay: '0.6s' }}>
        {/* Draw Letter B */}
        <path d="M 12,10 L 36,10 C 48,10 48,27 36,27 C 50,27 50,44 36,44 L 12,44 Z M 22,17 L 22,23 L 30,23 C 33,23 33,17 30,17 Z M 22,30 L 22,37 L 30,37 C 34,37 34,30 30,30 Z" fill="#fbbf24" stroke="#78350f" strokeWidth="3" />
        {/* Left Eye */}
        <circle cx="22" cy="18" r="3.5" fill="#ffffff" />
        <circle cx="22" cy="18" r="1.5" fill="#000000" />
        {/* Right Eye */}
        <circle cx="28" cy="18" r="3.5" fill="#ffffff" />
        <circle cx="28" cy="18" r="1.5" fill="#000000" />
        {/* Smile */}
        <path d="M 23,21 Q 25,23 27,21" fill="none" stroke="#78350f" strokeWidth="1.5" />
      </g>

      {/* Mascot 2 (Lavender Indigo) */}
      <g transform="translate(230, 75) scale(0.95)" className="art-float" style={{ animationDelay: '1.8s' }}>
        {/* Draw Number 2 */}
        <path d="M 10,18 C 10,6 36,6 36,22 C 36,34 16,42 16,48 L 40,48 L 40,56 L 10,56 L 10,48 C 10,34 30,26 30,20 C 30,14 16,14 16,18 Z" fill="#818cf8" stroke="#312e81" strokeWidth="3" />
        {/* Left Eye */}
        <circle cx="21" cy="18" r="4.5" fill="#ffffff" />
        <circle cx="21" cy="18" r="2" fill="#000000" />
        {/* Right Eye */}
        <circle cx="30" cy="18" r="4.5" fill="#ffffff" />
        <circle cx="30" cy="18" r="2" fill="#000000" />
        {/* Smile */}
        <path d="M 23,24 Q 25.5,27 28,24" fill="none" stroke="#312e81" strokeWidth="2.2" strokeLinecap="round" />
        {/* Rosy Cheeks */}
        <ellipse cx="18" cy="20" rx="1.8" ry="1.1" fill="#ec4899" opacity="0.7" />
        <ellipse cx="33" cy="20" rx="1.8" ry="1.1" fill="#ec4899" opacity="0.7" />
      </g>

      {/* Text Label */}
      <text x="24" y="182" className="art-title" fill="#eef0ff">BÉ HỌC VUI</text>
    </svg>
  );
}
