precision highp float;

varying vec3  vColor;
varying float vDistance;
varying float vReveal;

void main() {
  // Convert the point quad into a soft round splat.
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;

  // Cosine-ish radial falloff — softer than smoothstep, more bloom-friendly.
  float core = smoothstep(0.5, 0.05, d);

  // Far-field fade so very distant particles don't aliased-flicker.
  float distanceFade = clamp(1.0 - (vDistance - 6.0) * 0.08, 0.25, 1.0);

  // Reveal multiplies alpha so the emergence starts invisible.
  gl_FragColor = vec4(vColor, core * distanceFade * 0.85 * vReveal);
}
