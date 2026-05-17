import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type ComponentRef,
  type MutableRefObject,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vector3 } from 'three';

/**
 * Drei doesn't directly export the OrbitControls implementation type, but the
 * forwardRef element ref resolves to it via React's ComponentRef utility. This
 * avoids needing `three-stdlib` as a direct dependency.
 */
type OrbitControlsRef = ComponentRef<typeof OrbitControls>;
import { Earth } from './Earth';
import { Atmosphere } from './Atmosphere';
import { LocationPin } from './LocationPin';
import { ConnectionArc } from './ConnectionArc';
import { standorte } from '@/content/standorte';
import { latLngToVec3, sunDirectionVec3 } from './latlng';

interface NetzwerkGlobeProps {
  /** Index of the currently-active standort (from the side panel), -1 = none. */
  activeIndex: number;
  /** Setter so pin clicks can update the panel. */
  setActiveIndex: (i: number) => void;
  /** Performance tier — controls sphere segments + atmosphere. */
  tier: 'full' | 'mid' | 'mobile';
}

const EARTH_RADIUS = 1;
// v2 (brand-CI clean-up): camera pulled back from 3.2 → 4.2 so the globe
// reads as a "schlichtes Editorial-Objekt" inside the section instead of
// dominating the viewport like a rocky planet. Locked distance bumped in
// proportion (2.4 → 3.0) so the standort-fly-in stays a comfortable zoom.
const CAMERA_DEFAULT_DISTANCE = 4.2;
const CAMERA_LOCKED_DISTANCE = 3.0;

/**
 * The composed R3F scene.
 *
 * v2 (W14): OrbitControls now own all rotation. Earth and the standort-
 * group sit motionless in world space; the camera spins around them at
 * `autoRotateSpeed = 0.4` when no standort is selected, and the
 * `CameraFly` helper lerps the camera onto the selected standort's
 * surface-normal ray when one is. This collapses the v1 dual-rotation
 * setup (Earth.useFrame + RotatingGroup.useFrame + camera) into a single
 * source of truth and makes the globe user-draggable for the first time.
 *
 *  · `<Earth>` renders the wireframe-dot sphere (now stationary).
 *  · `<Atmosphere>` adds the additive rim shell (off on mobile).
 *  · Pins + arcs sit in a plain `<group>` — they no longer carry their
 *    own rotation tween.
 *  · `<SunTracker>` polls Date once a second and writes the world-space
 *    sun direction into a shared ref consumed by the earth shader.
 *  · `<OrbitControls>` is constrained to rotation only (no zoom, no pan),
 *    bounded polar angles to keep the user out of the poles, with gentle
 *    damping.
 *  · `<CameraFly>` listens to `activeIndex` and tweens the camera onto
 *    the selected standort while disabling autoRotate.
 */
