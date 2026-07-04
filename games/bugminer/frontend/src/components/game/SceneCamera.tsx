import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SETUP_ZONE } from '../../shared';
import { gameYToWorldY, MINER_Y } from '../../constants/scene';

/** Fit perspective camera so miner + mine fill the canvas (works in narrow split-screen panels). */
export default function SceneCamera() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  useLayoutEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    const topY = MINER_Y + 70;
    const bottomY = gameYToWorldY(SETUP_ZONE.maxY + 60);
    const centerY = (topY + bottomY) / 2;
    const spanY = topY - bottomY;
    const spanX = (SETUP_ZONE.maxX - SETUP_ZONE.minX) * 1.08;
    const aspect = size.width / Math.max(size.height, 1);
    const fovRad = (camera.fov * Math.PI) / 180;
    const margin = 1.06;

    const distY = (spanY * margin) / (2 * Math.tan(fovRad / 2));
    const halfFovX = Math.atan(Math.tan(fovRad / 2) * aspect);
    const distX = (spanX * margin) / (2 * Math.tan(halfFovX));
    const dist = Math.max(distY, distX, 300);

    camera.position.set(0, centerY, dist);
    camera.lookAt(0, centerY - 30, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}
