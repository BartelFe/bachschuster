import { Suspense, useEffect, type MutableRefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { ParticleField } from './ParticleField';
import { PostFX } from './PostFX';
import { CameraRig } from './CameraRig';

interface HeroCanvasProps {
  /** 80 000 (full desktop) · 40 000 (mid) · 15 000 (mobile). 0 = render-blocked. */
  particleCount: number;
  /**
   * Ref-based morph driver (0..4). Mutated by ScrollTrigger or DebugSlider
   * without triggering React re-renders. ParticleField reads + lerps in useFrame.
   */
  morphRef: MutableRefObject<number>;
  /** Collapse-out animation driver (0..1). Hero exit fade. */
  exitRef: MutableRefObject<number>;
  /** Mount the post-processing stack. Off on mobile / reduced-motion tiers. */
  enablePostFx: boolean;
  /**
   * Called when the FPS watchdog observes sustained low frame rate. Used by
   * HeroSection to step the tier down (full → mid → mobile). Idempotent on
   * the consumer side — multiple calls when already at the floor are no-ops.
   */
  onDecline?: () => void;
}

/**
 * The R3F surface.
 *
 *  · DPR cap 2 — prevents 4 k screens from melting GPUs.
 *  · antialias — applies only when `enablePostFx` is false (otherwise the
 *    composer bypasses it; MSAA happens via `multisampling` in PostFX).
 *  · alpha false — opaque canvas, faster compositing.
 *  · powerPreference high-performance — opts laptops into the dGPU.
 *  · `<PerformanceMonitor>` watches average frame time over a 250 ms / 5
 *    iteration window; once FPS sustains below 45 the canvas asks the
 *    section to downgrade the tier.
 */
export function HeroCanvas({
  particleCount,
  morphRef,
  exitRef,
  enablePostFx,
  onDecline,
}: HeroCanvasProps) {
  // R3F's internal `useMeasure` can miss the initial ResizeObserver entry
  // when the Canvas mounts inside a parent whose layout has already settled
  // (typical with our PageTransition wrapper + R3FErrorBoundary stack).
  // The canvas then stays stuck at the intrinsic 300 × 150 default. One
  // synthetic resize event after mount forces R3F to re-observe the wrap
  // div and size the canvas to fill it. Same fix we shipped for the Globe
  // canvas in W7 — symptom was identical (canvas 300×150 instead of full
  // viewport, all the hero overlay text hangs in empty black space).
  useEffect(() => {
    const id = window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 32);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      gl={{
        antialias: !enablePostFx,
        powerPreference: 'high-performance',
        alpha: false,
      }}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <color attach="background" args={['#0A0B0E']} />
      {onDecline ? (
        <PerformanceMonitor
          bounds={() => [45, 60]}
          flipflops={3}
          iterations={5}
          onDecline={onDecline}
        />
      ) : null}
      <Suspense fallback={null}>
        <CameraRig />
        <ParticleField count={particleCount} morphRef={morphRef} exitRef={exitRef} />
        {enablePostFx ? <PostFX /> : null}
      </Suspense>
    </Canvas>
  );
}
