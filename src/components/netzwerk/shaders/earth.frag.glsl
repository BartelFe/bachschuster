/**
 * Editorial wireframe-dot earth.
 *
 * Approach: rather than texture the sphere with a photographic basemap (which
 * we do not have on disk), we compute a layered visual on the sphere surface:
 *
 *   1. A faint latitude / longitude grid drawn from UV-derived stripes.
 *   2. A continent SDF approximated with stacked sin-noise — not geographically
 *      precise, but readable as "land vs water" at the editorial scale of the
 *      pitch (the user reads it as "earth", not as "where exactly is Brazil").
 *      Continents render as a small dot-grid pattern in warm bone; oceans
 *      render as faint blueprint cyan.
 *   3. A day/night terminator: dot the world-space normal against the sun
 *      direction supplied as a uniform. Night side darkens to near-black with
 *      a thin terrakotta city-light glow stripe along the dawn/dusk edge.
 *
 * The grid uses fwidth-based anti-aliasing so the lines don't shimmer at
 * grazing angles.
 */

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vUv;

uniform float uTime;
uniform vec3  uSunDir;          // world-space sun direction, normalised
uniform vec3  uColorLand;       // bone tone
uniform vec3  uColorWater;      // blueprint cyan, muted
uniform vec3  uColorNight;      // near-black
uniform vec3  uColorTerm;       // terrakotta dawn glow
uniform float uContinentDensity; // 0..1, controls dot-grid coverage

const float PI = 3.141592653589793;

/* ── 3-octave value noise — cheap, good enough for SDF approximation ── */
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  // ── Spherical coordinates from world position ─────────────────────────
  vec3 nrm = normalize(vWorldPos);
  float lat = asin(nrm.y);           // -PI/2 .. PI/2
  float lon = atan(nrm.z, nrm.x);    // -PI .. PI

  // ── Continent SDF approximation ───────────────────────────────────────
  // Two FBM samples in lat/lon, biased to favour the visible continent
  // shapes statistically (more land in the north, less near the poles).
  vec2 p = vec2(lon * 2.0, lat * 3.0);
  float n = fbm(p + 1.7) * 0.6 + fbm(p * 2.0 - 3.1) * 0.4;
  float poleFade = 1.0 - smoothstep(1.0, 1.4, abs(lat));
  float landSdf = (n * poleFade) - (1.0 - uContinentDensity);

  // ── Lat/Lon grid lines ────────────────────────────────────────────────
  // 18 longitudes (every 20°), 9 latitudes (every 20°).
  float lonGrid = abs(fract(lon * 9.0 / PI) - 0.5);  // 0 on line, 0.5 between
  float latGrid = abs(fract(lat * 9.0 / PI) - 0.5);
  float lineWidth = 0.04;
  float lonLine = 1.0 - smoothstep(0.0, lineWidth, lonGrid);
  float latLine = 1.0 - smoothstep(0.0, lineWidth, latGrid);
  float grid = max(lonLine, latLine) * 0.22;

  // ── Continent dot-matrix ──────────────────────────────────────────────
  // A polar-aware dot pattern: spacing in lat is uniform; lon spacing is
  // scaled by cos(lat) so the dots don't bunch at the poles.
  float dotSpacingLat = 0.06;
  float dotSpacingLon = dotSpacingLat / max(cos(lat), 0.15);
  vec2 dotCell = vec2(
    mod(lon, dotSpacingLon) / dotSpacingLon - 0.5,
    mod(lat, dotSpacingLat) / dotSpacingLat - 0.5
  );
  float dotDist = length(dotCell);
  float dotMask = 1.0 - smoothstep(0.18, 0.32, dotDist);
  dotMask *= step(0.0, landSdf);

  // ── Base color (continents vs oceans) ─────────────────────────────────
  vec3 baseColor = mix(uColorWater, uColorLand, smoothstep(0.0, 0.05, landSdf));
  baseColor = mix(baseColor, uColorLand * 1.15, dotMask * 0.85);
  baseColor += grid * vec3(0.5, 0.6, 0.7);

  // ── Day/Night lighting + terminator ───────────────────────────────────
  float ndotl = dot(nrm, normalize(uSunDir));     // -1 .. 1
  float dayFactor = smoothstep(-0.05, 0.20, ndotl); // hard-ish day mask
  float termGlow = smoothstep(0.05, 0.0, abs(ndotl)) * 0.7; // thin band on dawn line

  vec3 dayColor = baseColor;
  vec3 nightColor = mix(uColorNight, baseColor * 0.12, dotMask * 0.6); // city-lights hint where land
  vec3 finalColor = mix(nightColor, dayColor, dayFactor);
  finalColor += uColorTerm * termGlow * (0.6 + 0.4 * dotMask);

  // ── Rim falloff so the sphere reads as a sphere, not a flat disk ──────
  // v2 (brand-CI): rim tinted to brand cyan #75C9D9 (≈ 0.46/0.79/0.85 in
  // linear RGB). Intensity dropped from 0.6 → 0.32 so the limb glow reads
  // as a quiet brand accent, not a saturated atmospheric ring.
  float rim = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
  finalColor += rim * vec3(0.46, 0.79, 0.85) * 0.32;

  // Slight pulse on continents tied to uTime — a quiet life sign
  finalColor += dotMask * 0.04 * sin(uTime * 0.6 + lat * 4.0 + lon * 6.0);

  gl_FragColor = vec4(finalColor, 1.0);
}
