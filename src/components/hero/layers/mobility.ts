/**
 * Layer 2 — Mobilität.
 *
 * Particles form a grid of trajectory lanes — six near-parallel "highways"
 * in the X direction at varied Y altitudes, plus two cross-lanes in Z.
 * Each lane has a slight sine-wave wobble so it reads kinetic, not gridded.
 *
 * Result: when uMorph snaps to 2, the swooping energy splines straighten
 * into structured traffic flows.
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

const NUM_X_LANES = 6;
const NUM_Z_LANES = 2;
const SPAN = 3.4;
const LANE_THICKNESS = 0.07;

export function generateMobility(count: number, seed = 34567): Float32Array {
  const rng = mulberry32(seed);

  // Pre-roll lane parameters so each lane is deterministic.
  const xLanes: Array<{ y: number; z: number; wobble: number; phase: number }> = [];
  const zLanes: Array<{ y: number; x: number; wobble: number; phase: number }> = [];

  for (let i = 0; i < NUM_X_LANES; i++) {
    xLanes.push({
      y: -0.4 + (i / (NUM_X_LANES - 1)) * 1.3, // -0.4 → 0.9
      z: (rng() * 2 - 1) * 2.4,
      wobble: 0.15 + rng() * 0.25, // amplitude
      phase: rng() * Math.PI * 2,
    });
  }
  for (let i = 0; i < NUM_Z_LANES; i++) {
    zLanes.push({
      y: -0.2 + i * 0.7,
      x: (rng() * 2 - 1) * 1.8,
      wobble: 0.12 + rng() * 0.2,
      phase: rng() * Math.PI * 2,
    });
  }

  const out = new Float32Array(count * 3);
  const xShare = 0.78;
  const xCount = Math.floor(count * xShare);
  const zCount = count - xCount;
  const perX = Math.floor(xCount / NUM_X_LANES);
  const perZ = Math.floor(zCount / NUM_Z_LANES);

  let idx = 0;
  for (let i = 0; i < NUM_X_LANES; i++) {
    const lane = xLanes[i]!;
    for (let j = 0; j < perX && idx < count; j++) {
      const t = rng();
      const x = (t - 0.5) * 2 * SPAN;
      const z = lane.z + Math.sin(t * Math.PI * 2 + lane.phase) * lane.wobble;
      const y = lane.y + (rng() - 0.5) * LANE_THICKNESS;
      const jz = (rng() - 0.5) * LANE_THICKNESS;

      out[idx * 3 + 0] = x;
      out[idx * 3 + 1] = y;
      out[idx * 3 + 2] = z + jz;
      idx++;
    }
  }
  for (let i = 0; i < NUM_Z_LANES; i++) {
    const lane = zLanes[i]!;
    for (let j = 0; j < perZ && idx < count; j++) {
      const t = rng();
      const z = (t - 0.5) * 2 * SPAN;
      const x = lane.x + Math.sin(t * Math.PI * 2 + lane.phase) * lane.wobble;
      const y = lane.y + (rng() - 0.5) * LANE_THICKNESS;
      const jx = (rng() - 0.5) * LANE_THICKNESS;

      out[idx * 3 + 0] = x + jx;
      out[idx * 3 + 1] = y;
      out[idx * 3 + 2] = z;
      idx++;
    }
  }

  // Fill any remainder via random x-lane.
  while (idx < count) {
    const lane = xLanes[idx % NUM_X_LANES]!;
    const t = rng();
    out[idx * 3 + 0] = (t - 0.5) * 2 * SPAN;
    out[idx * 3 + 1] = lane.y;
    out[idx * 3 + 2] = lane.z;
    idx++;
  }

  return out;
}
