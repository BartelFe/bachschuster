/**
 * Layer 3 — Soziale Cluster.
 *
 * Particles aggregate around 6 cluster centroids using a Voronoi-style
 * round-robin assignment (so each cluster gets equal mass) and a Gaussian
 * placement around each centroid (Box-Muller). Result is organic, blob-like
 * pulsation when the curl-noise idle drift adds movement on top.
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

const NUM_CLUSTERS = 6;
const CLUSTER_SIGMA = 0.32; // standard deviation, ~80 % within 0.5 units

export function generateSocialClusters(count: number, seed = 45678): Float32Array {
  const rng = mulberry32(seed);

  // Cluster centers spread across the volume.
  const cx = new Float32Array(NUM_CLUSTERS);
  const cy = new Float32Array(NUM_CLUSTERS);
  const cz = new Float32Array(NUM_CLUSTERS);
  for (let i = 0; i < NUM_CLUSTERS; i++) {
    cx[i] = (rng() * 2 - 1) * 2.3;
    cy[i] = -0.2 + rng() * 1.1;
    cz[i] = (rng() * 2 - 1) * 1.9;
  }

  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Round-robin assignment keeps cluster sizes balanced.
    const ci = i % NUM_CLUSTERS;

    // Box-Muller for two independent standard-normal samples, then a third
    // by re-running with different random pairs.
    const u1 = Math.max(1e-7, rng());
    const u2 = rng();
    const r = Math.sqrt(-2 * Math.log(u1));
    const phi = 2 * Math.PI * u2;
    const gx = r * Math.cos(phi);
    const gy = r * Math.sin(phi);

    const u3 = Math.max(1e-7, rng());
    const u4 = rng();
    const gz = Math.sqrt(-2 * Math.log(u3)) * Math.cos(2 * Math.PI * u4);

    out[i * 3 + 0] = cx[ci]! + gx * CLUSTER_SIGMA;
    out[i * 3 + 1] = cy[ci]! + gy * CLUSTER_SIGMA;
    out[i * 3 + 2] = cz[ci]! + gz * CLUSTER_SIGMA;
  }

  return out;
}
