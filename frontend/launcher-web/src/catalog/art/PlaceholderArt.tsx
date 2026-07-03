interface BaseArtProps {
  idPrefix: string;
  from: string;
  to: string;
  glyph: string;
}

function BaseArt({ idPrefix, from, to, glyph }: BaseArtProps) {
  const gradId = `${idPrefix}-bg`;
  return (
    <svg viewBox="0 0 400 200" className="key-art" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill={`url(#${gradId})`} />
      <text x="200" y="118" textAnchor="middle" fontSize="52">{glyph}</text>
    </svg>
  );
}

export const UtilityArt = () => (
  <BaseArt idPrefix="ph-util" from="#1c2a44" to="#0e1420" glyph="🧮" />
);
export const EducationArt = () => (
  <BaseArt idPrefix="ph-edu" from="#2a1c44" to="#0e1420" glyph="📚" />
);
export const ArcadeArt = () => (
  <BaseArt idPrefix="ph-arc" from="#441c2a" to="#0e1420" glyph="🕹️" />
);
