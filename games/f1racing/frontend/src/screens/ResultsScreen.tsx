import {
  F1AbortReason,
  formatJoinCode,
  formatLapTime,
  formatTrackLabel,
  isSoloRoomId,
} from '../shared';
import { useF1Store } from '../store/f1Store';

interface Props {
  onBackToMenu: () => void;
  onBackToLobby: () => void;
}

function abortMessage(reason: number): string | null {
  if (reason === F1AbortReason.HOST_DISCONNECTED) {
    return 'Host đã rời — phiên đua bị hủy.';
  }
  if (reason === F1AbortReason.TIME_CAP) {
    return 'Phiên đua kết thúc do hết thời gian.';
  }
  return null;
}

export default function ResultsScreen({ onBackToMenu, onBackToLobby }: Props) {
  const raceResult = useF1Store((state) => state.raceResult);
  const roomId = useF1Store((state) => state.roomId);
  const solo = isSoloRoomId(roomId);

  if (!raceResult) {
    return (
      <div className="screen results-screen">
        <div className="panel wide">
          <h2>Kết quả</h2>
          <p className="hint">Đang chờ dữ liệu kết quả từ server...</p>
          <button type="button" className="btn" onClick={onBackToLobby}>Về lobby</button>
        </div>
      </div>
    );
  }

  const banner = abortMessage(raceResult.abortReason);
  const durationSec = (raceResult.raceDurationMs / 1000).toFixed(1);

  return (
    <div className="screen results-screen">
      <div className="panel wide results-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Race results</p>
            <h2>{roomId ? formatJoinCode(roomId) : 'Session'}</h2>
            {roomId && <p className="muted">{formatTrackLabel(roomId)}</p>}
          </div>
        </div>

        {banner && <div className="results-banner">{banner}</div>}

        <p className="hint">Race time: {durationSec}s</p>
        {raceResult.replayFileName && (
          <p className="hint">Replay saved: {raceResult.replayFileName}</p>
        )}

        {raceResult.qualifyingGrid.length > 0 && (
          <section className="results-section">
            <h3>Qualifying grid</h3>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Grid</th>
                  <th>Driver</th>
                  <th>Best lap</th>
                </tr>
              </thead>
              <tbody>
                {raceResult.qualifyingGrid.map((entry) => (
                  <tr key={`${entry.playerId}-${entry.gridSlot}`}>
                    <td>P{entry.gridSlot + 1}</td>
                    <td>{entry.displayName}{entry.isBot ? ' 🤖' : ''}</td>
                    <td>{formatLapTime(entry.bestLapMs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        <section className="results-section">
          <h3>Final standings</h3>
          <table className="results-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Driver</th>
                <th>Laps</th>
                <th>Best</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {raceResult.finalStandings.map((entry) => (
                <tr key={entry.playerId}>
                  <td>P{entry.position}</td>
                  <td>{entry.displayName}{entry.isBot ? ' 🤖' : ''}</td>
                  <td>{entry.lap}</td>
                  <td>{formatLapTime(entry.bestLapMs)}</td>
                  <td>{formatLapTime(entry.totalTimeMs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="lobby-actions">
          {raceResult.replayFileName && (
            <button
              type="button"
              className="btn"
              onClick={() => useF1Store.getState().setScreen('replay')}
            >
              Xem replay
            </button>
          )}
          {!solo && (
            <button type="button" className="btn" onClick={onBackToLobby}>Về lobby</button>
          )}
          <button type="button" className="btn primary" onClick={onBackToMenu}>Main menu</button>
        </div>
      </div>
    </div>
  );
}
