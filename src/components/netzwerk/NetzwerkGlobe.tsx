import {
  forwardRef,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { Vector3 } from 'three';
import { type Group } from 'three';
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

/**
 * The composed R3F scene.
 *
 *  · `<Earth>` renders the wireframe-dot sphere.
 *  · `<Atmosphere>` adds the additive rim shell (off on mobile).
 *  · The pins + arcs sit inside a rotating `<group>` that owns the same Y-axis
 *    autorotation as the earth, so they appear glued to the surface.
 *  · `<SunTracker>` polls Date once a second and writes the world-space sun
 *    direction into a shared ref consumed by the earth shader.
 *  · `<CameraFly>` listens to `activeIndex` and tweens the camera target so
 *    a clicked standort rotates into view.
 */
export function NetzwerkGlobe({ activeIndex, setActiveIndex, tier }: NetzwerkGlobeProps) {
  const sunDirRef = useRef(sunDirectionVec3(new Date()));
  const groupRef = useRef<Group>(null!);

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
      camera={{ position: [0, 0.4, 3.2], fov: 36, near: 0.1, far: 100 }}
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

        {/* Autorotating group owns pins + arcs so they "stick" to surface. */}
        <RotatingGroup ref={groupRef}>
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
        </RotatingGroup>

        {tier !== 'mobile' && <Atmosphere earthRadius={EARTH_RADIUS} shellScale={1.085} />}

        <CameraFly
          target={activeIndex >= 0 ? standortVecs[activeIndex]! : null}
          groupRef={groupRef}
          standorteCount={standorte.length}
        />
      </Suspense>
    </Canvas>
  );
}

/**
 * A `<group>` that auto-rotates around Y at the same rate as Earth.tsx, so
 * pins + arcs stay aligned with the sphere surface beneath them.
 */
const RotatingGroup = forwardRef<Group, { children: ReactNode }>(function RotatingGroup(
  { children },
  ref,
) {
  const localRef = useRef<Group>(null!);
  useFrame((_, delta) => {
    if (localRef.current) localRef.current.rotation.y += delta * 0.02;
  });
  return (
    <group
      ref={(g) => {
        localRef.current = g!;
        if (typeof ref === 'function') ref(g);
        else if (ref) (ref as MutableRefObject<Group | null>).current = g;
      }}
    >
      {children}
    </group>
  );
});

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
 * Smoothly rotates the autorotating group so the target standort faces the
 * camera (negative Z in our setup). We undo the group's autorotation by
 * offsetting `rotation.y` toward the inverse longitude of the target.
 *
 * Implementation: each frame, lerp the group's `rotation.y` toward a target
 * angle derived from the target vector's xz plane. When `target == null`
 * (no selection), the group runs its normal autorotation only.
 */
function CameraFly({
  target,
  groupRef,
  standorteCount,
}: {
  target: Vector3 | null;
  groupRef: MutableRefObject<Group | null>;
  standorteCount: number;
}) {
  const lockedAngleRef = useRef<number | null>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (!target) {
      lockedAngleRef.current = null;
      return;
    }
    // Compute the rotation that brings `target` to face the camera (centred
    // on −Z). Target's xz angle measured from −Z; we want group.rotation.y
    // so that the rotated target lands on (0, *, −R). The group's current
    // autorotation is also rolling — we lock relative to wall time at lock.
    const targetAngle = Math.atan2(target.x, -target.z); // when group rot=0
    lockedAngleRef.current = -targetAngle;
  }, [target]);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    if (lockedAngleRef.current == null) return;

    // Compute desired y-rotation given autorotation has been ticking, then
    // lerp toward it. Autorotation continues; lockedAngle adjusts for it.
    const autoSpin = state.clock.elapsedTime * 0.02;
    const desired = lockedAngleRef.current + autoSpin;
    // Wrap-aware shortest-arc lerp
    let delta = desired - g.rotation.y;
    delta = ((delta + Math.PI) % (Math.PI * 2)) - Math.PI;
    g.rotation.y += delta * 0.06;

    // Subtle camera zoom-in when a standort is locked
    const targetZ = 2.4;
    camera.position.z += (targetZ - camera.position.z) * 0.04;
  });

  // Detect explicit "deselect" and ease back to default camera distance.
  useEffect(() => {
    if (target !== null) return;
    const id = window.setInterval(() => {
      const dz = 3.2 - camera.position.z;
      camera.position.z += dz * 0.1;
      if (Math.abs(dz) < 0.01) {
        camera.position.z = 3.2;
        window.clearInterval(id);
      }
    }, 16);
    return () => window.clearInterval(id);
  }, [target, camera, standorteCount]);

  return null;
}
