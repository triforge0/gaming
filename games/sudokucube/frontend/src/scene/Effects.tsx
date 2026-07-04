import { Bloom, EffectComposer } from '@react-three/postprocessing';

export function Effects() {
  // Anti-alias bằng MSAA của composer thay vì SMAA: SMAAEffect (postprocessing 6.39)
  // khai báo attribute DEPTH vô điều kiện, kích hoạt depth-blit mỗi frame — cơ chế này
  // vỡ với three r168 (clone DepthTexture chia sẻ GL image → GL_INVALID_OPERATION,
  // context lost, màn hình đen).
  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <Bloom intensity={0.3} luminanceThreshold={0.85} luminanceSmoothing={0.4} mipmapBlur />
    </EffectComposer>
  );
}
