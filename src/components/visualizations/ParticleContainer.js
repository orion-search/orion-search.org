import * as THREE from "three";
import { scaleOrdinal, extent, scaleLinear } from "d3";
import Renderer3D from "./Renderer3D";

export class FieldOfStudyParticles extends Renderer3D {
  constructor({ canvas, stats, data, topics, country }) {
    super({ canvas, stats });
    // this.init();
    this.topics = topics;
    this.country = country;

    this.coords = [];

    this.data = data;
    this.filteredData = this.data.filter(d => d.country === this.country);

    this.setScale();
    // this.init();
    this.createGeometry();
    // this._createGeometry();
    // this.createMesh();
    this.animate = this.animate.bind(this);
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate);

    this.render();
    if (this.stats) this.stats.update();
  }

  updateCountry(country) {
    this.country = country;
    this.filteredData = this.data.filter(d => d.country === this.country);
    this.scene.remove(this.mesh);
    this.coords = [];
    this.createGeometry();
    // this.updateGeometry();
  }

  setScale() {
    const radius = 200;

    this.perLevelDistance = 40;

    this.topicScale = scaleOrdinal().domain(
      this.topics.map(t => `${t.level}_${t.name}`)
    );

    this.topicScale.range(
      this.topicScale.domain().map(t => {
        const level = parseInt(t.split("_")[0]);
        const topic = t.split("_")[1];
        const topicsOnLevel = this.topics
          .filter(t => +t.level === level)
          .map(t => t.name);
        const topicIdx = topicsOnLevel.indexOf(topic);

        const angle = (topicIdx / topicsOnLevel.length) * 2 * Math.PI;

        const r0 = 20 + radius / 2;

        return {
          level,
          topic,
          x: r0 * Math.cos(angle) - radius / 2,
          y: level * this.perLevelDistance,
          z: r0 * Math.sin(angle) - radius / 2,
          angle
        };
      })
    );

    this.sizeScale = scaleLinear()
      .domain(extent(this.data, d => d.total_papers))
      .range([2, 40]);
  }

  // @todo: need to remove un-needed attributes for this to work correctly
  updateGeometry() {
    var transform = new THREE.Object3D();
    transform.castShadow = true;

    for (var i = 0; i < this.filteredData.length; i++) {
      let topic = this.topics.find(t => t.id === this.filteredData[i].topic);

      if (!topic) {
        topic = this.topics.find(t => t.parent === this.filteredData[i].topic);
        topic.level = topic.level - 1;
        topic.name = topic.parent_name;
      }

      const coords = this.topicScale(`${topic.level}_${topic.name}`);

      this.coords.push(coords);

      transform.position.set(coords.x, coords.y, coords.z);

      const size = this.sizeScale(this.filteredData[i].total_papers);

      transform.scale.set(size, size, size);

      transform.updateMatrix();

      this.mesh.setMatrixAt(i, transform.matrix);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    // this.mesh.updateMatrix();
    // this.mesh.applyMatrix();
    this.geometry.computeBoundingSphere();
  }

  createGeometry() {
    const points = this.filteredData.length;
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

    this.updateGeometry();

    this.scene.add(this.mesh);
  }

  _createGeometry() {
    const points = this.data.length;
    this.geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(points * 3);
    const colors = new Float32Array(points * 3);

    const color = new THREE.Color(0xffffff);

    for (var i = 0; i < this.data.length; i += 3) {
      const i3 = i / 3;

      const coords = this.topicScale(
        `${this.data[i3].level}_${this.data[i3].name}`
      );

      positions[i] = coords.x;
      positions[i + 1] = (coords.y + Math.random() * this.perLevelDistance) / 2;
      positions[i + 2] = coords.z;

      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    this.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    this.geometry.attributes.position.needsUpdate = true;

    this.geometry.computeBoundingSphere();
  }
}
