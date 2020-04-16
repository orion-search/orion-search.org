export const dataTexShaderFS = `
uniform vec3 color;
// uniform sampler2D pointTexture;

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

  float border = 0.1;
  float radius = 0.5;
  float dist = radius - distance(gl_PointCoord, vec2(0.5));
  float t = smoothstep(0., border, dist);

  // gl_FragColor = texture2D(pointTexture, gl_PointCoord);

  if (distance(gl_PointCoord, vec2(0.5, .5)) > .5)
    discard;

  gl_FragColor = vec4(color * vColor, vOpacity * t);
}
`;

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
