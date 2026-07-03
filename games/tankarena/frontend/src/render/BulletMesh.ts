import * as THREE from 'three';

const GEOMETRY = new THREE.SphereGeometry(4, 10, 10);
const MATERIAL = new THREE.MeshStandardMaterial({
  color: 0xffcc33,
  emissive: 0xffaa00,
  emissiveIntensity: 0.8,
});

/** A tracer bullet: a small emissive sphere eased toward the latest server position. */
export class BulletMesh {
  readonly mesh = new THREE.Mesh(GEOMETRY, MATERIAL);
  private target = new THREE.Vector3();

  snapTo(pos: THREE.Vector3): void {
    this.target.copy(pos);
    this.mesh.position.copy(pos);
  }

  setTarget(pos: THREE.Vector3): void {
    this.target.copy(pos);
  }

  update(alpha: number): void {
    this.mesh.position.lerp(this.target, alpha);
  }
}
