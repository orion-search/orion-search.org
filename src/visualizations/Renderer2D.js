import * as THREE from "three";
import theme from "../styles";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Renderer2D {
  constructor({ canvas }) {
    const { width, height } = canvas.getBoundingClientRect();
    this.width = width;
    this.height = height;
    console.log(this.width, this.height);

    this.canvas = canvas;
    this.init();
  }

  init() {
    this.camera = new THREE.OrthographicCamera(
      0,
      this.width,
      0,
      this.height,
      0,
      30
    );

    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0x0c0c0c);

    // this.controls = new OrbitControls(this.camera, this.canvas);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true
    });
    this.renderer.setClearColor(theme.colors.black);
    this.renderer.setSize(this.width, this.height);

    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.raycaster = new THREE.Raycaster();

    this.onWindowResize = this.onWindowResize.bind(this);
    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);

    window.addEventListener("resize", this.onWindowResize, false);
    document.addEventListener("mousemove", this.onDocumentMouseMove, false);
    // this.renderer.setSize()
  }

  onWindowResize() {
    console.log("window resize");
    const { width, height } = this.canvas.getBoundingClientRect();
    this.width = width;
    this.height = height;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }

  onDocumentMouseMove(event) {
    event.preventDefault();

    // this.mouse.x = (event.clientX / this.width) * 2 - 1;
    // this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  render() {
    // this.raycaster.setFromCamera(this.mouse, this.camera);
    this.renderer.render(this.scene, this.camera);
  }
}
