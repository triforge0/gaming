import { useEffect, useRef, useState } from 'react';
import { ReplayScene } from '../replay/ReplayScene';
import { fetchLastReplay, readCachedReplay } from '../replay/storage';
import type { ReplayDocument } from '../replay/types';
import { useF1Store } from '../store/f1Store';

export default function ReplayScreen() {
  const canvasHost = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ReplayScene | null>(null);
  const [document, setDocument] = useState<ReplayDocument | null>(() => readCachedReplay());
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(!readCachedReplay());

  useEffect(() => {
    let cancelled = false;
    if (!document) {
      fetchLastReplay().then((next) => {
        if (cancelled) return;
        setDocument(next);
        setLoading(false);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [document]);

  useEffect(() => {
    if (!document || !canvasHost.current) return;
    const scene = new ReplayScene(canvasHost.current, document);
    sceneRef.current = scene;
    scene.start();
    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, [document]);

  useEffect(() => {
    sceneRef.current?.setPaused(paused);
  }, [paused]);

  useEffect(() => {
    sceneRef.current?.setPlaybackSpeed(speed);
  }, [speed]);

  return (
    <div className="race-view replay-view">
      <div ref={canvasHost} className="race-canvas" />
      <div className="race-overlay">
        <div className="race-overlay-top">
          <span className="race-badge">Replay</span>
          <span className="race-hint">
            {document?.fileName ?? (loading ? 'Đang tải replay...' : 'Không có replay')}
          </span>
          <button type="button" className="btn small" onClick={() => useF1Store.getState().setScreen('menu')}>
            Menu
          </button>
        </div>
        <div className="replay-controls">
          <button type="button" className="btn small" onClick={() => setPaused((value) => !value)}>
            {paused ? 'Play' : 'Pause'}
          </button>
          {[0.25, 0.5, 1].map((value) => (
            <button
              key={value}
              type="button"
              className={`btn small${speed === value ? ' primary' : ''}`}
              onClick={() => setSpeed(value)}
            >
              {value}x
            </button>
          ))}
          <span className="hint">C · toggle camera</span>
        </div>
      </div>
    </div>
  );
}
