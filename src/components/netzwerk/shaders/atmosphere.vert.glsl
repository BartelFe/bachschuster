varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 viewPos = viewMatrix * modelMatrix * vec4(position, 1.0);
  vViewDir = normalize(-viewPos.xyz);
  gl_Position = projectionMatrix * viewPos;
}
