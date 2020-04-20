import * as THREE from "three";
import { SelectionBox } from "three/examples/jsm/interactive/SelectionBox";
import { SelectionHelper } from "three/examples/jsm/interactive/SelectionHelper";
import Renderer3D from "./Renderer3D";
import { extent } from "d3";

import { dataTexShaderFS } from "../shaders/point.fs.js";
import { dataTexShaderVS } from "../shaders/point.vs.js";
import { accessors } from "../utils";

const VISIBLE = 1.0;
const NOT_VISIBLE = 0.0;

export class ParticleContainerLatentSpace extends Renderer3D {
  rotate = false;
  searchMode = false;
  searchThreshold = 500;
  selectionBox;
  selectionHelper;
  cursor;

  constructor({ layout, canvas, onHoverCallback = () => {} }) {
    super({ canvas });

    this.layout = layout;
    this.transform = new THREE.Object3D();

    // camera transformations
    const [, farClippingPlane] = extent(this.layout.nodes, (d) => d.z);

    this.camera.far = farClippingPlane * 20;
    this.camera.position.z = 15000;
    this.camera.updateProjectionMatrix();

    this.createGeometry();
    // this.createSphereGeometry();
    this.addGrid();
    // high tolerance raycaster for our search radius
    this.raycaster.params.Points.threshold = this.searchThreshold;

    this.initSelectionBox();
    this.initKeyListeners();
    this.renderer.setClearColor(new THREE.Color(0x0c0c0c), 0);

    this.animate = this.animate.bind(this);
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.renderer.clear(true, true, false);

    var time = Date.now() * 0.005;

    // animate size
    for (var i = 0; i < this.geometry.attributes.size.array.length; i++) {
      this.geometry.attributes.size.array[i] += 0.5 * Math.sin(0.1 * i + time);
    }

    this.geometry.attributes.size.needsUpdate = true;
    // this.geometry.attributes.color.needsUpdate = true;

    this.meshNodes.rotation.y += this.rotate ? 0.001 : 0;

    this.render();

    // const intersection = this.raycaster.intersectObject(this.meshNodes);

    // if (intersection.length > 0) {
    //   this.cursor.position.copy(intersection[0].point);
    //   for (let intersected of intersection) {
    //     const { index } = intersected;
    //     this.meshNodes.geometry.attributes.customColor.setX(index, 0);
    //   }

    //   this.meshNodes.geometry.attributes.customColor.needsUpdate = true;
    // }
  }

  rotation(v) {
    this.rotate = v;
  }

  destroy() {
    document.removeEventListener("keyup", this.keyFunctions);
  }

  initKeyListeners() {
    document.addEventListener("keyup", this.keyFunctions.bind(this));
  }

  initMouseSelectionListeners() {
    this.renderer.domElement.addEventListener("mousedown", (e) => {
      console.log("MOUSEDOWN", this);
      for (let item of this.selectionBox.collection) {
        item.material.emissive.set(0xff0000);
      }

      this.selectionBox.startPoint.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
        this.camera.position.z
      );
    });

    this.renderer.domElement.addEventListener("mousemove", (event) => {
      if (this.selectionHelper.isDown) {
        console.log(this.selectionBox);
        for (var i = 0; i < this.selectionBox.collection.length; i++) {
          this.selectionBox.collection[i].material.emissive.set(0x000000);
        }

        this.selectionBox.endPoint.set(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
          0.5
        );

        var allSelected = this.selectionBox.select();

        for (var i = 0; i < allSelected.length; i++) {
          allSelected[i].material.emissive.set(0xffffff);
        }
      }
    });

    document.addEventListener("mouseup", (event) => {
      this.selectionBox.endPoint.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
      );

      var allSelected = this.selectionBox.select();
      console.log("ALLSELECTED", allSelected);

      for (var i = 0; i < allSelected.length; i++) {
        allSelected[i].material.emissive.set(0xffffff);
      }
    });
  }

  initSelectionBox() {
    this.controls.enabled = false;
    this.selectionBox = new SelectionBox(
      this.camera,
      this.scene
      // this.camera.far
    );
    this.selectionHelper = new SelectionHelper(
      this.selectionBox,
      this.renderer,
      "selection-box-helper"
    );
    this.initMouseSelectionListeners();
  }

  addGrid() {
    this.meshNodes.geometry.computeBoundingBox();
    // console.log(this.meshNodes.geometry.boundingBox);
    const width =
      this.meshNodes.geometry.boundingBox.max.x -
      this.meshNodes.geometry.boundingBox.min.x;
    const height =
      this.meshNodes.geometry.boundingBox.max.y -
      this.meshNodes.geometry.boundingBox.min.y;

    let gridHelperX = new THREE.GridHelper(width, 10, 0xff0000, 0xffffff);
    gridHelperX.position.y = this.meshNodes.geometry.boundingBox.min.y;

    let gridHelperY = new THREE.GridHelper(height, 10, 0xff0000, 0xffffff);
    gridHelperY.rotateX(Math.PI / 2);
    gridHelperY.position.z = this.meshNodes.geometry.boundingBox.min.z;

    this.scene.add(gridHelperX);
    this.scene.add(gridHelperY);

    gridHelperY.depthTest = true;
  }

  keyFunctions(e) {
    switch (e.code) {
      case "KeyS":
        // Toggle interactive search mode
        this.searchMode = !this.searchMode;
        // disables camera, enables search
        break;
      case "KeyR":
        // Toggles rotation
        this.rotate = !this.rotate;
        break;
      case "BracketRight":
        // Increase search radius
        this.searchThreshold *= 1.2;
        this.raycaster.params.Points.threshold = this.searchThreshold;
        this.cursor.scale.multiplyScalar(1.2);
        // make cursor bigger
        break;
      case "BracketLeft":
        // Decrease search radius
        this.searchThreshold /= 1.2;
        this.raycaster.params.Points.threshold = this.searchThreshold;
        this.cursor.scale.divideScalar(1.2);
        // make cursor smaller
        break;
      default:
        break;
    }
  }

  createGeometry() {
    this.geometry = new THREE.BufferGeometry();

    this.attributes = {
      id: [],
      position: [],
      color: [],
      opacity: [],
      size: [],
      visible: [],
    };

    // Keeps track of the visibility state of each observation.
    // Reset and mutated based on current filtering rules
    this.visibilityMap = new Map();
    this.opacityMap = new Map();

    var color = new THREE.Color();

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
    this.geometry.morphAttributes.opacity = [];

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
          value: new THREE.Color(0xffffff),
        },
      },

      vertexShader: dataTexShaderVS,
      fragmentShader: dataTexShaderFS,

      morphTargets: true,
      morphNormals: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: false,
    });

    this.meshNodes = new THREE.Points(this.geometry, this.material);

    this.scene.add(this.meshNodes);
    console.log(this.meshNodes);
  }

  createSphereGeometry() {
    let sphereGeometry = new THREE.SphereBufferGeometry(
      this.searchThreshold,
      8,
      8
    );
    // let sphereMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xe0e0ff,
    //   wireframe: true
    // });
    var sphereMaterial = new THREE.MeshNormalMaterial({
      // color: 0xffffff,
      wireframe: false,
      // wireframeLinewidth: 10,
      opacity: 0.75,
      transparent: true,
      // flatShading: true,
      depthTest: true,
      depthWrite: true,
      side: THREE.FrontSide,
    });

    this.cursor = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // this.cursor.renderOrder = 0;
    this.scene.add(this.cursor);
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
      ids.forEach((id) => {
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

    const nodes = this.layout.nodes.map((d) => accessors.types.id(d));

    papers.forEach((p) => {
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
}
