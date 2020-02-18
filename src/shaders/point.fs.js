export default `
uniform vec3 color;

varying vec3 vColor;
varying float vOpacity;

void main() {
  if (distance(gl_PointCoord, vec2(0.5, .5)) > .5)
    discard;

  gl_FragColor = vec4(color * vColor, vOpacity);
}
`;
