/**
 * Layer 4 — Konflikte.
 *
 * Five tight stakeholder clusters arranged in a pentagon, each particle
 * carries its stakeholder's color as a per-vertex attribute (`aStkColor`).
 * Visual: when uMorph reaches 4, the bone-muted social blobs split into
 * the five §3.1 stakeholder palettes — terracotta, blue, yellow, moss,
 * stone — that re-appear as nodes in the W4 Methode force-graph.
 *
 * The colors here intentionally include Stadt = data-cyan (§3.1 stk-city)
 * which is the same hex as Layer-0 buildings, so morphing 4 → 0 leaves
 * about a fifth of the particles colour-stable. The other four shift.
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

/** Master-prompt § 3.1 stakeholder colors, in §6.2 stakeholder order. */
const STAKEHOLDER_RGB: ReadonlyArray<readonly [number, number, number]> = [
  [0x4d / 255, 0x8f / 255, 0xbf / 255], // city           — stk-city kühles Blau
  [0xb8 / 255, 0x5c / 255, 0x2e / 255], // business       — stk-business Terrakotta
  [0xe8 / 255, 0xc5 / 255, 0x47 / 255], // citizens       — stk-citizens Sodium-Gelb
  [0x7b / 255, 0xa6 / 255, 0x59 / 255], // environment    — stk-environment Moos
  [0xc2 / 255, 0xb8 / 255, 0xa3 / 255], // institutional  — stk-institutional Stein
] as const;

/** Pentagon arrangement of the five stakeholder centers. */
const STAKEHOLDER_POS: ReadonlyArray<readonly [number, number, number]> = [
  [0.0, 0.85, -0.6], // city — top
  [1.5, 0.25, -0.1], // business — upper-right
  [0.95, -0.55, 0.7], // citizens — lower-right
  [-0.95, -0.55, 0.7], // environment — lower-left
  [-1.5, 0.25, -0.1], // institutional — upper-left
];

const NUM_STAKEHOLDERS = 5;
const CLUSTER_SIGMA = 0.22;

export function generateConflicts(
  count: number,
  seed = 56789,
): { positions: Float32Array; colors: Float32Array } {
  const rng = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const si = i % NUM_STAKEHOLDERS;
    const center = STAKEHOLDER_POS[si]!;
    const color = STAKEHOLDER_RGB[si]!;

    const u1 = Math.max(1e-7, rng());
    const u2 = rng();
    const r = Math.sqrt(-2 * Math.log(u1));
    const phi = 2 * Math.PI * u2;
    const gx = r * Math.cos(phi);
    const gy = r * Math.sin(phi);

    const u3 = Math.max(1e-7, rng());
    const u4 = rng();
    const gz = Math.sqrt(-2 * Math.log(u3)) * Math.cos(2 * Math.PI * u4);

    positions[i * 3 + 0] = center[0] + gx * CLUSTER_SIGMA;
    positions[i * 3 + 1] = center[1] + gy * CLUSTER_SIGMA;
    positions[i * 3 + 2] = center[2] + gz * CLUSTER_SIGMA;

    colors[i * 3 + 0] = color[0];
    colors[i * 3 + 1] = color[1];
    colors[i * 3 + 2] = color[2];
  }

  return { positions, colors };
}
