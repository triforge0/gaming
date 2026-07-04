import {
  LEVELS,
  TIME_LIMIT_MAX,
  TIME_LIMIT_MIN,
  DEFAULT_FAIR_MODE,
  getChallengeDesignedBy,
  getChallengeForPlayer,
  getLevelById,
  getOpponentName,
  getSetupUiState,
} from '../shared';
import { useGameStore } from '../store/gameStore';
import MineScene from '../components/game/MineScene';
import ChallengeHUD from '../components/ui/ChallengeHUD';
import SetupPalette from '../components/ui/SetupPalette';
import { clientToGameCoords } from '../utils/canvasCoords';

interface Props {
  socket: ReturnType<typeof import('../hooks/useSocket').useSocket>;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function SetupScreen({ socket }: Props) {
  const gameState = useGameStore((s) => s.gameState);
  const playerId = useGameStore((s) => s.playerId);
  const selectedItemId = useGameStore((s) => s.selectedItemId);
  const draggingItemId = useGameStore((s) => s.draggingItemId);
  const dragPreview = useGameStore((s) => s.dragPreview);

  if (!gameState || !playerId) {
    return (
      <div className="screen">
        <p style={{ color: 'var(--text-dim)' }}>Loading game...</p>
      </div>
    );
  }

  const myDesign = getChallengeDesignedBy(gameState, playerId);
  const oppDesign = getChallengeForPlayer(gameState, playerId);
  if (!myDesign) {
    return (
      <div className="screen">
        <p style={{ color: 'var(--text-dim)' }}>Loading challenge...</p>
      </div>
    );
  }

  const ui = getSetupUiState(myDesign, oppDesign);
  const opponentName = getOpponentName(gameState, playerId);
  const level = getLevelById(myDesign.levelId);
  const fairMode = gameState.fairMode ?? DEFAULT_FAIR_MODE;
  const fairActive = fairMode.enabled;
  const fairLevel = fairActive ? getLevelById(fairMode.levelId) : null;

  const placeAt = (itemId: string, x: number, y: number) => {
    socket.placeItem(itemId, { x, y });
    useGameStore.getState().setDraggingItem(null);
    useGameStore.getState().setDragPreview(null);
    useGameStore.getState().setSelectedItemId(null);
  };

  const handleCanvasClick = (x: number, y: number) => {
    if (!ui.canEdit) return;
    const itemId = draggingItemId ?? selectedItemId;
    if (!itemId) return;
    placeAt(itemId, x, y);
  };

  const handleDragStart = (itemId: string) => {
    if (!ui.canEdit) return;
    useGameStore.getState().setDraggingItem(itemId);
    useGameStore.getState().setSelectedItemId(itemId);
  };

  const handleItemDragStart = (itemId: string) => {
    if (!ui.canEdit) return;
    useGameStore.getState().setDraggingItem(itemId);
    useGameStore.getState().setSelectedItemId(null);
  };

  const handleHtmlDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!ui.canEdit) return;
    const itemId = e.dataTransfer.getData('itemId') || draggingItemId || selectedItemId;
    if (!itemId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const { x, y } = clientToGameCoords(e.clientX, e.clientY, rect);
    placeAt(itemId, x, y);
  };

  return (
    <div className="game-layout setup-screen">
      <header className="setup-header">
        <h2 className="setup-title">Thiết kế thử thách cho: {opponentName}</h2>
        <div className="setup-status-row">
          <span className={`setup-chip ${ui.myLocked ? 'locked' : 'active'}`}>
            Bạn: {ui.myLocked ? '✓ Đã lock' : `⏳ Setup (${ui.unplacedCount} chưa đặt)`}
          </span>
          <span className={`setup-chip ${ui.oppLocked ? 'locked' : 'pending'}`}>
            {opponentName}: {ui.oppLocked ? '✓ Đã lock' : '⏳ Đang setup'}
          </span>
        </div>
        {ui.waitingForOpponent && (
          <div className="setup-wait-banner" role="status">
            ⏳ Đã lock — đang chờ {opponentName} hoàn tất setup...
          </div>
        )}
        {fairActive && fairLevel && (
          <div className="setup-fair-banner" role="status">
            ⚖️ Fair mode — {fairLevel.name} · {formatTime(fairMode.timeLimit)} · Target {fairLevel.targetScore}
            <span className="setup-fair-hint"> (Level &amp; time cố định — chỉ bố trí vật phẩm)</span>
          </div>
        )}
      </header>

      {ui.canEdit && !fairActive && (
        <div className="setup-toolbar">
          <span className="setup-toolbar-label">Level:</span>
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              className={`setup-level-btn ${level.id === l.id ? 'active' : ''}`}
              onClick={() => socket.setChallengeLevel(l.id)}
            >
              {l.name}
            </button>
          ))}
          <span className="setup-toolbar-label">Time: {formatTime(myDesign.timeLimit)}</span>
          <input
            type="range"
            min={TIME_LIMIT_MIN}
            max={TIME_LIMIT_MAX}
            step={5}
            value={myDesign.timeLimit}
            onChange={(e) => socket.setChallengeTimeLimit(Number(e.target.value))}
            className="setup-time-slider"
            aria-label="Thời gian chơi cho đối thủ"
          />
        </div>
      )}

      <ChallengeHUD label="Map đối thủ" challenge={myDesign} phase={gameState.phase} />

      <div
        className="canvas-container setup-canvas"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleHtmlDrop}
      >
        <MineScene
          challenge={myDesign}
          phase={gameState.phase}
          onCanvasClick={handleCanvasClick}
          onDragMove={(x, y) => useGameStore.getState().setDragPreview({ x, y })}
          onItemDragStart={handleItemDragStart}
          interactive={ui.canEdit}
          readOnly={!ui.canEdit}
          selectedItemId={selectedItemId ?? draggingItemId}
          draggingItemId={draggingItemId}
          dragPreview={dragPreview}
        />
      </div>

      {ui.canEdit && (
        <footer className="setup-footer">
          <SetupPalette
            items={myDesign.items}
            selectedItemId={selectedItemId}
            draggingItemId={draggingItemId}
            onPickItem={(id) => {
              useGameStore.getState().setSelectedItemId(id);
              useGameStore.getState().setDraggingItem(id);
            }}
            onDragStart={handleDragStart}
          />
          <div className="setup-actions">
            <p className="setup-hint">
              {fairActive
                ? 'Fair mode: kéo thả hoặc Auto Arrange · 🪤 Bẫy chuột = thua · 🐭🐷 di chuyển · 🧃 Nước tăng lực'
                : 'Kéo thả vật phẩm · Vàng/đá có kích thước khác nhau · 🐭🐷 di chuyển · 🧃 kéo nhanh hơn'}
            </p>
            <div className="setup-action-btns">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => socket.autoArrange()}
              >
                Auto Arrange
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => socket.lockMap()}
                disabled={!ui.canLock}
                style={{ opacity: ui.canLock ? 1 : 0.5 }}
              >
                Lock Challenge
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
