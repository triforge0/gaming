export function TankArenaArt() {
  return (
    <svg viewBox="0 0 400 200" className="key-art" role="img" aria-label="Tank Arena" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ta-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#16281a" />
          <stop offset="1" stopColor="#0e1420" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#ta-bg)" />
    </svg>
  );
}
