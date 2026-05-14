import { useFrame, useThree } from '@react-three/fiber';

/** Lerp factor for camera position. 0.08 = ~12 frames to catch up at 60fps. */
const DAMPING = 0.08;
/** Maximum horizontal pan from cursor at canvas edge. */
const PAN_X = 1.0;
/** Maximum vertical pan from cursor at canvas edge. */
const PAN_Y = 0.55;
/** Camera distance from origin — kept constant so the city stays in frame. */
const BASE_Z = 8;

/**
 * Cinematic camera-rig. Reads R3F's normalized `mouse` (-1..1) and lerps
 * the camera position toward `mouse * PAN`. Always re-aims at the origin
 * so the particle scene stays centered.
 *
 *  · On touch devices, `mouse` defaults to (0, 0) and never updates — the
 *    camera sits stable at origin. No special gating needed.
 *  · prefers-reduced-motion is gated upstream (whole canvas omitted).
 *  · No React state — uses useFrame for per-frame lerp.
 */
export function CameraRig() {
  const { camera, mouse } = useThree();

  useFrame(() => {
    const targetX = mouse.x * PAN_X;
    const targetY = mouse.y * PAN_Y;

    camera.position.x += (targetX - camera.position.x) * DAMPING;
    camera.position.y += (targetY - camera.position.y) * DAMPING;
    camera.position.z = BASE_Z;

    camera.lookAt(0, 0, 0);
  });

  return null;
}
