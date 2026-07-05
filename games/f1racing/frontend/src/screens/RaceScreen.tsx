import { useEffect, useRef } from 'react';
import { VehicleInputController } from '../input/VehicleInputController';
import type { RaceBridge } from '../net/RaceBridge';
import { SceneRoot } from '../render/SceneRoot';
import { DEFAULT_TRACK_ID, isSoloRoomId, soloModeLabel } from '../shared';
import { useF1Store } from '../store/f1Store';
import RaceHud from '../ui/RaceHud';
import CountdownOverlay from '../ui/CountdownOverlay';

interface Props {
  bridge: RaceBridge | null;
  onLeave: () => void;
  onSkipQualifying: () => void;
}

export default function RaceScreen({ bridge, onLeave, onSkipQualifying }: Props) {
  const canvasHost = useRef<HTMLDivElement>(null);
  const roomConfig = useF1Store((state) => state.roomConfig);
  const roomId = useF1Store((state) => state.roomId);
  const soloLabel = soloModeLabel(roomId);
  const playerId = useF1Store((state) => state.playerId);
  const hostId = useF1Store((state) => state.hostId);

  const trackId = roomConfig?.trackId
    ?? roomId?.split(':')[1]
    ?? DEFAULT_TRACK_ID;

  useEffect(() => {
    if (!bridge || !canvasHost.current) return;

    const scene = new SceneRoot(canvasHost.current, bridge, trackId);
    const input = new VehicleInputController(bridge);
    input.bindCameraToggle(() => scene.toggleCameraMode());
    input.bindControlsListener((state) => scene.setInputState(state));
    scene.start();
    input.start();

    return () => {
      input.stop();
      scene.dispose();
    };
  }, [bridge, trackId]);

  const isHost = Boolean(playerId && hostId && playerId === hostId);

  return (
    <div className="race-view">
      <div ref={canvasHost} className="race-canvas" />
      <CountdownOverlay />
      <div className="race-overlay">
        <div className="race-overlay-top">
          {soloLabel && <span className="race-badge">{soloLabel}</span>}
          <span className="race-hint">WASD / arrows · Space nitro · C camera</span>
          <button type="button" className="btn small" onClick={onLeave}>Leave</button>
        </div>
        <RaceHud
          bridge={bridge}
          trackId={trackId}
          isHost={isHost}
          onSkipQualifying={onSkipQualifying}
        />
      </div>
    </div>
  );
}
