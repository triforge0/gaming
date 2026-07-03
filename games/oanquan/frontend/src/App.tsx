import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GameClient,
  MatchPhase,
  toNum,
} from '@triforge/shared-ui';
import type {
  IOAQBoardState,
  IOAQScore,
  IRoomLobbySnapshot,
} from '@triforge/shared-ui';
import { GameCanvas, type GameCanvasApi } from './scene/GameCanvas';

/** The launcher seeds this room with the oanquan plugin (multi-table = future work). */
const ROOM_ID = 'oanquan';
const SERVER_TPS = 60;

type Screen = 'join' | 'lobby' | 'playing';

interface ScoreView {
  playerId: number;
  seat: number;
  capturedDan: number;
  capturedQuan: number;
  points: number;
}

function scoreViews(board: IOAQBoardState): ScoreView[] {
  return (board.scores ?? []).map((score: IOAQScore) => ({
    playerId: toNum(score.playerId),
    seat: score.seat ?? 0,
    capturedDan: score.capturedDan ?? 0,
    capturedQuan: score.capturedQuan ?? 0,
    points: score.points ?? 0,
  }));
}

export function App() {
  const [screen, setScreen] = useState<Screen>('join');
  const [name, setName] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [lobby, setLobby] = useState<IRoomLobbySnapshot | null>(null);
  const [board, setBoard] = useState<IOAQBoardState | null>(null);
  const [toast, setToast] = useState('');
  const [selfId, setSelfId] = useState(-1);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const clientRef = useRef<GameClient | null>(null);
  const canvasApiRef = useRef<GameCanvasApi | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback((text: string) => {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2500);
  }, []);

  const join = useCallback(() => {
    if (connecting || clientRef.current) return;
    setConnecting(true);
    setJoinError('');

    const client = new GameClient(ROOM_ID, name.trim() || 'Người chơi', {
      onConnected: () => {
        setConnecting(false);
      },
      onDisconnected: () => {
        setJoinError('Mất kết nối tới máy chủ.');
        setScreen('join');
        setConnecting(false);
        clientRef.current = null;
      },
      onJoinRejected: () => {
        setJoinError('Bàn đã đủ 2 người chơi hoặc ván đang diễn ra.');
        setScreen('join');
        setConnecting(false);
        client.close();
        clientRef.current = null;
      },
      onLobbySnapshot: (snapshot) => {
        setLobby(snapshot);
        setSelfId(client.selfPlayerId);
        if ((snapshot.phase ?? MatchPhase.LOBBY) === MatchPhase.LOBBY) {
          setScreen('lobby');
          setBoard(null);
        }
      },
      onOAnQuanMessage: (message) => {
        if (message.board) {
          setBoard(message.board);
          setTimerSeconds(Math.ceil((message.board.turnTicksRemaining ?? 0) / SERVER_TPS));
          setScreen('playing');
          canvasApiRef.current?.pushBoard(message.board);
        }
        if (message.moveResult) {
          canvasApiRef.current?.pushMoveResult(message.moveResult);
        }
        if (message.moveRejected) {
          showToast(`Nước đi không hợp lệ: ${message.moveRejected.reason ?? ''}`);
        }
      },
    });
    clientRef.current = client;
    client.connect();
  }, [connecting, name, showToast]);

  // Local countdown between board broadcasts.
  useEffect(() => {
    if (screen !== 'playing' || !board || board.gameOver) return;
    const interval = setInterval(() => {
      setTimerSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [screen, board]);

  useEffect(() => () => clientRef.current?.close(), []);

  const sendMove = useCallback((pitIndex: number, direction: number) => {
    clientRef.current?.sendOAnQuanMove(pitIndex, direction);
  }, []);

  const onCanvasReady = useCallback((api: GameCanvasApi) => {
    canvasApiRef.current = api;
    if (board) {
      api.pushBoard(board);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (screen === 'join') {
    return (
      <div className="overlay center">
        <div className="panel">
          <h1>Ô ăn quan</h1>
          <p className="muted">Trò chơi dân gian — 2 người, bàn 3D, cùng mạng LAN.</p>
          <input
            placeholder="Tên của bạn"
            value={name}
            maxLength={24}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && join()}
          />
          <button onClick={join} disabled={connecting}>
            {connecting ? 'Đang kết nối…' : 'Vào bàn'}
          </button>
          {joinError && <p className="error">{joinError}</p>}
        </div>
      </div>
    );
  }

  if (screen === 'lobby') {
    const players = lobby?.players ?? [];
    const me = players.find((p) => toNum(p.playerId) === selfId);
    const ready = me?.ready ?? false;
    return (
      <div className="overlay center">
        <div className="panel">
          <h1>Ô ăn quan</h1>
          <p className="muted">Cần đúng 2 người chơi. Sẵn sàng để bắt đầu.</p>
          <ul className="players">
            {players.map((p) => (
              <li key={toNum(p.playerId)}>
                {p.displayName}
                {p.isHost ? ' 👑' : ''}
                <span className={p.ready ? 'ready' : 'waiting'}>
                  {p.ready ? 'sẵn sàng' : 'đang chờ'}
                </span>
              </li>
            ))}
            {players.length < 2 && <li className="muted">… đang chờ người chơi thứ hai</li>}
          </ul>
          <button onClick={() => clientRef.current?.setReady(!ready)}>
            {ready ? 'Bỏ sẵn sàng' : 'Sẵn sàng'}
          </button>
        </div>
      </div>
    );
  }

  // playing (board view stays up through the endgame overlay)
  const scores = board ? scoreViews(board) : [];
  const currentId = board ? toNum(board.currentPlayerId) : 0;
  const myTurn = currentId === selfId && !board?.gameOver;
  const playerName = (playerId: number) =>
    lobby?.players?.find((p) => toNum(p.playerId) === playerId)?.displayName ?? `#${playerId}`;

  return (
    <>
      <GameCanvas selfPlayerId={selfId} onReady={onCanvasReady} sendMove={sendMove} />

      <div className="hud top">
        {scores.map((score) => (
          <div key={score.seat} className={`score ${currentId === score.playerId ? 'active' : ''}`}>
            <strong>{playerName(score.playerId)}</strong>
            <span>{score.points} điểm</span>
            <span className="muted">
              {score.capturedDan} dân · {score.capturedQuan} quan
            </span>
          </div>
        ))}
      </div>

      {board && !board.gameOver && (
        <div className="hud bottom">
          <span className={myTurn ? 'turn mine' : 'turn'}>
            {myTurn ? 'Lượt của bạn — chọn ô rồi chọn hướng rải' : `Lượt của ${playerName(currentId)}`}
          </span>
          <span className={`timer ${timerSeconds <= 5 ? 'urgent' : ''}`}>⏱ {timerSeconds}s</span>
        </div>
      )}

      {toast && <div className="hud toast">{toast}</div>}

      {board?.gameOver && (
        <div className="overlay center dim">
          <div className="panel">
            <h1>
              {toNum(board.winnerPlayerId) === 0
                ? 'Hòa!'
                : toNum(board.winnerPlayerId) === selfId
                  ? 'Bạn thắng! 🎉'
                  : `${playerName(toNum(board.winnerPlayerId))} thắng!`}
            </h1>
            <ul className="players">
              {scores.map((score) => (
                <li key={score.seat}>
                  {playerName(score.playerId)}
                  <span>{score.points} điểm</span>
                </li>
              ))}
            </ul>
            <p className="muted">Bàn sẽ quay lại phòng chờ để chơi ván mới…</p>
          </div>
        </div>
      )}
    </>
  );
}
