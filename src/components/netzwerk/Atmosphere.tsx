import { useMemo } from 'react';
import { AdditiveBlending, BackSide, Color } from 'three';
import vertSrc from './shaders/atmosphere.vert.glsl';
import fragSrc from './shaders/atmosphere.frag.glsl';

interface AtmosphereProps {
  /** Radius of the host earth — atmosphere shell sits slightly larger. */
  earthRadius?: number;
  /** Multiplier above earthRadius (1.06 = thin shell, 1.15 = puffy). */
  shellScale?: number;
}

/**
 * Atmospheric rim glow.
 *
 * Inside-out sphere rendered with additive blending so the fresnel-driven
 * rim accumulates above the earth's silhouette without affecting interior
 * shading. `BackSide` rendering is the trick — only the back faces of the
 * shell sphere face the camera at the limb, producing the halo.
 */
export function Atmosphere({ earthRadius = 1, shellScale = 1.045 }: AtmosphereProps) {
  // v3 (holographic globe): the v2 shell at 1.025 / 0.55 was too tight to
  // read at the new look. The reference image shows a noticeably bright
  // halo around the sphere — pushed back to 1.045 / 0.9 with a cooler
  // white-blue tint that matches the coastline colour.
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color('#bfe4f5') },
      uIntensity: { value: 0.9 },
    }),
    [],
  );

  return (
    <mesh>
      <sphereGeometry args={[earthRadius * shellScale, 64, 32]} />
      <shaderMaterial
        vertexShader={vertSrc}
        fragmentShader={fragSrc}
        uniforms={uniforms}
        transparent
        blending={AdditiveBlending}
        side={BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
