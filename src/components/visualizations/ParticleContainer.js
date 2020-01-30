import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { scaleOrdinal, scaleQuantize, max } from "d3";
import { groupBy } from "lodash-es";

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
      1,
      3500
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

    this.createGeometry();
    this.createMesh();

    this.animate = this.animate.bind(this);
    this.animate();
  }

  addLights() {
    this.scene.fog = new THREE.Fog(0x050505, 2000, 3500);
    this.scene.add(new THREE.AmbientLight(0x444444));
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
  constructor({ canvas, stats, data, topics, country = "United States" }) {
    super({ canvas, stats });
    this.data = data;
    this.topics = topics;
    this.country = country;
    this.init();
  }

  updateCountry() {
    // updates positions
  }

  createGeometry() {
    const points = this.data.length;
    this.geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(points * 3);
    const colors = new Float32Array(points * 3);

    const color = new THREE.Color(0xffffff);
    const levels = max(this.topics, d => d.level);
    const perLevelDistance = 40;

    const radius = 100;

    const topicScale = scaleOrdinal().domain(
      this.topics.map(t => `${t.level}_${t.name}`)
    );

    topicScale.range(
      topicScale.domain().map(t => {
        const level = parseInt(t.split("_")[0]);
        const topic = t.split("_")[1];
        const topicsOnLevel = this.topics
          .filter(t => +t.level === level)
          .map(t => t.name);
        const topicIdx = topicsOnLevel.indexOf(topic);
        console.log(topicsOnLevel, topic);
        // console.log(topicIdx / topicsOnLevel.length);

        const angle = (topicIdx / topicsOnLevel.length) * 2 * Math.PI;

        const r0 = 20 + (radius * level) / 2;
        // const r0 = (topicIdx / topicsOnLevel.length) * 50;

        return {
          x: r0 * Math.cos(angle) - radius / 2,
          y: level * perLevelDistance,
          z: r0 * Math.sin(angle) - radius / 2,
          angle
        };
      })
    );

    for (var i = 0; i < this.data.length; i += 3) {
      const i3 = i / 3;

      const coords = topicScale(`${this.data[i3].level}_${this.data[i3].name}`);

      positions[i] = coords.x;
      positions[i + 1] = (coords.y + Math.random() * perLevelDistance) / 2;
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
