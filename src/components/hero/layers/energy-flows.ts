/**
 * Layer 1 — Energieflüsse.
 *
 * 10 cubic Bezier curves arc through the city volume — like power lines,
 * data streams, or thermal currents passing between buildings. Particles
 * sample along the curves and pick a random offset within a thin tube
 * radius so each curve reads as a glowing flow, not a hairline.
 *
 * Sampling is uniform-t (not arc-length-uniform) — visual difference is
 * negligible once the curl-noise idle drift breaks up any banding.
 */

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return function rng() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NUM_CURVES = 10;
const TUBE_RADIUS = 0.05;
/** Half-extent of the curve domain. Matches the Buildings layer. */
const BOUND_XZ = 3.0;

type Vec3 = readonly [number, number, number];

function bezierPoint(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, t: number): Vec3 {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;
  return [
    mt3 * p0[0] + 3 * mt2 * t * p1[0] + 3 * mt * t2 * p2[0] + t3 * p3[0],
    mt3 * p0[1] + 3 * mt2 * t * p1[1] + 3 * mt * t2 * p2[1] + t3 * p3[1],
    mt3 * p0[2] + 3 * mt2 * t * p1[2] + 3 * mt * t2 * p2[2] + t3 * p3[2],
  ];
}

export function generateEnergyFlows(count: number, seed = 23456): Float32Array {
  const rng = mulberry32(seed);

  // Build curves with varied character: some arcing high, some flowing low.
  const curves: Array<{ p0: Vec3; p1: Vec3; p2: Vec3; p3: Vec3 }> = [];
  for (let i = 0; i < NUM_CURVES; i++) {
    const startX = (rng() * 2 - 1) * BOUND_XZ;
    const startZ = (rng() * 2 - 1) * BOUND_XZ;
    const endX = (rng() * 2 - 1) * BOUND_XZ;
    const endZ = (rng() * 2 - 1) * BOUND_XZ;
    const startY = -0.4 + rng() * 0.6;
    const endY = -0.2 + rng() * 1.8;

    // Two intermediate controls — pull the curve into arcs and swoops.
    const c1X = startX + (endX - startX) * 0.3 + (rng() * 2 - 1) * 1.8;
    const c2X = startX + (endX - startX) * 0.7 + (rng() * 2 - 1) * 1.8;
    const c1Z = startZ + (endZ - startZ) * 0.3 + (rng() * 2 - 1) * 1.8;
    const c2Z = startZ + (endZ - startZ) * 0.7 + (rng() * 2 - 1) * 1.8;
    const c1Y = -0.3 + rng() * 2.2;
    const c2Y = -0.3 + rng() * 2.2;

    curves.push({
      p0: [startX, startY, startZ],
      p1: [c1X, c1Y, c1Z],
      p2: [c2X, c2Y, c2Z],
      p3: [endX, endY, endZ],
    });
  }

  // Approximate arc length per curve so particles distribute proportionally.
  const SAMPLES = 32;
  const lengths = new Float32Array(NUM_CURVES);
  let totalLength = 0;
  for (let i = 0; i < NUM_CURVES; i++) {
    const c = curves[i]!;
    let len = 0;
    let prev = bezierPoint(c.p0, c.p1, c.p2, c.p3, 0);
    for (let s = 1; s <= SAMPLES; s++) {
      const pt = bezierPoint(c.p0, c.p1, c.p2, c.p3, s / SAMPLES);
      const dx = pt[0] - prev[0];
      const dy = pt[1] - prev[1];
      const dz = pt[2] - prev[2];
      len += Math.sqrt(dx * dx + dy * dy + dz * dz);
      prev = pt;
    }
    lengths[i] = len;
    totalLength += len;
  }

  // Sample points along each curve, weighted by length.
  const out = new Float32Array(count * 3);
  let idx = 0;
  for (let i = 0; i < NUM_CURVES && idx < count; i++) {
    const c = curves[i]!;
    const portion = lengths[i]! / totalLength;
    const n =
      i === NUM_CURVES - 1
        ? count - idx // last curve gets the remainder
        : Math.min(Math.floor(count * portion), count - idx);

    for (let j = 0; j < n; j++) {
      const t = j / Math.max(1, n - 1);
      const pt = bezierPoint(c.p0, c.p1, c.p2, c.p3, t);

      // Uniform random point inside a sphere of TUBE_RADIUS — gives each
      // curve volume so it reads as a flow, not a wire.
      const phi = rng() * 2 * Math.PI;
      const cosTheta = rng() * 2 - 1;
      const sinTheta = Math.sqrt(Math.max(0, 1 - cosTheta * cosTheta));
      const r = TUBE_RADIUS * Math.cbrt(rng()); // cube-root → uniform volume

      out[idx * 3 + 0] = pt[0] + r * Math.cos(phi) * sinTheta;
      out[idx * 3 + 1] = pt[1] + r * Math.sin(phi) * sinTheta;
      out[idx * 3 + 2] = pt[2] + r * cosTheta;

      idx++;
    }
  }

  return out;
}
