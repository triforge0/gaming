import { useGameStore } from '../store/gameStore';

interface Props {
  socket: ReturnType<typeof import('../hooks/useSocket').useSocket>;
}

export default function LobbyScreen({ socket }: Props) {
  const roomId = useGameStore((s) => s.roomId);
  const gameState = useGameStore((s) => s.gameState);
  const playerId = useGameStore((s) => s.playerId);
  const playerName = useGameStore((s) => s.playerName);
  const connected = useGameStore((s) => s.connected);

  const isHost = Boolean(playerId && gameState?.hostId === playerId);
  const playerCount = gameState?.players.length ?? 0;
  const canStart = playerCount >= 2;

  const copyRoomId = () => {
    if (roomId) navigator.clipboard.writeText(roomId);
  };

  return (
    <div className="screen" style={{
      background: 'radial-gradient(ellipse at center, #2a1f10 0%, #1a1208 70%)',
    }}>
      <div className="panel" style={{ width: 480 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Room ID</p>
            <h2 style={{ fontSize: '2rem', color: 'var(--gold)', letterSpacing: 4 }}>{roomId}</h2>
          </div>
          <button className="btn btn-secondary" onClick={copyRoomId} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Copy ID
          </button>
        </div>

        <div style={{
          marginBottom: 24, padding: 16, background: 'rgba(255,215,0,0.08)',
          borderRadius: 12, border: '1px solid var(--gold-dark)',
        }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.5 }}>
            Mỗi người sẽ <strong>thiết kế thử thách</strong> (level, thời gian, bố trí vật phẩm) cho đối thủ.
            Cả hai lock xong → chơi song song trên màn hình chia đôi.
          </p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <p style={{ color: 'var(--text-dim)', marginBottom: 12, fontSize: '0.85rem' }}>PLAYERS</p>
          {gameState?.players.map((p) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
              background: 'rgba(0,0,0,0.3)', borderRadius: 12, marginBottom: 8,
              border: p.id === playerId ? '2px solid var(--gold)' : '2px solid transparent',
            }}>
              <span style={{ fontSize: '1.5rem' }}>⛏️</span>
              <div>
                <p style={{ fontWeight: 600 }}>{p.name} {p.id === playerId && '(You)'}</p>
              </div>
              <span style={{ marginLeft: 'auto', color: 'var(--success)' }}>✓</span>
            </div>
          ))}
          {playerCount < 2 && (
            <div style={{
              padding: '10px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: 12,
              color: 'var(--text-dim)', textAlign: 'center', fontSize: '0.9rem',
            }}>
              Waiting for opponent...
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {isHost ? (
            <>
              <button
                className="btn btn-primary"
                onClick={() => socket.startGame()}
                disabled={!canStart || !connected}
                style={{ flex: 1, opacity: canStart && connected ? 1 : 0.5 }}
              >
                Start Game
              </button>
              {!canStart && (
                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--accent)' }}>
                  Cần 2 người chơi ({playerCount}/2). Mở tab thứ 2 → Join Room ID.
                </p>
              )}
            </>
          ) : (
            <div style={{ flex: 1, textAlign: 'center', color: 'var(--text-dim)', padding: 14 }}>
              Waiting for host to start...
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          Xin chào, <strong style={{ color: 'var(--gold)' }}>{playerName}</strong>
        </p>
      </div>
    </div>
  );
}
