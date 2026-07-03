export function TreasureQuestArt() {
  return (
    <svg viewBox="0 0 400 200" className="key-art" role="img" aria-label="Treasure Quest" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="tq-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a2c14" />
          <stop offset="1" stopColor="#0e1420" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#tq-bg)" />
    </svg>
  );
}
