import {
  Color,
  ShaderMaterial,
  Points,
  BufferGeometry,
  Float32BufferAttribute,
  AdditiveBlending,
} from "three";

import pointVS from "../../shaders/point.vs";
import pointFS from ".././shaders/point.fs";

export const scatterplotMesh = (nodes) => {
  const geometry = new BufferGeometry();
  const attributes = {
    position: [],
    color: [],
    size: [],
    opacity: [],
  };

  var color = new Color();

  for (let i = 0; i < nodes.length; i++) {
    const { x, y, r } = nodes[i];
    color.setRGB(1, 1, 1);

    attributes.position.push(x, y, 0);
    attributes.color.push(color.r, color.g, color.b);
    attributes.size.push(2 * r);
    attributes.opacity.push(1);
  }

  geometry.setAttribute(
    "position",
    new Float32BufferAttribute(attributes.position, 3)
  );

  geometry.setAttribute(
    "customColor",
    new Float32BufferAttribute(attributes.color, 3)
  );

  geometry.setAttribute("size", new Float32BufferAttribute(attributes.size, 1));

  geometry.setAttribute(
    "opacity",
    new Float32BufferAttribute(attributes.opacity, 1)
  );

  geometry.computeBoundingSphere();

  const material = new ShaderMaterial({
    uniforms: {
      color: {
        value: new Color(0xffffff),
      },
      noDepth: {
        value: true,
      },
    },

    vertexShader: pointVS,
    fragmentShader: pointFS,

    blending: AdditiveBlending,
    depthTest: false,
    transparent: true,
  });

  return Points(geometry, material);
};