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
      position: [],
      color: [],
      size: [],
      opacity: []
    };

    var color = new THREE.Color();

    for (let i = 0; i < this.layout.nodes.length; i++) {
      const { x, y, z } = this.layout.nodes[i];
      color.setRGB(1, 1, 1);

      this.attributes.position.push(x, y, z);
      this.attributes.color.push(color.r, color.g, color.b);
      this.attributes.size.push(50 + Math.random() * 50);
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
    console.groupCollapsed("Updating attributes for filterPapers");
    console.time("Updating opacity attributes");
    const opacities = this.geometry.attributes.opacity.array;

    const nodes = this.layout.nodes.map(d => d.id);

    if (!ids) {
      for (let i = 0; i < opacities.length; i++) {
        opacities[i] = Math.random() * 0.5 + 0.5;
      }
    } else {
      for (let i = 0; i < opacities.length; i++) {
        opacities[i] = 0;
      }
      ids.forEach(id => {
        let idx = nodes.indexOf(id);
        opacities[idx] = Math.random() * 0.5 + 0.5;
      });
    }

    console.timeEnd("Updating opacity attributes");
    console.groupEnd("Updating attributes for filterPapers");
    this.geometry.attributes.opacity.needsUpdate = true;
  }

  // takes an array of {color, id}
  colorPapers(papers) {
    console.groupCollapsed("Updating color attributes");
    console.time("Updating color attributes");
    const colors = this.geometry.attributes.customColor.array;

    const color = new THREE.Color();

    const nodes = this.layout.nodes.map(d => d.id);

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
