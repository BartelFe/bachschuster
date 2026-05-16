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
      // Land tone slightly warmer + brighter, so the dot-pattern continents
      // pop more strongly against the cyan oceans now that OrbitControls
      // gives users free rotation to inspect the surface (W14 audit).
      uColorLand: { value: new Color('#EFE6D2') },
      uColorWater: { value: new Color('#162533') },
      uColorNight: { value: new Color('#060709') },
      uColorTerm: { value: new Color('#D97648') },
      // Continent coverage raised so the abstracted geography reads as
      // "earth" instead of "abstract sphere" when the user spins it.
      uContinentDensity: { value: 0.64 },
    }),
    [],
  );

  useFrame((state) => {
    if (!matRef.current) return;
    uniforms.uTime.value = state.clock.elapsedTime;
    // Re-normalize each frame in case parent mutated the ref non-unit
    uniforms.uSunDir.value.copy(sunDirRef.current).normalize();
    // W14: the previous per-mesh `meshRef.current.rotation.y += delta * 0.02`
    // is gone — OrbitControls now drives auto-rotation from the camera side
    // so the Earth, pins and arcs can stay stationary in world space and
    // share a single source of rotational truth. Removes the rotation-
    // synchronisation drift that used to creep in between the two systems.
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
