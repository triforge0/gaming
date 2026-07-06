interface Props {
  count: number;
  subtitle?: string;
}

export default function CountdownOverlay({ count, subtitle }: Props) {
  const display = Math.ceil(count);

  return (
    <div className="overlay panel-overlay">
      <div className="countdown-number">{display > 0 ? display : 'GO!'}</div>
      {subtitle && <p className="countdown-subtitle">{subtitle}</p>}
    </div>
  );
}
