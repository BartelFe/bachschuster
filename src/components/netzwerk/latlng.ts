import { Vector3 } from 'three';

/**
 * Coordinate utilities for the Globe scene.
 *
 *  · `latLngToVec3` projects geographic coordinates onto a unit sphere in
 *    three.js's right-handed coordinate system (lon=0 at +X, north = +Y,
 *    increasing longitude = westward rotation when looking from +Y).
 *  · `subsolarLatLng` computes where the sun is directly overhead at a given
 *    UTC date, so the day/night terminator can rotate accurately rather than
 *    sit at an arbitrary fixed angle. Equations from NOAA's General Solar
 *    Position algorithm, simplified — accurate to ~1° over years.
 *  · `greatCircleArc` interpolates between two surface points along the
 *    great-circle and lifts the midpoint by `lift` × radius to give the
 *    connection arc a visible elevation above the surface.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

const DEG = Math.PI / 180;

/** Project (lat, lng) in degrees to a unit-sphere position. */
export function latLngToVec3(lat: number, lng: number, radius = 1): Vector3 {
  const phi = lat * DEG;
  const lambda = lng * DEG;
  return new Vector3(
    radius * Math.cos(phi) * Math.cos(lambda),
    radius * Math.sin(phi),
    -radius * Math.cos(phi) * Math.sin(lambda),
  );
}

/**
 * Subsolar point — the lat/lng where the sun is directly overhead at the
 * given date. We use this to drive the earth shader's `uSunDir` uniform.
 *
 * Simplified model:
 *  · Solar declination from day-of-year (Spencer 1971 fit).
 *  · Subsolar longitude from UTC hour, accounting for the equation of time
 *    approximation as the GMST offset.
 */
export function subsolarLatLng(date: Date): LatLng {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = (date.getTime() - start) / 86_400_000;
  const gamma = (2 * Math.PI * (dayOfYear - 1)) / 365;

  // Declination in radians (Spencer fit)
  const declRad =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  const lat = declRad / DEG;

  // Equation of time (minutes) — corrects the subsolar longitude
  const eqMin =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  const utcHour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const lng = -((utcHour + eqMin / 60) * 15 - 180);
  return { lat, lng: ((lng + 540) % 360) - 180 };
}

/** Returns the world-space sun-direction unit vector for the given date. */
export function sunDirectionVec3(date: Date): Vector3 {
  const { lat, lng } = subsolarLatLng(date);
  return latLngToVec3(lat, lng, 1);
}

/**
 * Build a great-circle arc between two surface points, lifted at the midpoint.
 * Returns N+1 Vector3 samples suitable for `BufferGeometry.setFromPoints`.
 */
export function greatCircleArc(a: Vector3, b: Vector3, samples: number, lift: number): Vector3[] {
  // Slerp on the unit sphere
  const dot = Math.max(Math.min(a.dot(b), 1), -1);
  const omega = Math.acos(dot);
  const sinOmega = Math.sin(omega);
  const points: Vector3[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    let p: Vector3;
    if (sinOmega < 1e-6) {
      p = a.clone();
    } else {
      const w1 = Math.sin((1 - t) * omega) / sinOmega;
      const w2 = Math.sin(t * omega) / sinOmega;
      p = a.clone().multiplyScalar(w1).add(b.clone().multiplyScalar(w2));
    }
    // Lift by sin(πt) so endpoints stay at radius=1, peak adds `lift`.
    const liftFactor = 1 + Math.sin(Math.PI * t) * lift;
    p.normalize().multiplyScalar(liftFactor);
    points.push(p);
  }
  return points;
}
