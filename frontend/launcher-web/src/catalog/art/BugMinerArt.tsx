export function BugMinerArt() {
  return (
    <svg className="key-art" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-bugminer" x1="0" y1="0" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#433520" />
          <stop offset="100%" stopColor="#1a140c" />
        </linearGradient>
        <radialGradient id="glow-bugminer" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffcc00" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffcc00" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="200" fill="url(#bg-bugminer)" />
      <circle cx="200" cy="100" r="100" fill="url(#glow-bugminer)" className="art-pulse" />
      <g className="art-float">
        <path d="M180,90 L220,90 L200,120 Z" fill="#ffcc00" />
        <circle cx="200" cy="80" r="15" fill="#e0a800" />
      </g>
      <text x="200" y="160" textAnchor="middle" fill="#ffcc00" className="art-title">
        BUG MINER
      </text>
    </svg>
  );
}
