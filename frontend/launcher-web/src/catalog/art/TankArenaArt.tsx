export function TankArenaArt() {
  return (
    <svg viewBox="0 0 400 200" className="key-art" role="img" aria-label="Tank Arena" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ta-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#16281a" />
          <stop offset="1" stopColor="#0e1420" />
        </linearGradient>
        <radialGradient id="ta-glow" cx="0.75" cy="0.2" r="0.7">
          <stop offset="0" stopColor="#7ee29b" stopOpacity="0.35" />
          <stop offset="1" stopColor="#7ee29b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="200" fill="url(#ta-bg)" />
      <rect width="400" height="200" fill="url(#ta-glow)" className="art-pulse" />
      <g>
        <rect x="120" y="92" width="92" height="46" rx="8" fill="#3d6b45" />
        <rect x="146" y="72" width="40" height="30" rx="6" fill="#4d8557" />
        <rect x="182" y="82" width="76" height="9" rx="4" fill="#7ee29b" />
        <rect x="110" y="138" width="112" height="18" rx="9" fill="#2a4531" />
        <circle cx="130" cy="147" r="7" fill="#16281a" />
        <circle cx="166" cy="147" r="7" fill="#16281a" />
        <circle cx="202" cy="147" r="7" fill="#16281a" />
      </g>
      <circle cx="272" cy="86" r="4" fill="#7ee29b" className="art-float" />
      <text x="24" y="182" className="art-title" fill="#eef0ff">TANK ARENA</text>
    </svg>
  );
}
