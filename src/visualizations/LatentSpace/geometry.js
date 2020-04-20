import * as THREE from "three";

import { dataTexShaderFS } from "../../shaders/point.fs.js";
import { dataTexShaderVS } from "../../shaders/point.vs.js";

// stateless geometry generation
export function nodes({ data, colorMap, opacityMap, visibilityMap }) {
  let geometry = new THREE.BufferGeometry();

  let attributes = {
    id: [],
    position: [],
    color: [],
    opacity: [],
    size: [],
    visible: [],
  };

  geometry.userData.ids = [];

  let color = new THREE.Color();

  for (let i = 0; i < data.length; i++) {
    const { x, y, z, id } = data[i];
    color.setRGB(1, 1, 1);

    attributes.id.push(id);
    geometry.userData.ids.push(id);

    attributes.position.push(x, y, z);
    attributes.color.push(color.r, color.g, color.b);

    // this will eventually changed based on
    // citations or other metrics
    attributes.opacity.push(Math.random());
    attributes.visible.push(1);

    attributes.size.push(120 + Math.random() * 50);
  }

  // @todo using Float32 for ids causes precision loss.
  // Consider using userData instead?
  // geometry.setAttribute(
  //   "id",
  //   new THREE.Uint32BufferAttribute(attributes.id, 1)
  // );

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(attributes.position, 3)
  );

  geometry.setAttribute(
    "customColor",
    new THREE.Float32BufferAttribute(attributes.color, 3)
  );

  geometry.setAttribute(
    "opacity",
    new THREE.Float32BufferAttribute(attributes.opacity, 1)
  );
  geometry.morphAttributes.opacity = [];

  geometry.setAttribute(
    "size",
    new THREE.Float32BufferAttribute(attributes.size, 1)
  );

  geometry.setAttribute(
    "visible",
    new THREE.Float32BufferAttribute(attributes.visible, 1)
  );

  geometry.computeBoundingSphere();

  let material = new THREE.ShaderMaterial({
    uniforms: {
      color: {
        value: new THREE.Color(0xffffff),
      },
      // pointTexture: { value: texture },
      // fogColor: { type: "c", value: new THREE.Color(0xfff) },
      // fogNear: { type: "f", value: 0 },
      // fogFar: { type: "f", value: 100 },
    },

    vertexShader: dataTexShaderVS,
    fragmentShader: dataTexShaderFS,

    blending: THREE.NormalBlending,
    // do we depend on draw order or coordinates in order to calculate depth?
    depthTest: true,
    depthWrite: true,
    // fog: true,
    alphaTest: 0.1,
    transparent: true,
    side: THREE.DoubleSide,
    // extensions: {
    //   fragDepth: true,
    // },
  });

  return {
    geometry,
    material,
  };
}

export function cursor() {
  let geometry = new THREE.SphereBufferGeometry(this.searchThreshold, 8, 8);
  // let sphereMaterial = new THREE.MeshBasicMaterial({
  //   color: 0xe0e0ff,
  //   wireframe: true
  // });
  var material = new THREE.MeshNormalMaterial({
    // color: 0xffffff,
    wireframe: false,
    // wireframeLinewidth: 10,
    opacity: 0.75,
    transparent: true,
    // flatShading: true,
    depthTest: true,
    depthWrite: true,
    side: THREE.FrontSide,
  });

  return { geometry, material };
}
