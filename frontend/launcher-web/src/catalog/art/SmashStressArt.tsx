import { useId } from 'react';

export function SmashStressArt() {
  const uid = useId().replace(/:/g, '');
  const bgId = `ss-bg-${uid}`;
  const impactId = `ss-impact-${uid}`;
  
  return (
    <svg viewBox="0 0 400 200" className="key-art" role="img" aria-label="SmashStress" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7f1d1d" />
          <stop offset="1" stopColor="#450a0a" />
        </linearGradient>
        <radialGradient id={impactId} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fca5a5" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Background */}
      <rect width="400" height="200" fill={`url(#${bgId})`} />
      
      {/* Impact Center */}
      <circle cx="200" cy="100" r="80" fill={`url(#${impactId})`} className="art-pulse" />
      
      {/* Shattered Glass / Cracks */}
      <g stroke="#f87171" strokeWidth="3" strokeLinecap="round" opacity="0.8">
        <path d="M200 100 L120 20" />
        <path d="M200 100 L280 40" />
        <path d="M200 100 L140 180" />
        <path d="M200 100 L260 170" />
        <path d="M200 100 L100 100" />
        <path d="M200 100 L300 110" />
        
        {/* Branching cracks */}
        <path d="M160 60 L120 70" />
        <path d="M240 70 L280 80" />
        <path d="M170 140 L130 150" />
        <path d="M230 135 L260 120" />
      </g>
      
      {/* Flying shards */}
      <g fill="#fee2e2" opacity="0.9" className="art-float">
        <polygon points="150,50 160,45 155,60" />
        <polygon points="250,150 270,140 260,165" />
        <polygon points="120,120 135,115 130,135" />
        <polygon points="280,60 295,50 285,75" />
      </g>
      
      {/* Hammer silhouette */}
      <g transform="translate(140, 10) rotate(15)" className="art-float">
        <rect x="50" y="20" width="16" height="80" rx="4" fill="#d4d4d8" />
        <rect x="30" y="0" width="56" height="30" rx="4" fill="#3f3f46" />
        <rect x="25" y="5" width="5" height="20" fill="#71717a" />
        <rect x="86" y="5" width="5" height="20" fill="#71717a" />
      </g>

      <text x="24" y="182" className="art-title" fill="#eef0ff">SMASH STRESS</text>
    </svg>
  );
}
