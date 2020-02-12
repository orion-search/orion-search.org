import * as THREE from "three";
import Renderer3D from "./Renderer3D";
import { extent } from "d3";

import pointFS from "../../shaders/point.fs.js";
import pointVS from "../../shaders/point.vs.js";

export class ParticleContainerLatentSpace extends Renderer3D {
  constructor({ layout, canvas }) {
    super({ canvas });
    console.log(canvas);

    this.layout = layout;
    this.transform = new THREE.Object3D();

    // camera transformations
    const [nearClippingPlane, farClippingPlane] = extent(
      this.layout.nodes,
      d => d.z
    );
    console.log(nearClippingPlane, farClippingPlane);
    // this.camera.near = nearClippingPlane;
    this.camera.far = farClippingPlane * 20;
    this.camera.position.z = 100;
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

    this.render();
  }

  createGeometry() {
    this.geometry = new THREE.BufferGeometry();

    this.attributes = {
      position: [],
      color: [],
      size: [],
      opacity: []
    };

    var color = new THREE.Color();

    for (let i = 0; i < this.layout.nodes.length; i++) {
      const { x, y, z } = this.layout.nodes[i];
      color.setRGB(Math.random(), Math.random(), Math.random());

      this.attributes.position.push(x, y, z);
      this.attributes.color.push(color.r, color.g, color.b);
      this.attributes.size.push(Math.random() * 20);
      this.attributes.opacity.push(Math.random());
    }

    this.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(this.attributes.position, 3)
    );

    this.geometry.setAttribute(
      "customColor",
      new THREE.Float32BufferAttribute(this.attributes.color, 3)
    );

    this.geometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(this.attributes.size, 1)
    );

    this.geometry.setAttribute(
      "opacity",
      new THREE.Float32BufferAttribute(this.attributes.opacity, 1)
    );

    this.geometry.computeBoundingSphere();

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        color: {
          value: new THREE.Color(0xffffff)
        }
      },

      vertexShader: pointVS,
      fragmentShader: pointFS,

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
    const attributes = this.geometry.attributes.opacity.array;
    const nodes = this.layout.nodes.map(d => d.id);

    // console.log("gkdsa", ids);

    if (!ids) {
      for (var i = 0; i < attributes.length; i++) {
        attributes[i] = 1;
      }
    } else {
      for (var i = 0; i < attributes.length; i++) {
        attributes[i] = 0;
      }
      ids.forEach(id => {
        var idx = nodes.indexOf(id);
        attributes[idx] = 1;
      });
    }

    this.geometry.attributes.opacity.needsUpdate = true;
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
