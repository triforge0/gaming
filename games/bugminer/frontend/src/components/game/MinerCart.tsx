import { MINER_Y } from '../../constants/scene';

export default function MinerCart() {
  return (
    <group position={[0, MINER_Y, 0]}>
      {/* Platform / cart */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[140, 24, 70]} />
        <meshStandardMaterial color="#5c3d2e" roughness={0.8} />
      </mesh>

      {/* Wheels */}
      {[-55, 55].map((x) =>
        [-24, 24].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -18, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[14, 14, 10, 16]} />
            <meshStandardMaterial color="#333" metalness={0.5} />
          </mesh>
        )),
      )}

      {/* Miner character */}
      <group position={[0, 30, 0]}>
        <mesh position={[0, 12, 0]}>
          <capsuleGeometry args={[14, 22, 4, 8]} />
          <meshStandardMaterial color="#ff6b35" />
        </mesh>
        <mesh position={[0, 36, 0]}>
          <sphereGeometry args={[16, 16, 16]} />
          <meshStandardMaterial color="#ffcc99" />
        </mesh>
        <mesh position={[0, 42, 0]}>
          <sphereGeometry args={[18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ffd700" metalness={0.6} />
        </mesh>
        <mesh position={[0, 38, 16]}>
          <sphereGeometry args={[5, 8, 8]} />
          <meshStandardMaterial color="#ffffaa" emissive="#ffff00" emissiveIntensity={2} />
        </mesh>
        <spotLight
          position={[0, 38, 16]}
          angle={0.6}
          penumbra={0.5}
          intensity={1.5}
          distance={500}
          castShadow
        />
      </group>

      {/* Hook arm */}
      <mesh position={[0, 10, 0]}>
        <boxGeometry args={[10, 36, 10]} />
        <meshStandardMaterial color="#666" metalness={0.7} />
      </mesh>
    </group>
  );
}
