import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Renderer3D {
  constructor({ canvas, stats }) {
    this.canvas = canvas;
    // stats && (this.stats = stats);
    if (stats) this.stats = stats;

    this.init();
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

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.setClearColor(new THREE.Color(0x0c0c0c), 0);

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    this.onWindowResize = this.onWindowResize.bind(this);
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);

    window.addEventListener("resize", this.onWindowResize, false);
    document.addEventListener("mousemove", this.onDocumentMouseMove, false);

    // this.animate = this.animate.bind(this);
    // this.animate();
  }

  addLights() {
    // this.scene.fog = new THREE.Fog(0x050505, 2000, 3500);
    // this.scene.add(new THREE.AmbientLight(0xeeeeee));
  }

  // animate() {
  //   requestAnimationFrame(this.animate);

  //   this.render();
  //   if (this.stats) this.stats.update();
  // }

  onWindowResize() {
    console.log("window resize");
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onDocumentMouseMove(event) {
    event.preventDefault();

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  render() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.renderer.render(this.scene, this.camera);
  }
}
