/**
 * Layer 0 — Gebaute Struktur.
 *
 * Generate ~30 random box volumes and sample N points across their combined
 * surface, with the sample density per box weighted by surface area (so a
 * large building gets proportionally more particles than a small one).
 *
 * Seed is deterministic — same seed always returns the same skyline.
 *
 * Output: Float32Array of length `count * 3` with [x0, y0, z0, x1, y1, z1, …].
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

const NUM_BOXES = 32;
/** Half-extent of the city in X and Z (so buildings span ±BOUND on the ground plane). */
const BOUND_XZ = 2.7;
/** Ground level Y. */
const GROUND_Y = -0.6;

export function generateBuildings(count: number, seed = 12345): Float32Array {
  const rng = mulberry32(seed);

  // Parallel arrays for the 32 boxes — faster than `Box[]` and dodges
  // noUncheckedIndexedAccess noise.
  const cxs = new Float32Array(NUM_BOXES);
  const cys = new Float32Array(NUM_BOXES);
  const czs = new Float32Array(NUM_BOXES);
  const sxs = new Float32Array(NUM_BOXES);
  const sys = new Float32Array(NUM_BOXES);
  const szs = new Float32Array(NUM_BOXES);

  for (let i = 0; i < NUM_BOXES; i++) {
    // Random footprint in the X/Z plane.
    const x = (rng() * 2 - 1) * BOUND_XZ;
    const z = (rng() * 2 - 1) * BOUND_XZ;

    // Buildings get wider or taller depending on a height-vs-footprint dice.
    const tallness = rng();
    const halfW = 0.18 + rng() * 0.32; // 0.18–0.5
    const halfD = 0.18 + rng() * 0.32;
    const halfH = 0.2 + tallness * tallness * 1.3; // bias toward shorter, occasional skyscraper

    cxs[i] = x;
    czs[i] = z;
    cys[i] = GROUND_Y + halfH; // sit on the ground plane
    sxs[i] = halfW;
    sys[i] = halfH;
    szs[i] = halfD;
  }

  // Cumulative surface-area CDF for area-weighted box selection.
  const areas = new Float32Array(NUM_BOXES);
  let totalArea = 0;
  for (let i = 0; i < NUM_BOXES; i++) {
    const sx = sxs[i]!;
    const sy = sys[i]!;
    const sz = szs[i]!;
    // 2 × (XY + YZ + XZ) faces, each face area = (2sx)(2sy) etc → factor of 4.
    areas[i] = 8 * (sx * sy + sy * sz + sx * sz);
    totalArea += areas[i]!;
  }
  const cdf = new Float32Array(NUM_BOXES);
  let acc = 0;
  for (let i = 0; i < NUM_BOXES; i++) {
    acc += areas[i]! / totalArea;
    cdf[i] = acc;
  }

  // Sample surface points.
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Pick a box weighted by area.
    const r = rng();
    let bi = 0;
    while (bi < NUM_BOXES - 1 && cdf[bi]! < r) bi++;

    const cx = cxs[bi]!;
    const cy = cys[bi]!;
    const cz = czs[bi]!;
    const sx = sxs[bi]!;
    const sy = sys[bi]!;
    const sz = szs[bi]!;

    // Choose a face weighted by face area.
    // Faces: ±X = 4·sy·sz · 2, ±Y = 4·sx·sz · 2, ±Z = 4·sx·sy · 2.
    const aX = 4 * sy * sz;
    const aY = 4 * sx * sz;
    const aZ = 4 * sx * sy;
    const totalFace = 2 * (aX + aY + aZ);
    const fr = rng() * totalFace;

    let px: number, py: number, pz: number;
    if (fr < 2 * aX) {
      px = cx + (fr < aX ? sx : -sx);
      py = cy + (rng() * 2 - 1) * sy;
      pz = cz + (rng() * 2 - 1) * sz;
    } else if (fr < 2 * aX + 2 * aY) {
      const f = fr - 2 * aX;
      px = cx + (rng() * 2 - 1) * sx;
      py = cy + (f < aY ? sy : -sy);
      pz = cz + (rng() * 2 - 1) * sz;
    } else {
      const f = fr - 2 * aX - 2 * aY;
      px = cx + (rng() * 2 - 1) * sx;
      py = cy + (rng() * 2 - 1) * sy;
      pz = cz + (f < aZ ? sz : -sz);
    }

    out[i * 3 + 0] = px;
    out[i * 3 + 1] = py;
    out[i * 3 + 2] = pz;
  }

  return out;
}

/** Per-particle random scalars (0..1), shader uses these as phase offsets for curl-noise. */
export function generateRandoms(count: number, seed = 67890): Float32Array {
  const rng = mulberry32(seed);
  const out = new Float32Array(count);
  for (let i = 0; i < count; i++) out[i] = rng();
  return out;
}
