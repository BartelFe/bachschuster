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
export function Atmosphere({ earthRadius = 1, shellScale = 1.025 }: AtmosphereProps) {
  // v2 (brand-CI clean-up): the v1 atmosphere shell at 1.085 with intensity
  // 1.5 produced a thick "rocky planet" halo that fought the editorial style.
  // Tightened to a 1.025 shell at intensity 0.55 — reads as a quiet rim line
  // around the globe rather than a saturated planetary atmosphere.
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color('#75C9D9') },
      uIntensity: { value: 0.55 },
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
