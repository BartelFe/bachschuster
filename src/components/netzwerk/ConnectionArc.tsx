import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Line,
  ShaderMaterial,
  type Vector3,
} from 'three';
import { greatCircleArc } from './latlng';
import vertSrc from './shaders/arc.vert.glsl';
import fragSrc from './shaders/arc.frag.glsl';

interface ConnectionArcProps {
  /** Origin and destination unit-sphere points. */
  from: Vector3;
  to: Vector3;
  /** Earth radius — arc sits slightly above. */
  earthRadius: number;
  /** Curvature lift at midpoint (multiplied by earthRadius). */
  lift?: number;
  /** Number of subdivisions along the arc. */
  samples?: number;
  /** Dash speed (units of dashCycles per second). */
  speed?: number;
  /** Per-arc phase offset so multiple arcs don't pulse in lock-step. */
  phase?: number;
}

/**
 * A great-circle arc rendered as a flowing dash with the `arc.frag.glsl`
 * shader. We bake a `aT` attribute along the arc samples so the fragment
 * shader can compute its dash position without per-frame buffer rewrites.
 */
export function ConnectionArc({
  from,
  to,
  earthRadius,
  lift = 0.32,
  samples = 96,
  speed = 0.18,
  phase = 0,
}: ConnectionArcProps) {
  // We construct a THREE.Line directly and mount it with `<primitive>` rather
  // than the JSX `<line>` element. JSX `<line>` conflicts with the SVG
  // element of the same name in TypeScript's intrinsic JSX registry; using
  // the imperative path side-steps the type collision while giving us full
  // shader/blending control over the line material.
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new Color('#D97648') },
      uSpeed: { value: speed },
      uDashCount: { value: 5 },
    }),
    [speed],
  );

  const lineObj = useMemo(() => {
    const pts = greatCircleArc(from, to, samples, lift);
    const positions = new Float32Array(pts.length * 3);
    const ts = new Float32Array(pts.length);
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i]!.clone().multiplyScalar(earthRadius);
      positions[i * 3 + 0] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
      ts[i] = i / samples;
    }
    const geom = new BufferGeometry();
    geom.setAttribute('position', new BufferAttribute(positions, 3));
    geom.setAttribute('aT', new BufferAttribute(ts, 1));

    const mat = new ShaderMaterial({
      vertexShader: vertSrc,
      fragmentShader: fragSrc,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    return new Line(geom, mat);
  }, [from, to, samples, lift, earthRadius, uniforms]);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime + phaseRef.current;
  });

  return <primitive object={lineObj} />;
}
