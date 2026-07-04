interface Props {
  count: number;
}

export default function CountdownOverlay({ count }: Props) {
  const display = Math.ceil(count);

  return (
    <div className="overlay panel-overlay">
      <div className="countdown-number">{display > 0 ? display : 'GO!'}</div>
    </div>
  );
}
