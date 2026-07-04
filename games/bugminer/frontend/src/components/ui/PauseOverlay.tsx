interface Props {
  onResume: () => void;
}

export default function PauseOverlay({ onResume }: Props) {
  return (
    <div className="overlay screen-overlay">
      <div className="panel" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>⏸</div>
        <h2 style={{ color: 'var(--gold)', marginBottom: 16 }}>Game Paused</h2>
        <button className="btn btn-primary" onClick={onResume}>
          Resume
        </button>
      </div>
    </div>
  );
}
