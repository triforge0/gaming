export function F1RacingArt() {
  return (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="bg-f1" x1="0" y1="0" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a0505" />
          <stop offset="100%" stopColor="#090b12" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#bg-f1)" />
      <path d="M70 130 Q200 40 330 130" stroke="#ffffff22" strokeWidth="18" fill="none" />
      <rect x="165" y="88" width="70" height="24" rx="8" fill="#e10600" />
      <circle cx="175" cy="118" r="14" fill="#222" stroke="#e10600" strokeWidth="4" />
      <circle cx="225" cy="118" r="14" fill="#222" stroke="#e10600" strokeWidth="4" />
      <text x="200" y="170" textAnchor="middle" fill="#fff" fontSize="22" fontFamily="Rajdhani, sans-serif">F1 RACING</text>
    </svg>
  );
}
