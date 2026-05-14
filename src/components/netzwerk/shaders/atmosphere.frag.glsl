/**
 * Atmospheric rim glow.
 *
 * A slightly larger shell sphere rendered with additive blending. The fresnel
 * term peaks at the limb (where view ray is tangent to surface) and drops
 * off to zero at the centre.
 */

varying vec3 vNormal;
varying vec3 vViewDir;

uniform vec3 uColor;
uniform float uIntensity;

void main() {
  float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.6);
  vec3 col = uColor * fresnel * uIntensity;
  gl_FragColor = vec4(col, fresnel * 0.85);
}
