import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, type Mesh } from 'three';
import { latLngToVec3 } from './latlng';

interface LocationPinProps {
  lat: number;
  lng: number;
  /** Earth radius the pin should hover above. */
  earthRadius: number;
  /** Index in standorte list, used to phase-offset the pulse. */
  index: number;
  /** Highlight this pin (bigger ring, faster pulse). */
  highlighted?: boolean;
  /** Pointer handlers proxy out to the parent so it can flip the panel. */
  onHover?: (hovering: boolean) => void;
  onSelect?: () => void;
}

/**
 * A standort pin.
 *
 *  · Outer ring + inner solid dot, both terrakotta.
 *  · Outer ring pulses (scale + opacity) with a per-pin phase offset so the
 *    four pins don't strobe in lock-step — feels "alive" without becoming
 *    visual noise.
 *  · Highlighted state (when the panel has the matching standort active)
 *    pumps the pulse twice as fast and grows the ring 1.6× baseline.
 *  · Hover sets a parent state for the tooltip; click selects.
 *
 * The pin's position is computed once via `latLngToVec3` (the parent Earth
 * is auto-rotated separately — pins live in the world frame, so as the
 * Earth rotates beneath them, they appear to ride the surface because we
 * mount them onto the same rotating group in `NetzwerkGlobe`).
 */
export function LocationPin({
  lat,
  lng,
  earthRadius,
  index,
  highlighted = false,
  onHover,
  onSelect,
}: LocationPinProps) {
  const ringRef = useRef<Mesh>(null!);
  const dotRef = useRef<Mesh>(null!);

  // Position: pin sits just above the surface so it doesn't z-fight with the
  // earth shader. `latLngToVec3` returns a unit-length vec; scale to radius
  // + a small lift.
  const position = latLngToVec3(lat, lng, earthRadius * 1.005).toArray();

  // Orient the pin so its local +Z (the ring's normal axis) points outward
  // from the earth centre. We tilt the ring to face the camera-ish — we
  // simply align it perpendicular to the surface so it looks like a target
  // disc lying flat on the ground.
  const outward = latLngToVec3(lat, lng, 1);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const speed = highlighted ? 2.0 : 0.9;
    const phase = (index * Math.PI) / 2;
    const pulse = (Math.sin(t * speed + phase) + 1) * 0.5; // 0..1
    if (ringRef.current) {
      const baseScale = highlighted ? 1.6 : 1.0;
      const scale = baseScale * (0.85 + pulse * 0.35);
      ringRef.current.scale.setScalar(scale);
      const mat = ringRef.current.material as { opacity?: number };
      if (mat && 'opacity' in mat) {
        mat.opacity = 0.45 + pulse * 0.45;
      }
    }
    if (dotRef.current) {
      const mat = dotRef.current.material as { emissiveIntensity?: number };
      if (mat && 'emissiveIntensity' in mat) {
        mat.emissiveIntensity = highlighted ? 1.5 : 0.9 + pulse * 0.3;
      }
    }
  });

  // Build a quaternion that maps +Z onto the outward direction. We hand
  // three.js the position and a `lookAt` style orientation by composing
  // a group at the pin location, then offsetting the visible meshes along
  // local +Z (which is now outward).
  return (
    <group
      position={position}
      onUpdate={(g) => {
        // Orient the group so its +Y points "up" along the surface tangent
        // and +Z points outward. Cheapest construction: lookAt the centre,
        // which makes -Z face the centre → +Z faces outward.
        g.lookAt(outward.x * 100, outward.y * 100, outward.z * 100);
      }}
      onPointerEnter={(e) => {
        e.stopPropagation();
        onHover?.(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        onHover?.(false);
        document.body.style.cursor = '';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {/* Inner dot */}
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.012, 16, 12]} />
        <meshStandardMaterial
          color={new Color('#D97648')}
          emissive={new Color('#D97648')}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      {/* Outer ring — flat torus facing outward */}
      <mesh ref={ringRef} position={[0, 0, 0.005]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.036, 0.003, 12, 48]} />
        <meshBasicMaterial color={new Color('#B85C2E')} transparent toneMapped={false} />
      </mesh>
      {/* Vertical stem — a thin line extending outward, anchors the pin
          visually so it doesn't feel pasted on. */}
      <mesh position={[0, 0, 0.06]}>
        <cylinderGeometry args={[0.0015, 0.0015, 0.12, 6]} />
        <meshBasicMaterial
          color={new Color('#D97648')}
          transparent
          opacity={0.65}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
