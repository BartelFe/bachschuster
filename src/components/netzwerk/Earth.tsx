import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ShaderMaterial, Vector3 } from 'three';
import { Color, type Mesh } from 'three';
import vertSrc from './shaders/earth.vert.glsl';
import fragSrc from './shaders/earth.frag.glsl';
import { getLandMaskTexture } from './landMask';

interface EarthProps {
  /** Sphere radius in scene units. Default = 1. */
  radius?: number;
  /** Lon-Lat segment counts. Bumped on desktop, dropped on mobile. */
  segments?: number;
  /** Currently-relevant sun direction (world-space, normalised). Kept for
   *  backward compatibility with the parent — the v4 holographic shader
   *  ignores it (no day/night terminator in the new look). */
  sunDirRef: React.MutableRefObject<Vector3>;
}

/**
 * The earth sphere.
 *
 * v4: holographic look driven by a real Natural Earth land mask. The shader
 * derives coastline outlines from a 4-tap gradient of the mask, lays a
 * polar-aware dot grid across the whole sphere with land cells boosted,
 * and finishes with a fresnel limb halo. No more day/night cycle —
 * `sunDirRef` is accepted for parent API stability but unused.
 */
export function Earth({ radius = 1, segments = 96, sunDirRef: _sunDirRef }: EarthProps) {
  const meshRef = useRef<Mesh>(null!);
  const matRef = useRef<ShaderMaterial>(null!);
  const landMask = useMemo(() => getLandMaskTexture(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLandMask: { value: landMask },
      // Bright cool-white for coastlines — matches the glowing outlines in
      // the reference. Sits at ~1.4 luminance pre-tone-map so it pops.
      uColorLine: { value: new Color('#d9efff').multiplyScalar(1.4) },
      // Cool desaturated cyan for the dot grid.
      uColorDot: { value: new Color('#7cb8d9') },
      // Very subtle land fill — adds depth without competing with the dots.
      uColorLand: { value: new Color('#3a6a85') },
      // Limb halo — bright blue-white.
      uColorRim: { value: new Color('#a5d8ee') },
      // Coastline width in radians on the sphere — ~0.0035 ≈ ~7px at the
      // default camera distance, scaled down naturally as the user orbits.
      uLineWidth: { value: 0.0035 },
      // Dot intensity (water cells) — kept low so the ocean reads as quiet.
      uDotIntensity: { value: 0.35 },
      // Land cells brighten the dots ~3.2× — matches the reference where
      // continents are visibly studded with dots while oceans are almost
      // bare.
      uLandBoost: { value: 3.2 },
    }),
    [landMask],
  );

  useEffect(() => {
    return () => {
      // The land mask is shared (module-level cached). Don't dispose it —
      // disposing here would invalidate the next mount of NetzwerkSection.
    };
  }, []);

  useFrame((state) => {
    if (!matRef.current) return;
    uniforms.uTime.value = state.clock.elapsedTime;
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
