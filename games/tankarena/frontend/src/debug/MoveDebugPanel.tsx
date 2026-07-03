import { useEffect, useState } from 'react';
import { moveDebugState, MOVE_DEBUG, type MoveDebugSnapshot } from './moveDebug';

export function MoveDebugPanel() {
  const [snap, setSnap] = useState<MoveDebugSnapshot | null>(null);

  useEffect(() => {
    if (!MOVE_DEBUG) return;
    const id = window.setInterval(() => {
      setSnap(moveDebugState.current ? { ...moveDebugState.current } : null);
    }, 100);
    return () => window.clearInterval(id);
  }, []);

  if (!MOVE_DEBUG || !snap) return null;

  const errClass =
    Math.abs(snap.aimErrorDeg) > 2 ? 'ta-move-debug-warn' :
    Math.abs(snap.aimErrorDeg) > 0.8 ? 'ta-move-debug-caution' : '';

  return (
    <div className="ta-move-debug">
      <div className="ta-move-debug-title">Move debug · tick {snap.tick}</div>
      <div className="ta-move-debug-grid">
        <span>Yaw (render)</span><span>{snap.renderYawDeg.toFixed(1)}°</span>
        <span>Yaw (server)</span><span>{snap.serverYawDeg.toFixed(1)}°</span>
        <span>Yaw (aim)</span><span>{snap.aimYawDeg.toFixed(1)}°</span>
        <span>Server lag</span><span>{snap.yawErrorDeg.toFixed(1)}° · lead {snap.leadMs}ms</span>
        <span>Render vs aim</span><span className={errClass}>{snap.aimErrorDeg.toFixed(1)}°</span>
        <span>Pitch</span><span>{snap.pitchDeg.toFixed(1)}°</span>
        <span>Last snap</span><span>{snap.lastServerSnapDeg.toFixed(1)}°</span>
        <span>Position</span>
        <span>{snap.pos.x.toFixed(0)}, {snap.pos.y.toFixed(0)}, {snap.pos.z.toFixed(0)}</span>
        <span>Input</span>
        <span>
          {snap.input.fwd && '↑ '}{snap.input.back && '↓ '}
          {snap.input.left && '← '}{snap.input.right && '→ '}
          {snap.input.aimUp && 'Q '}{snap.input.aimDown && 'E '}
          {!snap.input.fwd && !snap.input.back && !snap.input.left && !snap.input.right
            && !snap.input.aimUp && !snap.input.aimDown && '—'}
        </span>
        <span>Interp α</span><span>pos {snap.posAlpha.toFixed(2)} · rot {snap.rotAlpha.toFixed(2)}</span>
        <span>Ping</span><span>{snap.pingMs} ms</span>
      </div>
    </div>
  );
}
