import { useEffect, useRef, useState } from 'react';
import { MatchPhase } from '@triforge/shared-ui';
import { useF1Store } from '../store/f1Store';
import { playCountdownBeep, playGoBeep } from '../audio/startLights';

/**
 * On-track start sequence: shows the authoritative countdown (3 · 2 · 1) while cars sit frozen on
 * the grid, then flashes GO! the instant the server switches to PLAYING. Synthesized start-light
 * blips accompany each number and lights-out.
 */
export default function CountdownOverlay() {
  const matchPhase = useF1Store((state) => state.matchPhase);
  const countdownSeconds = useF1Store((state) => state.countdownSeconds);
  const [showGo, setShowGo] = useState(false);
  const prevPhase = useRef(matchPhase);
  const lastBeepSecond = useRef(0);

  // One blip per new countdown number.
  useEffect(() => {
    if (matchPhase === MatchPhase.COUNTDOWN && countdownSeconds > 0) {
      if (countdownSeconds !== lastBeepSecond.current) {
        lastBeepSecond.current = countdownSeconds;
        playCountdownBeep();
      }
    } else {
      lastBeepSecond.current = 0;
    }
  }, [matchPhase, countdownSeconds]);

  // Lights out — flash GO! on the countdown → race transition.
  useEffect(() => {
    let timer = 0;
    if (prevPhase.current === MatchPhase.COUNTDOWN && matchPhase === MatchPhase.PLAYING) {
      playGoBeep();
      setShowGo(true);
      timer = window.setTimeout(() => setShowGo(false), 900);
    }
    prevPhase.current = matchPhase;
    return () => window.clearTimeout(timer);
  }, [matchPhase]);

  const showNumber = matchPhase === MatchPhase.COUNTDOWN && countdownSeconds > 0;
  if (!showNumber && !showGo) return null;

  return (
    <div className="countdown-overlay" aria-hidden="true">
      {showGo ? (
        <span className="countdown-go">GO!</span>
      ) : (
        <span key={countdownSeconds} className="countdown-number">
          {countdownSeconds}
        </span>
      )}
    </div>
  );
}
