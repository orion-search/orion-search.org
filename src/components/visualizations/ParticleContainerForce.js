import * as THREE from "three";
// import { FieldOfStudyParticles } from "./ParticleContainer";
import Renderer3D from "./Renderer3D";

export class ParticleContainerForce extends Renderer3D {
  constructor({ layout, canvas, stats }) {
    super({ canvas, stats });

    this.layout = layout;
    this.transform = new THREE.Object3D();

    this.createGeometry();

    this.animate = this.animate.bind(this);
    this.animate();
  }

  updateGeometry(nodes) {
    // var transform = new THREE.Object3D();
    this.transform.castShadow = true;

    nodes.forEach((node, i) => {
      this.transform.position.set(node.x, node.y, 0);

      // transform.scale.set()
      this.transform.updateMatrix();
      this.mesh.setMatrixAt(i, this.transform.matrix);
    });

    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.updateMatrix();

    this.geometry.computeBoundingSphere();
  }

  createGeometry() {
    const points = this.layout.nodes().length;
    console.log(points);
    this.geometry = new THREE.SphereBufferGeometry(0.5, 20, 20);

    this.geometry.attributes.position.array.needsUpdate = true;

    this.material = new THREE.MeshPhongMaterial({
      depthWrite: true,
      depthTest: true,
      side: THREE.DoubleSide,
      shininess: 100,
      emissive: 0x0,
      color: 0xff00ff,
      specular: 0x111111
    });

    this.mesh = new THREE.InstancedMesh(this.geometry, this.material, points);
    // this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    // this.mesh.matrixAutoUpdate = true;
    this.mesh.castShadow = true;

    // this.updateGeometry();

    this.scene.add(this.mesh);
  }

  animate() {
    requestAnimationFrame(this.animate);
    // this.layout.nodes();
    this.layout
      .forceLayout()
      .nodes()
      .then(({ nodes }) => {
        this.updateGeometry(nodes);
      });
    // console.log(this.layout.nodes()[10]);
    this.render();
    this.stats && this.stats.update();
  }
}