export function NetzwerkGlobe({ activeIndex, setActiveIndex, tier }: NetzwerkGlobeProps) {
  const sunDirRef = useRef(sunDirectionVec3(new Date()));
  const controlsRef = useRef<OrbitControlsRef | null>(null);

  const segments = tier === 'full' ? 128 : tier === 'mid' ? 96 : 64;

  // R3F mounts inside a Suspense boundary that resolves AFTER the parent
  // section has already laid out. In that race, react-use-measure can miss
  // its initial ResizeObserver entry and the canvas stays at the 300×150
  // intrinsic default. Dispatching one synthetic resize event after mount
  // forces R3F's measure hook to re-observe and the canvas to size to its
  // actual parent.
  useEffect(() => {
    const id = window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 32);
    return () => window.clearTimeout(id);
  }, []);

  // Pre-compute standort surface positions (used for arcs + camera-fly target).
  const standortVecs = useMemo(
    () => standorte.map((s) => latLngToVec3(s.lat, s.lng, EARTH_RADIUS)),
    [],
  );

  const hauptsitzIdx = standorte.findIndex((s) => s.kind === 'hauptsitz');
  const hauptsitzVec = standortVecs[hauptsitzIdx]!;

  return (
    <Canvas
      camera={{ position: [0, 0.4, CAMERA_DEFAULT_DISTANCE], fov: 36, near: 0.1, far: 100 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <Suspense fallback={null}>
        <SunTracker sunDirRef={sunDirRef} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 2]} intensity={0.7} />

        {/* Static earth sphere — shader owns the surface look. */}
        <Earth radius={EARTH_RADIUS} segments={segments} sunDirRef={sunDirRef} />

        {/* Pins + arcs in a plain stationary group. */}
        <group>
          {standorte.map((s, i) => (
            <LocationPin
              key={s.city}
              lat={s.lat}
              lng={s.lng}
              earthRadius={EARTH_RADIUS}
              index={i}
              highlighted={i === activeIndex}
              onSelect={() => setActiveIndex(i)}
            />
          ))}
          {standorte.map((s, i) => {
            if (i === hauptsitzIdx) return null;
            const phase = i * 1.2;
            return (
              <ConnectionArc
                key={`arc-${s.city}`}
                from={hauptsitzVec}
                to={standortVecs[i]!}
                earthRadius={EARTH_RADIUS}
                phase={phase}
                lift={0.32 + 0.05 * i}
              />
            );
          })}
        </group>

        {tier !== 'mobile' && <Atmosphere earthRadius={EARTH_RADIUS} />}

        <OrbitControls
          ref={controlsRef}
          enableZoom={false}
          enablePan={false}
          autoRotate={activeIndex < 0}
          autoRotateSpeed={0.4}
          enableDamping
          dampingFactor={0.06}
          // Keep the user out of polar singularities.
          minPolarAngle={Math.PI * 0.22}
          maxPolarAngle={Math.PI * 0.78}
          // Touch behaviour — single-finger rotate, no two-finger zoom.
          touches={{ ONE: 0, TWO: 0 }}
          makeDefault
        />

        <CameraFly
          target={activeIndex >= 0 ? standortVecs[activeIndex]! : null}
          controlsRef={controlsRef}
        />
      </Suspense>
    </Canvas>
  );
}

/** Updates the shared sunDir uniform input ref once per second. */
function SunTracker({ sunDirRef }: { sunDirRef: MutableRefObject<Vector3> }) {
  useEffect(() => {
    const tick = () => sunDirRef.current.copy(sunDirectionVec3(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [sunDirRef]);
  return null;
}

/**
 * Lerps the camera onto the selected standort's surface-normal ray.
 *
 * When `target == null` the OrbitControls' built-in auto-rotation runs
 * unimpeded. When a target is set, we disable autoRotate and tween the
 * camera position toward `target.normalize() * CAMERA_LOCKED_DISTANCE`,
 * keeping the orbit-target at origin so OrbitControls' polar/azimuth
 * machinery stays consistent.
 */
function CameraFly({
  target,
  controlsRef,
}: {
  target: Vector3 | null;
  controlsRef: MutableRefObject<OrbitControlsRef | null>;
}) {
  const { camera } = useThree();
  const desiredPosRef = useRef(new Vector3());

  useEffect(() => {
    if (!target) return;
    desiredPosRef.current.copy(target).normalize().multiplyScalar(CAMERA_LOCKED_DISTANCE);
  }, [target]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (target == null) {
      // Released — let autoRotate run + ease distance back to default if
      // the previous lock had zoomed in.
      const dist = camera.position.length();
      if (Math.abs(dist - CAMERA_DEFAULT_DISTANCE) > 0.005) {
        const scale = (dist + (CAMERA_DEFAULT_DISTANCE - dist) * 0.06) / dist;
        camera.position.multiplyScalar(scale);
        controls.update();
      }
      return;
    }

    // Locked — lerp camera onto the target's surface-normal ray.
    camera.position.lerp(desiredPosRef.current, 0.06);
    controls.update();
  });

  return null;
}
