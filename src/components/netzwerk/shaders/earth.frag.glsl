/**
 * Holographic editorial earth.
 *
 * v4 — switched from FBM-faked continents to a real Natural Earth land mask
 * sampled from `uLandMask`. The look now matches the brief reference: pure
 * black ocean, glowing white coastline outlines, uniform dot-grid that's
 * brighter on land, and a soft blue-white limb glow. No day/night terminator
 * any more — this is a sci-fi data globe, not a photoreal earth.
 *
 *   1. Sample land mask with 4 neighbour taps to derive a coastline gradient.
 *   2. Polar-aware dot grid covers the whole sphere, brighter over land.
 *   3. Coastline drawn with an anti-aliased edge of the gradient.
 *   4. Fresnel rim adds the bright limb halo seen in the reference.
 */

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vUv;

uniform float uTime;
uniform sampler2D uLandMask;
uniform vec3  uColorLine;        // bright white-blue, for coast outlines
uniform vec3  uColorDot;         // dot grid colour, dim cyan
uniform vec3  uColorLand;        // subtle wash inside continents
uniform vec3  uColorRim;         // limb halo colour
uniform float uLineWidth;        // coastline width in radians on the sphere
uniform float uDotIntensity;     // 0..1 dot-grid brightness over water
uniform float uLandBoost;        // multiplier for dots over land

const float PI = 3.141592653589793;

/* Sample the land mask at a spherical normal — re-derives lat/lon so the
   texture coordinate is independent of the SphereGeometry's UV winding. */
float sampleLand(vec3 n) {
  float lon = atan(n.z, n.x);
  float lat = asin(clamp(n.y, -1.0, 1.0));
  vec2 uv = vec2(0.5 - lon / (2.0 * PI), 0.5 - lat / PI);
  return texture2D(uLandMask, uv).r;
}

void main() {
  vec3 nrm = normalize(vWorldPos);
  float lat = asin(clamp(nrm.y, -1.0, 1.0));
  float lon = atan(nrm.z, nrm.x);

  /* ── Land mask + coastline gradient ───────────────────────────────── */
  float land = sampleLand(nrm);

  // 4-tap neighbour sample in tangent space to derive the coastline.
  vec3 tEast  = normalize(vec3(-nrm.z, 0.0, nrm.x));
  vec3 tNorth = cross(nrm, tEast);
  float eps = uLineWidth;
  float lE = sampleLand(normalize(nrm + tEast * eps));
  float lW = sampleLand(normalize(nrm - tEast * eps));
  float lN = sampleLand(normalize(nrm + tNorth * eps));
  float lS = sampleLand(normalize(nrm - tNorth * eps));
  float edge = max(max(abs(lE - lW), abs(lN - lS)),
                   max(abs(lE - land), abs(lN - land)));
  float coast = smoothstep(0.05, 0.35, edge);

  /* ── Dot grid over the whole sphere ───────────────────────────────── */
  float dotSpacingLat = 0.045;
  float dotSpacingLon = dotSpacingLat / max(cos(lat), 0.18);
  vec2 dotCell = vec2(
    mod(lon, dotSpacingLon) / dotSpacingLon - 0.5,
    mod(lat, dotSpacingLat) / dotSpacingLat - 0.5
  );
  float dotDist = length(dotCell);
  float dotMask = 1.0 - smoothstep(0.16, 0.30, dotDist);
  float dotStrength = mix(uDotIntensity, uDotIntensity * uLandBoost, land);
  vec3 dotCol = uColorDot * dotMask * dotStrength;

  /* ── Coastline outline ────────────────────────────────────────────── */
  vec3 coastCol = uColorLine * coast;

  /* ── Subtle fill on land so it reads as a continent, not just dots ── */
  vec3 landFill = uColorLand * land * 0.18;

  /* ── Compose base ─────────────────────────────────────────────────── */
  vec3 col = landFill + dotCol + coastCol;

  /* ── Fresnel limb glow ────────────────────────────────────────────── */
  float ndv = max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
  float rim = pow(1.0 - ndv, 2.4);
  col += uColorRim * rim * 0.9;

  /* ── Quiet life-sign: tiny pulse across the land dots ─────────────── */
  col += dotMask * land * 0.05 * sin(uTime * 0.5 + lat * 4.0 + lon * 6.0);

  gl_FragColor = vec4(col, 1.0);
}
