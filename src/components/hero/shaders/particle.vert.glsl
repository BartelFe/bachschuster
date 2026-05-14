#include "./curl-noise.glsl"

attribute vec3  aTarget0;
attribute vec3  aTarget1;
attribute vec3  aTarget2;
attribute vec3  aTarget3;
attribute vec3  aTarget4;
attribute vec3  aStkColor;
attribute float aRandom;

uniform float uTime;
uniform float uPixelRatio;
uniform float uPointSize;
uniform float uMorph;          // 0..4
uniform float uReveal;         // 0..1 — loading emergence
uniform vec3  uLayerColor0;    // L0 buildings  → data-cyan
uniform vec3  uLayerColor1;    // L1 energy     → accent-glow
uniform vec3  uLayerColor2;    // L2 mobility   → accent-primary
uniform vec3  uLayerColor3;    // L3 social     → bone-muted
// L4 conflicts: color comes from per-particle aStkColor

varying vec3  vColor;
varying float vDistance;
varying float vReveal;

vec3 pickTarget(int layer) {
  if (layer == 0) return aTarget0;
  if (layer == 1) return aTarget1;
  if (layer == 2) return aTarget2;
  if (layer == 3) return aTarget3;
  return aTarget4;
}

vec3 pickColor(int layer) {
  if (layer == 0) return uLayerColor0;
  if (layer == 1) return uLayerColor1;
  if (layer == 2) return uLayerColor2;
  if (layer == 3) return uLayerColor3;
  return aStkColor;
}

void main() {
  // ── Morph (Step 4) ──────────────────────────────────────────────────
  float morph = clamp(uMorph, 0.0, 4.0);
  float layerLow = floor(min(morph, 3.0));
  float layerHigh = layerLow + 1.0;
  float t = smoothstep(0.0, 1.0, morph - layerLow);

  int li = int(layerLow);
  int hi = int(layerHigh);

  vec3 morphedPos = mix(pickTarget(li), pickTarget(hi), t);
  vec3 baseColor = mix(pickColor(li), pickColor(hi), t);

  // ── Loading reveal (Step 8) ─────────────────────────────────────────
  // Particles start in a tight cluster (each at 2% of its target position)
  // and breathe outward to their morphed target as uReveal advances 0→1.
  vec3 emitter = morphedPos * 0.02;
  vec3 basePos = mix(emitter, morphedPos, uReveal);

  // ── Idle curl-noise drift (gated by reveal so it doesn't show pre-emergence)
  vec3 noiseInput = basePos * 0.42 + vec3(uTime * 0.07 + aRandom * 6.2831);
  vec3 drift = curlNoise(noiseInput) * 0.028 * uReveal;

  vec3 pos = basePos + drift;

  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPos;

  float depth = max(-mvPos.z, 0.5);
  gl_PointSize = uPointSize * uPixelRatio * (4.5 / depth);

  vColor = baseColor;
  vDistance = -mvPos.z;
  vReveal = uReveal;
}
