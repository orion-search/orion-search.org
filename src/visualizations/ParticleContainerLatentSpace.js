import * as THREE from "three";
import Renderer3D from "./Renderer3D";
import { extent } from "d3";

import { dataTexShaderFS } from "../shaders/point.fs.js";
import { dataTexShaderVS } from "../shaders/point.vs.js";
import { accessors } from "../utils";

const VISIBLE = 1.0;
const NOT_VISIBLE = 0.0;

// function generateTexture(data, width) {
//   const tex = new THREE.DataTexture(
//     data,
//     width,
//     width,
//     THREE.RGBFormat,
//     THREE.FloatType
//   );

//   tex.minFilter = THREE.NearestFilter;
//   tex.magFilter = THREE.NearestFilter;

//   return tex;
// }

// function generateDataArray(valueMap, width, initialVal = 0) {
//   const texValues = new Float32Array(width * width * 3).fill(initialVal);
//   var idx = 0;
//   valueMap.forEach((val, key, map) => {
//     texValues[idx] = val;
//     texValues[idx + 1] = val;
//     texValues[idx + 2] = val;
//     idx += 3;
//   });
//   return texValues;
// }

export class ParticleContainerLatentSpace extends Renderer3D {
  constructor({ layout, canvas }) {
    super({ canvas });

    this.layout = layout;
    this.transform = new THREE.Object3D();

    // camera transformations
    const [, farClippingPlane] = extent(this.layout.nodes, d => d.z);

    this.camera.far = farClippingPlane * 20;
    this.camera.position.z = 4000;
    this.camera.updateProjectionMatrix();

    this.createGeometry();
    // this.updateGeometry(layout);

    this.animate = this.animate.bind(this);
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate);

    var time = Date.now() * 0.005;

    for (var i = 0; i < this.geometry.attributes.size.array.length; i++) {
      this.geometry.attributes.size.array[i] += 0.5 * Math.sin(0.1 * i + time);
    }

    this.geometry.attributes.size.needsUpdate = true;
    // this.geometry.attributes.color.needsUpdate = true;

    this.meshNodes.rotation.y = time * 0.005;

    this.render();
  }

  createGeometry() {
    this.geometry = new THREE.BufferGeometry();

    this.attributes = {
      id: [],
      position: [],
      color: [],
      opacity: [],
      size: [],
      visible: []
    };

    // Keeps track of the visibility state of each observation.
    // Reset and mutated based on current filtering rules
    this.visibilityMap = new Map();
    this.opacityMap = new Map();

    var color = new THREE.Color();

    this.textureWidth = Math.ceil(Math.log2(this.layout.nodes.length)) ** 2;

    for (let i = 0; i < this.layout.nodes.length; i++) {
      const { x, y, z, id } = this.layout.nodes[i];
      color.setRGB(1, 1, 1);

      this.attributes.id.push(id);
      this.attributes.position.push(x, y, z);
      this.attributes.color.push(color.r, color.g, color.b);

      // this will eventually changed based on
      // citations or other metrics
      const o = Math.random();
      this.opacityMap.set(id, o);
      this.attributes.opacity.push(o);

      this.attributes.size.push(120 + Math.random() * 50);

      // populate our ID map for O(1) access
      // 1 - show / 0 - hide
      this.visibilityMap.set(id, VISIBLE);
      this.attributes.visible.push(VISIBLE);
    }

    this.geometry.setAttribute(
      "id",
      new THREE.Float32BufferAttribute(this.attributes.id, 1)
    );

    this.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(this.attributes.position, 3)
    );

    this.geometry.setAttribute(
      "customColor",
      new THREE.Float32BufferAttribute(this.attributes.color, 3)
    );

    this.geometry.setAttribute(
      "opacity",
      new THREE.Float32BufferAttribute(this.attributes.opacity, 1)
    );

    this.geometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(this.attributes.size, 1)
    );

    this.geometry.setAttribute(
      "visible",
      new THREE.Float32BufferAttribute(this.attributes.visible, 1)
    );

    this.geometry.computeBoundingSphere();

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        color: {
          value: new THREE.Color(0xffffff)
        }
      },

      vertexShader: dataTexShaderVS,
      fragmentShader: dataTexShaderFS,

      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });

    this.meshNodes = new THREE.Points(this.geometry, this.material);

    this.meshNodes = this.scene.add(this.meshNodes);
  }

  // filters papers by IDs
  // @todo: this could be done in a web worker
  filterPapers(ids) {
    console.log("filtering papers");
    console.groupCollapsed("Updating attributes for filterPapers");
    console.time("Updating opacity attributes");

    if (!ids) {
      this.visibilityMap.forEach((val, key, map) => map.set(key, 1.0));
    } else {
      this.visibilityMap.forEach((val, key, map) => map.set(key, 0.0));
      ids.forEach(id => {
        this.visibilityMap.has(id) && this.visibilityMap.set(id, 1.0);
      });
    }

    console.log(this.visibilityMap.size, "papers");
    this.geometry.attributes.visible.set(
      Float32Array.from(this.visibilityMap.values()),
      0
    );

    console.timeEnd("Updating opacity attributes");
    console.groupEnd("Updating attributes for filterPapers");
    this.geometry.attributes.visible.needsUpdate = true;
  }

  // takes an array of {color, id}
  colorPapers(papers) {
    console.groupCollapsed("Updating color attributes");
    console.time("Updating color attributes");
    const colors = this.geometry.attributes.customColor.array;

    const color = new THREE.Color();

    const nodes = this.layout.nodes.map(d => accessors.types.id(d));

    papers.forEach(p => {
      let idx3 = nodes.indexOf(p.id) * 3;
      color.set(p.color);
      colors[idx3] = color.r;
      colors[idx3 + 1] = color.g;
      colors[idx3 + 2] = color.b;
    });

    console.timeEnd("Updating color attributes");
    console.groupEnd("Updating color attributes");
    this.geometry.attributes.customColor.needsUpdate = true;
  }

  resetColors() {
    console.groupCollapsed("Resetting color attributes");
    console.time("Resetting color attributes");
    const colors = this.geometry.attributes.customColor.array;
    const color = new THREE.Color();
    color.set(0xffffff);
    for (let i = 0; i < colors.length; i += 3) {
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    console.timeEnd("Resetting color attributes");
    console.groupEnd("Resetting color attributes");
  }

  // updateGeometry({ nodes }) {
  //   nodes.forEach((node, i) => {
  //     this.transform.position.set(node.x, node.y, node.z);

  //     this.transform.scale.set(node.r, node.r, node.r);
  //     this.transform.updateMatrix();
  //     this.meshNodes.setMatrixAt(i, this.transform.matrix);
  //   });

  //   this.meshNodes.instanceMatrix.needsUpdate = true;
  //   this.meshNodes.updateMatrix();

  //   this.nodes.computeBoundingSphere();
  // }
}
