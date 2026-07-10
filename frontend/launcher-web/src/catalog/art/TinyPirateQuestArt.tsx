import { useId } from 'react';

export function TinyPirateQuestArt() {
  const uid = useId().replace(/:/g, '');
  const bgId = `tpq-bg-${uid}`;
  const glowId = `tpq-glow-${uid}`;
  const seaId = `tpq-sea-${uid}`;

  return (
    <svg viewBox="0 0 400 200" className="key-art" role="img" aria-label="Tiny Pirate Quest" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0ea5e9" />
          <stop offset="0.6" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id={seaId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0369a1" />
          <stop offset="1" stopColor="#075985" />
        </linearGradient>
        <radialGradient id={glowId} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#f59e0b" stopOpacity="0.4" />
          <stop offset="1" stopColor="#0f172a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background Sky */}
      <rect width="400" height="200" fill={`url(#${bgId})`} />

      {/* Sun/Glow */}
      <circle cx="200" cy="80" r="100" fill={`url(#${glowId})`} className="art-pulse" />

      {/* Sea waves */}
      <rect y="120" width="400" height="80" fill={`url(#${seaId})`} />
      <path d="M 0 120 Q 50 115 100 120 T 200 120 T 300 120 T 400 120 L 400 200 L 0 200 Z" fill="#0284c7" opacity="0.8" />
      <path d="M 0 130 Q 60 122 120 130 T 240 130 T 360 130 T 400 130 L 400 200 L 0 200 Z" fill="#0369a1" opacity="0.6" />

      {/* Tropical Island (right side) */}
      <path d="M 280 140 Q 340 100 400 140 Z" fill="#fef08a" />
      {/* Palm tree */}
      <rect x="335" y="90" width="6" height="35" rx="2" fill="#78350f" transform="rotate(10 335 90)" />
      <path d="M 320 85 Q 340 70 360 90 Q 340 90 320 85 Z" fill="#15803d" />
      <path d="M 315 95 Q 335 85 350 105 Q 335 100 315 95 Z" fill="#166534" />
      <path d="M 330 80 Q 350 65 370 75 Q 350 80 330 80 Z" fill="#22c55e" />

      {/* Pirate Ship (Left/Center) */}
      <g className="art-float" style={{ transformOrigin: '140px 115px' }}>
        {/* Hull */}
        <path d="M 100 115 L 180 115 L 170 135 L 115 135 Z" fill="#7c2d12" stroke="#451a03" strokeWidth="2" />
        {/* Mast */}
        <rect x="137" y="65" width="4" height="50" fill="#451a03" />
        {/* Sail */}
        <path d="M 139 70 Q 115 85 139 105 Q 155 85 139 70 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        {/* Jolly Roger Skull on Sail */}
        <circle cx="139" cy="85" r="4" fill="#000000" />
        <rect x="137" y="88" width="4" height="3" fill="#000000" />
        <line x1="133" y1="81" x2="145" y2="89" stroke="#000000" strokeWidth="1.5" />
        <line x1="133" y1="89" x2="145" y2="81" stroke="#000000" strokeWidth="1.5" />
        <circle cx="139" cy="85" r="3.5" fill="#ffffff" />
        <circle cx="137.8" cy="84.5" r="0.8" fill="#000000" />
        <circle cx="140.2" cy="84.5" r="0.8" fill="#000000" />
        <path d="M 137.5 87.5 L 140.5 87.5" stroke="#000000" strokeWidth="0.8" />
        {/* Flag */}
        <path d="M 139 65 L 150 70 L 139 75 Z" fill="#dc2626" />
      </g>

      {/* Floating Coins */}
      <g className="art-pulse">
        <circle cx="70" cy="60" r="8" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
        <text x="67" y="64" fill="#fef08a" fontSize="10" fontWeight="bold">c</text>

        <circle cx="270" cy="50" r="10" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" className="art-float" style={{ animationDelay: '0.8s' }} />
        <text x="266" y="54" fill="#fef08a" fontSize="12" fontWeight="bold">c</text>

        <circle cx="230" cy="140" r="7" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" className="art-float" style={{ animationDelay: '1.5s' }} />
        <text x="227" y="143" fill="#fef08a" fontSize="8" fontWeight="bold">c</text>
      </g>

      {/* Cloud */}
      <path d="M 30 50 Q 40 35 55 40 Q 70 35 75 50 Q 85 55 75 65 L 25 65 Q 15 55 30 50 Z" fill="#ffffff" opacity="0.8" className="art-float" style={{ animationDelay: '2s' }} />

      {/* Text Label */}
      <text x="24" y="182" className="art-title" fill="#eef0ff">TINY PIRATE QUEST</text>
    </svg>
  );
}
