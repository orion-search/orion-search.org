export const dataTexShaderFS = `
uniform vec3 color;

varying vec3 vColor;
varying float vOpacity;
varying float vHide;

void main() {
  if (vHide > .5) {
    discard;
  }
  // vec3 colorMod = vec3(1.);
  // if (vHide < 0.5) { 
    // colorMod = vec3(1., 0., 0.);
    // discard;
  // }

  if (distance(gl_PointCoord, vec2(0.5, .5)) > .5)
    discard;

  gl_FragColor = vec4(color * vColor, vOpacity);
}
`;

export default `
uniform vec3 color;

varying vec3 vColor;
varying float vOpacity;

void main() {

  if (distance(gl_PointCoord, vec2(0.5, .5)) > .5)
    discard;
idM
  gl_FragColor = vec4(color * vColor, vOpacity);
}
`;
