import * as THREE from "three";
import { extent } from "d3";

import { nodes, cursor } from "./geometry";
import { Selection } from "./interactions";
import { Navigation } from "./navigation";

import { accessors } from "../../utils";
import Renderer3D from "../Renderer3D";

export class ParticleContainerLatentSpace extends Renderer3D {
  camera;
  cursor;
  geometry;
  layout;
  mesh; // for meshes
  meshSelected; // for selected nodes
  rotate = true;
  searchMode = false;
  searchThreshold = 500;
  selection;

  // maps
  color = new Map();
  opacityMap = new Map();
  visibilityMap = new Map();

  constructor({ layout, canvas, selectionCallback = () => {} }) {
    super({ canvas });

    this.layout = layout;
    this.transform = new THREE.Object3D();

    // this callback is called when the selection is finished.
    // in our case it notifies the parent Component to obtain
    // information on selected papers
    this.selectionCallback = selectionCallback;

    // camera transformations
    const [, farClippingPlane] = extent(this.layout.nodes, (d) => d.z);

    this.camera.far = farClippingPlane * 20;
    this.camera.position.z = 15000;
    this.camera.updateProjectionMatrix();

    this.addNodes();
    this.addGrid(this.mesh);
    // this.cursor =  this.addCursor();
    // high tolerance raycaster for our search radius
    this.raycaster.params.Points.threshold = this.searchThreshold;

    this.initSelectionBox();
    this.initKeyListeners();
    this.renderer.setClearColor(new THREE.Color(0x0c0c0c), 0);

    this.navigation = new Navigation({
      renderer: this.renderer,
      camera: this.camera,
    });

    this.animate = this.animate.bind(this);
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.renderer.clear(true, true, false);

    // var time = Date.now() * 0.005;

    // animate size
    // for (var i = 0; i < this.geometry.attributes.size.array.length; i++) {
    //   this.geometry.attributes.size.array[i] += 0.5 * Math.sin(0.1 * i + time);
    // }

    this.geometry.attributes.size.needsUpdate = true;
    // this.geometry.attributes.color.needsUpdate = true;

    const rotationAmount = 0.01;

    if (this.navigation.state.disableOrbitControls) {
      // When SHIFT key is pressed, disable orbit controls and enable selection
      this.controls.enabled = false;
      this.selection.enabled = true;
      console.log("disabling controls");
    } else {
      // When SHIFT key is released, enable orbit controls and disable selection
      this.selection.enabled = false;
      this.controls.enabled = true;
    }

    if (this.navigation.state.rotate.right) {
      this.mesh.rotation.y += rotationAmount;
      this.meshSelected.rotation.y += rotationAmount;
    } else if (this.navigation.state.rotate.left) {
      this.mesh.rotation.y -= rotationAmount;
      this.meshSelected.rotation.y -= rotationAmount;
    }
    //  if (this.rotate) {
    //    this.mesh.rotation.y += 0.001;
    //    this.meshSelected.rotation.y += 0.001;
    //  }

    this.render();
  }

  rotation(shouldRotate) {
    this.rotate = shouldRotate;
  }

  destroy() {
    document.removeEventListener("keyup", this.keyFunctions);
  }

  initKeyListeners() {
    document.addEventListener("keyup", this.keyFunctions.bind(this));
  }

  goTo(id) {}

  // Selection Interactions
  // =======================
  initSelectionBox() {
    this.selection = new Selection({
      camera: this.camera,
      onSelectionEnd: this.onSelectionEnd.bind(this),
      raycaster: this.raycaster,
      renderer: this.renderer,
      scene: this.scene,
    });
  }

  onSelectionEnd({ selected }, updateParent = false) {
    // const intersection = this.raycaster.intersectObject(this.mesh);
    if (!selected.idx.length) return;

    // Updates parent state, to find metadata on selected items
    if (updateParent) {
      this.selectionCallback(selected.ids);
    }
    // if (intersection.length > 0) {
    const srcAttributes = {
      position: this.mesh.geometry.getAttribute("position"),
      size: this.mesh.geometry.getAttribute("size"),
    };

    const destAttributes = {
      position: this.meshSelected.geometry.getAttribute("position"),
      size: this.meshSelected.geometry.getAttribute("size"),
    };

    // this.cursor.position.copy(intersection[0].point);

    // Copy intersected attributes to interaction mesh
    // for (const [idx, intersected] of intersection.entries()) {
    for (const [idx, index] of selected.idx.entries()) {
      // const { index } = intersected;

      destAttributes.position.copyAt(idx, srcAttributes.position, index);
      destAttributes.size.copyAt(idx, srcAttributes.size, index);
    }

    destAttributes.position.needsUpdate = true;
    destAttributes.size.needsUpdate = true;

    // this.meshSelected.geometry.setDrawRange(0, intersection.length);
    this.meshSelected.geometry.setDrawRange(0, selected.idx.length);

    this.mesh.geometry.attributes.customColor.needsUpdate = true;
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

  addCursor() {
    let { geometry, material } = cursor();

    const m = new THREE.Mesh(geometry, material);
    // this.cursor.renderOrder = 0;
    this.scene.add(m);
    return m;
  }

  // returns two grids surrounding a given mesh
  addGrid(mesh) {
    mesh.geometry.computeBoundingBox();
    const width =
      mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x;
    const height =
      mesh.geometry.boundingBox.max.y - mesh.geometry.boundingBox.min.y;

    let gridHelperX = new THREE.GridHelper(width, 10, 0xff0000, 0xffffff);
    gridHelperX.position.y = mesh.geometry.boundingBox.min.y;

    let gridHelperY = new THREE.GridHelper(height, 10, 0xff0000, 0xffffff);
    gridHelperY.rotateX(Math.PI / 2);
    gridHelperY.position.z = mesh.geometry.boundingBox.min.z;
    gridHelperY.depthTest = true;

    this.scene.add(gridHelperX);
    // this.scene.add(gridHelperY);
  }

  addNodes() {
    const { geometry, material } = nodes({ data: this.layout.nodes });
    this.geometry = geometry;
    this.material = material;

    this.mesh = new THREE.Points(this.geometry, this.material);
    this.mesh.name = "All_Particles";
    this.scene.add(this.mesh);

    // duplicate mesh
    this.meshSelected = this.mesh.clone();
    this.meshSelected.geometry = this.mesh.geometry.clone();
    this.meshSelected.geometry.setDrawRange(0, 0);
    this.meshSelected.name = "Selected_Particles";
    // this.meshSelected.position.z += 1;

    const count = this.meshSelected.geometry.userData.ids.length;

    // stride of 3
    const c = this.meshSelected.geometry.getAttribute("customColor").array;
    const o = this.meshSelected.geometry.getAttribute("opacity").array;

    for (let i = 0; i < count; i++) {
      let i3 = i * 3;

      // full opacity
      o[i] = 1;

      // add default selected color
      c[i3] = 1;
      c[i3 + 1] = 0;
      c[i3 + 2] = 0;
    }

    this.scene.add(this.meshSelected);
  }

  // filters papers by IDs
  // @todo: this could be done in a web worker
  // @todo this should also handle coloring
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
