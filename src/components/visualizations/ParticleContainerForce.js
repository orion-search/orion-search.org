/**
 * @todo we should be accessing the nodes and links
 * after ticking the web worker
 */

import * as THREE from "three";
import Renderer3D from "./Renderer3D";

export class ParticleContainerForce extends Renderer3D {
  constructor({ layout, canvas, stats }) {
    super({ canvas, stats });

    this.layout = layout;
    this.transform = new THREE.Object3D();

    this.createGeometry();

    this.animate = this.animate.bind(this);
    this.animate();

    this.tick$ = this.layout.forceLayout().tick$;

    /* @todo this doesn't work for some reason */
    // this.layout.forceLayout().tick$.subscribe(({ data: { nodes, links } }) => {
    //   this.updateGeometry({ nodes, links });
    // });
  }

  updateGeometry({ nodes, links }) {
    // var transform = new THREE.Object3D();
    this.transform.castShadow = true;

    nodes.forEach((node, i) => {
      this.transform.position.set(node.x, node.y, 0);

      this.transform.scale.set(node.r, node.r, node.r);
      this.transform.updateMatrix();
      this.meshNodes.setMatrixAt(i, this.transform.matrix);
    });

    const p = this.meshLinks.geometry.attributes.position.array;
    links.forEach((link, i) => {
      let i6 = i * 3 * 2;
      p[i6++] = link.source.x;
      p[i6++] = link.source.y;
      p[i6++] = 0;
      p[i6++] = link.target.x;
      p[i6++] = link.target.y;
      p[i6] = 0;
    });
    this.meshLinks.geometry.attributes.position.needsUpdate = true;
    this.meshLinks.updateMatrix();
    this.links.computeBoundingBox();

    this.meshNodes.instanceMatrix.needsUpdate = true;
    this.meshNodes.updateMatrix();

    this.nodes.computeBoundingSphere();
  }

  createLinkGeometry() {
    var geometry = new THREE.BufferGeometry();
    var vertices = [];

    var vertex = new THREE.Vector3();

    for (var i = 0; i < this.layout.links().length; i++) {
      vertex.x = 0;
      vertex.y = 0;
      vertex.z = 0;

      vertices.push(vertex.x, vertex.y, vertex.z);
      vertices.push(vertex.x + 1, vertex.y + 1, vertex.z + 1);
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    return geometry;
  }

  createGeometry() {
    const points = this.layout.nodes().length;
    this.nodes = new THREE.SphereBufferGeometry(2, 20, 20);
    this.nodes.attributes.position.array.needsUpdate = true;

    this.material = new THREE.MeshPhongMaterial({
      depthWrite: true,
      depthTest: true,
      side: THREE.DoubleSide,
      shininess: 100,
      emissive: 0x0,
      color: 0xffffff,
      specular: 0x111111
    });

    this.links = new THREE.BufferGeometry();
    this.linkMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff
    });
    this.linkGeometry = this.createLinkGeometry();
    this.meshLinks = new THREE.LineSegments(
      this.linkGeometry,
      this.linkMaterial
    );
    this.meshLinks.updateMatrix();
    this.meshLinks.geometry.attributes.position.needsUpdate = true;
    this.scene.add(this.meshLinks);

    this.meshNodes = new THREE.InstancedMesh(this.nodes, this.material, points);

    this.meshNodes.castShadow = true;
    this.meshNodes.receiveShadow = true;

    this.scene.add(this.meshNodes);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.layout.forceLayout().tick();
    // .then(({ nodes, links }) => {
    //   this.updateGeometry({ nodes, links });
    // });
    Promise.all([
      this.layout.forceLayout().nodes(),
      this.layout.forceLayout().links()
    ]).then(data => {
      this.updateGeometry({ nodes: data[0].nodes, links: data[1].links });
    });

    this.render();
    this.stats && this.stats.update();
  }
}
