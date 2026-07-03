import { useId } from 'react';

export function OAnQuanArt() {
  const uid = useId().replace(/:/g, '');
  const bgId = `oq-bg-${uid}`;
  const glowId = `oq-glow-${uid}`;
  return (
    <svg viewBox="0 0 400 200" className="key-art" role="img" aria-label="Ô ăn quan" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#143234" />
          <stop offset="1" stopColor="#0e1420" />
        </linearGradient>
        <radialGradient id={glowId} cx="0.7" cy="0.25" r="0.7">
          <stop offset="0" stopColor="#6ee2d6" stopOpacity="0.3" />
          <stop offset="1" stopColor="#6ee2d6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="200" fill={`url(#${bgId})`} />
      <rect width="400" height="200" fill={`url(#${glowId})`} className="art-pulse" />
      <g>
        <rect x="110" y="82" width="160" height="60" rx="10" fill="#1d4a47" />
        <path d="M110 82 h-26 a30 30 0 0 0 0 60 h26 z" fill="#2a615c" />
        <path d="M270 82 h26 a30 30 0 0 1 0 60 h-26 z" fill="#2a615c" />
        <circle cx="134" cy="100" r="9" fill="#143234" />
        <circle cx="166" cy="100" r="9" fill="#143234" />
        <circle cx="198" cy="100" r="9" fill="#143234" />
        <circle cx="230" cy="100" r="9" fill="#143234" />
        <circle cx="134" cy="124" r="9" fill="#143234" />
        <circle cx="166" cy="124" r="9" fill="#143234" />
        <circle cx="198" cy="124" r="9" fill="#143234" />
        <circle cx="230" cy="124" r="9" fill="#143234" />
        <circle cx="252" cy="112" r="5" fill="#6ee2d6" />
      </g>
      <circle cx="300" cy="70" r="4" fill="#6ee2d6" className="art-float" />
      <text x="24" y="182" className="art-title" fill="#eef0ff">Ô ĂN QUAN</text>
    </svg>
  );
}
