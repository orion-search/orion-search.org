import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { scaleOrdinal, scaleQuantize, extent, scaleLinear } from "d3";
import { Vector3 } from "three";

export default class ParticleContainer {
  constructor({ canvas, stats }) {
    this.stats = stats;
    this.canvas = canvas;

    // this.init();

    console.log("initializing particle container");
  }

  init() {
    this.camera = new THREE.PerspectiveCamera(
      27,
      window.innerWidth / window.innerHeight,
      0.001,
      35000
    );
    this.camera.position.z = 750;
    this.controls = new OrbitControls(this.camera, this.canvas);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c0c0c);
    this.addLights();

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    this.onWindowResize = this.onWindowResize.bind(this);
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);

    window.addEventListener("resize", this.onWindowResize, false);
    document.addEventListener("mousemove", this.onDocumentMouseMove, false);

    // this.createGeometry();
    // this.createMesh();

    // this.animate = this.animate.bind(this);
    // this.animate();
  }

  addLights() {
    this.scene.fog = new THREE.Fog(0x050505, 2000, 3500);
    this.scene.add(new THREE.AmbientLight(0xffffff));

    // var light = new THREE.HemisphereLight(0xffffff, 0x000088);
    // light.position.set(-1, 1.5, 1);
    // this.scene.add(light);

    // var light = new THREE.HemisphereLight(0xffffff, 0x880000, 1);
    // light.position.set(-1, -1.5, -1);
    // this.scene.add(light);
  }

  createGeometry() {
    const points = 60000;

    this.geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(points * 3);
    const colors = new Float32Array(points * 3);

    const color = new THREE.Color(0xff00ff);
    const levels = 6;
    const pointsPerLevel = points / levels;
    const perLevelDistance = 40;
    const radius = 100;

    const clustersPerLevel = 10;

    // const scales = Array(6).fill().map(d => scaleBand.().domain(Array(clustersPerLevel).fill().).range([0, 2 * Math.PI]))
    const scale = scaleQuantize()
      .domain([0, 1])
      .range(
        Array(clustersPerLevel)
          .fill()
          .map((d, i) => (i / clustersPerLevel) * Math.PI * 2)
      );

    for (var i = 0; i < positions.length; i += 3) {
      const i3 = i / 3;

      const currentLevel = Math.floor(i3 / (points / levels));

      const currentCluster = (i3 % pointsPerLevel) / pointsPerLevel;
      const angle0 = scale(currentCluster);

      const r0 = (radius * currentLevel) / 2;
      const r1 = Math.random() * (r0 / 4);

      const angle1 =
        ((i3 % (pointsPerLevel / clustersPerLevel)) /
          (pointsPerLevel / clustersPerLevel)) *
        Math.PI *
        2;

      // positions[i] = Math.random() * radius;
      positions[i] = r0 * Math.cos(angle0) + r1 * Math.cos(angle1) - radius / 2;
      positions[i + 1] =
        currentLevel * perLevelDistance - (levels * perLevelDistance) / 2;
      positions[i + 2] =
        r0 * Math.sin(angle0) + r1 * Math.sin(angle1) - radius / 2;
      // positions[i + 2] = Math.random() * 100;

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

  createMesh() {
    var material = new THREE.PointsMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      vertexColors: THREE.VertexColors
    });

    this.mesh = new THREE.Points(this.geometry, material);
    this.scene.add(this.mesh);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  onDocumentMouseMove(event) {
    event.preventDefault();

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  render() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // const intersects = this.raycaster.intersectObject(this.mesh);

    // if (intersects.length) {
    //   console.log("intersects");
    // }

    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    requestAnimationFrame(this.animate);

    this.render();
    this.stats.update();
  }
}

export class FieldOfStudyParticles extends ParticleContainer {
  constructor({ canvas, stats, data, topics, country }) {
    super({ canvas, stats });
    this.topics = topics;
    this.country = country;

    this.data = data;
    this.filteredData = this.data.filter(d => d.country === this.country);

    this.setScale();
    this.init();
    this.createGeometry();
    // this._createGeometry();
    // this.createMesh();
    this.animate = this.animate.bind(this);
    this.animate();
  }

  updateCountry(country) {
    this.country = country;
    this.filteredData = this.data.filter(d => d.country === this.country);
    this.scene.remove(this.mesh);
    this.createGeometry();
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

  createGeometry() {
    const points = this.filteredData.length;
    this.geometry = new THREE.SphereBufferGeometry(0.5, 20, 20);

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
    this.mesh.castShadow = true;

    var transform = new THREE.Object3D();
    transform.castShadow = true;

    for (var i = 0; i < this.filteredData.length; i++) {
      const coords = this.topicScale(
        `${this.filteredData[i].level}_${this.filteredData[i].name}`
      );

      transform.position.set(coords.x, coords.y, coords.z);

      const size = this.sizeScale(this.filteredData[i].total_papers);

      transform.scale.set(size, size, size);

      transform.updateMatrix();

      this.mesh.setMatrixAt(i, transform.matrix);
    }

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
