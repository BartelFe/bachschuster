/**
 * Flowing connection arc.
 *
 * A scrolling dash-pattern along the arc parameter t∈[0,1]. The leading edge
 * of each dash is brighter than the trailing edge to suggest direction —
 * connections "flow" from Ingolstadt (Hauptsitz) outward.
 */

varying float vT;

uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uDashCount;

void main() {
  float pulse = fract(vT * uDashCount - uTime * uSpeed);
  // Asymmetric dash: bright leading edge, fade tail
  float head = smoothstep(0.0, 0.06, pulse) * (1.0 - smoothstep(0.06, 0.35, pulse));
  float tail = (1.0 - smoothstep(0.35, 1.0, pulse)) * 0.18;
  float intensity = head + tail;

  gl_FragColor = vec4(uColor * intensity, intensity * 0.9);
}
