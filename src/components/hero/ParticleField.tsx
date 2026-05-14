import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from './shaders/particle.vert.glsl';
import fragmentShader from './shaders/particle.frag.glsl';
import { buildLayerAttributes } from './layers';
import { easeFns } from '@/lib/motion';

interface ParticleFieldProps {
  count: number;
  /** Single source of truth for uMorph; written by scroll + slider, read here. */
  morphRef: MutableRefObject<number>;
  /** Drives the collapse-out animation when the hero scroll passes the end. */
  exitRef: MutableRefObject<number>;
}

const MORPH_LERP = 0.18;
const EXIT_LERP = 0.22;
const REVEAL_DURATION = 2.5;

export function ParticleField({ count, morphRef, exitRef }: ParticleFieldProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const revealStartRef = useRef<number | null>(null);
  const { gl } = useThree();

  const { geometry, uniforms } = useMemo(() => {
    const { target0, target1, target2, target3, target4, stakeholderColors, randoms } =
      buildLayerAttributes(count);

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(target0, 3));
    geom.setAttribute('aTarget0', new THREE.BufferAttribute(target0, 3));
    geom.setAttribute('aTarget1', new THREE.BufferAttribute(target1, 3));
    geom.setAttribute('aTarget2', new THREE.BufferAttribute(target2, 3));
    geom.setAttribute('aTarget3', new THREE.BufferAttribute(target3, 3));
    geom.setAttribute('aTarget4', new THREE.BufferAttribute(target4, 3));
    geom.setAttribute('aStkColor', new THREE.BufferAttribute(stakeholderColors, 3));
    geom.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geom.computeBoundingSphere();

    return {
      geometry: geom,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
        uPointSize: { value: 1.6 },
        uMorph: { value: 0 },
        uReveal: { value: 0 },
        uExit: { value: 0 },
        uLayerColor0: { value: new THREE.Color('#4D8FBF') }, // data-cyan
        uLayerColor1: { value: new THREE.Color('#D97648') }, // accent-glow
        uLayerColor2: { value: new THREE.Color('#B85C2E') }, // accent-primary
        uLayerColor3: { value: new THREE.Color('#9B9385') }, // bone-muted
      },
    };
  }, [count, gl]);

  useEffect(
    () => () => {
      geometry.dispose();
    },
    [geometry],
  );

  useFrame((state) => {
    const mat = materialRef.current;
    if (!mat) return;

    mat.uniforms.uTime!.value = state.clock.elapsedTime;

    // ── Reveal emergence ─────────────────────────────────────────────
    if (revealStartRef.current === null) {
      revealStartRef.current = state.clock.elapsedTime;
    }
    const revealT = Math.min(
      (state.clock.elapsedTime - revealStartRef.current) / REVEAL_DURATION,
      1,
    );
    mat.uniforms.uReveal!.value = easeFns.cinematic(revealT);

    // ── Morph follow ─────────────────────────────────────────────────
    const morphTarget = morphRef.current;
    const morphCurrent = mat.uniforms.uMorph!.value as number;
    mat.uniforms.uMorph!.value = morphCurrent + (morphTarget - morphCurrent) * MORPH_LERP;

    // ── Exit collapse ────────────────────────────────────────────────
    const exitTarget = exitRef.current;
    const exitCurrent = mat.uniforms.uExit!.value as number;
    mat.uniforms.uExit!.value = exitCurrent + (exitTarget - exitCurrent) * EXIT_LERP;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
