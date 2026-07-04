import { useId } from 'react';

export function SudokuCubeArt() {
  const uid = useId().replace(/:/g, '');
  const bgId = `sc-bg-${uid}`;
  const glowId = `sc-glow-${uid}`;

  const cx = 200, cy = 90;
  const dx = 46, dy = 26, h = 54;

  return (
    <svg viewBox="0 0 400 200" className="key-art" role="img" aria-label="Mini Sudoku Cube" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0f172a" />
          <stop offset="1" stopColor="#020617" />
        </linearGradient>
        <radialGradient id={glowId} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#3b82f6" stopOpacity="0.4" />
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="200" fill={`url(#${bgId})`} />
      <rect width="400" height="200" fill={`url(#${glowId})`} className="art-pulse" />
      
      <g className="art-float">
        {/* Glow */}
        <path d={`M ${cx} ${cy-dy*2.2} L ${cx+dx*1.1} ${cy-dy*1.1} L ${cx+dx*1.1} ${cy-dy+h*1.1} L ${cx} ${cy+h*1.1} L ${cx-dx*1.1} ${cy-dy+h*1.1} L ${cx-dx*1.1} ${cy-dy*1.1} Z`} fill="#60a5fa" opacity="0.3" filter="blur(8px)" />

        {/* Top Face */}
        <path d={`M ${cx} ${cy-dy*2} L ${cx+dx} ${cy-dy} L ${cx} ${cy} L ${cx-dx} ${cy-dy} Z`} fill="#60a5fa" />
        <path d={`M ${cx} ${cy-dy*2} L ${cx+dx} ${cy-dy} L ${cx} ${cy} L ${cx-dx} ${cy-dy} Z`} fill="none" stroke="#bfdbfe" strokeWidth="2" strokeLinejoin="round" />
        
        {/* Right Face */}
        <path d={`M ${cx} ${cy} L ${cx+dx} ${cy-dy} L ${cx+dx} ${cy-dy+h} L ${cx} ${cy+h} Z`} fill="#3b82f6" />
        <path d={`M ${cx} ${cy} L ${cx+dx} ${cy-dy} L ${cx+dx} ${cy-dy+h} L ${cx} ${cy+h} Z`} fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinejoin="round" />
        
        {/* Left Face */}
        <path d={`M ${cx} ${cy} L ${cx} ${cy+h} L ${cx-dx} ${cy-dy+h} L ${cx-dx} ${cy-dy} Z`} fill="#1d4ed8" />
        <path d={`M ${cx} ${cy} L ${cx} ${cy+h} L ${cx-dx} ${cy-dy+h} L ${cx-dx} ${cy-dy} Z`} fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinejoin="round" />

        {/* Lưới chia */}
        <path d={`M ${cx-dx/2} ${cy-dy*1.5} L ${cx+dx/2} ${cy-dy/2} M ${cx+dx/2} ${cy-dy*1.5} L ${cx-dx/2} ${cy-dy/2}`} stroke="#eff6ff" strokeWidth="1.5" opacity="0.5" />
        <path d={`M ${cx+dx/2} ${cy-dy/2} L ${cx+dx/2} ${cy-dy/2+h} M ${cx} ${cy+h/2} L ${cx+dx} ${cy-dy+h/2}`} stroke="#eff6ff" strokeWidth="1.5" opacity="0.5" />
        <path d={`M ${cx-dx/2} ${cy-dy/2} L ${cx-dx/2} ${cy-dy/2+h} M ${cx-dx} ${cy-dy+h/2} L ${cx} ${cy+h/2}`} stroke="#eff6ff" strokeWidth="1.5" opacity="0.5" />

        {/* Chấm tròn trang trí giống khối rubik */}
        <circle cx={cx} cy={cy-dy} r="4" fill="#fff" opacity="0.9" />
        <circle cx={cx+dx/2} cy={cy-dy/2+h/2} r="4" fill="#fff" opacity="0.9" />
        <circle cx={cx-dx/2} cy={cy-dy/2+h/2} r="4" fill="#fff" opacity="0.9" />
      </g>

      <text x="24" y="182" className="art-title" fill="#eef0ff">MINI SUDOKU CUBE</text>
    </svg>
  );
}
