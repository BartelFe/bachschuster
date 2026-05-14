import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ShaderMaterial } from 'three';
import { Color, Vector3, type Mesh } from 'three';
import vertSrc from './shaders/earth.vert.glsl';
import fragSrc from './shaders/earth.frag.glsl';

interface EarthProps {
  /** Sphere radius in scene units. Default = 1. */
  radius?: number;
  /** Lon-Lat segment counts. Bumped on desktop, dropped on mobile. */
  segments?: number;
  /** Currently-relevant sun direction (world-space, normalised). */
  sunDirRef: React.MutableRefObject<Vector3>;
}

/**
 * The earth sphere.
 *
 * A single icosphere-free SphereGeometry rendered with the custom GLSL
 * shader from `./shaders/earth.*.glsl`. The `uSunDir` uniform is mutated
 * each frame from the parent ref so day/night rotation stays smooth without
 * triggering React re-renders.
 */
export function Earth({ radius = 1, segments = 96, sunDirRef }: EarthProps) {
  const meshRef = useRef<Mesh>(null!);
  const matRef = useRef<ShaderMaterial>(null!);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSunDir: { value: new Vector3(1, 0.2, 0.5).normalize() },
      uColorLand: { value: new Color('#F2EDE2') },
      uColorWater: { value: new Color('#1B2C36') },
      uColorNight: { value: new Color('#070809') },
      uColorTerm: { value: new Color('#D97648') },
      uContinentDensity: { value: 0.58 },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (!matRef.current) return;
    uniforms.uTime.value = state.clock.elapsedTime;
    // Re-normalize each frame in case parent mutated the ref non-unit
    uniforms.uSunDir.value.copy(sunDirRef.current).normalize();
    // Slow autorotation around the Y-axis — half an orbit every ~5 minutes
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, segments, Math.max(48, segments / 2)]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertSrc}
        fragmentShader={fragSrc}
        uniforms={uniforms}
      />
    </mesh>
  );
}
