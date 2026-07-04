import { Bloom, EffectComposer, SMAA } from '@react-three/postprocessing';

export function Effects() {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false} depthBuffer={false} stencilBuffer={false}>
      <SMAA />
      <Bloom intensity={0.3} luminanceThreshold={0.85} luminanceSmoothing={0.4} mipmapBlur />
    </EffectComposer>
  );
}
