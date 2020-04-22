/**
 * @todo add Bloom Filter on meshSelected
 */
import * as THREE from "three";
import { extent } from "d3";

import { nodes, cursor } from "./geometry";
import { Selection } from "./interactions";
import { Navigation } from "./navigation";

import Renderer3D from "../Renderer3D";

export function ParticleContainerLatentSpace({
  camera,
  controls,
  layout,
  raycaster,
  renderer,
  scene,
  selectionCallback = () => {},
}) {
  let mesh; // for meshes
  let meshSelected; // for selected nodes
  let searchThreshold = 500;
  let selection;
  let particleSelectionCallback = (ids) => {};
  const setParticleSelectionCallback = (f) => {
    if (f) particleSelectionCallback = f;
  };

  let animationId;

  // maps for O(1) property access
  let opacityMap = new Map();
  console.log(layout);

  const [, farClippingPlane] = extent(layout.nodes, (d) => d.z);

  // store node IDs for
  layout.nodes.forEach((n) => {
    // @todo this should be parameterized (citations?)
    opacityMap.set(n.id, 0.2);
  });

  camera.far = farClippingPlane * 20;
  camera.position.z = 15000;
  camera.updateProjectionMatrix();

  raycaster.params.Points.threshold = searchThreshold;
  renderer.setClearColor(new THREE.Color(0x0c0c0c), 0);

  const navigation = new Navigation({
    renderer: renderer,
    camera: camera,
    controls: controls,
  });

  // Selection Interactions
  // =======================
  const initSelectionBox = () => {
    selection = new Selection({
      camera: camera,
      onSelectionEnd: onSelectionEnd,
      raycaster: raycaster,
      renderer: renderer,
      scene: scene,
    });
  };

  const onSelectionEnd = ({ selected }, updateParent = false) => {
    if (!selected.idx.length) return;

    const srcAttributes = {
      position: mesh.geometry.getAttribute("position"),
      size: mesh.geometry.getAttribute("size"),
    };

    const destAttributes = {
      position: meshSelected.geometry.getAttribute("position"),
      size: meshSelected.geometry.getAttribute("size"),
    };

    for (const [idx, index] of selected.idx.entries()) {
      destAttributes.position.copyAt(idx, srcAttributes.position, index);
      destAttributes.size.copyAt(idx, srcAttributes.size, index);
    }

    destAttributes.position.needsUpdate = true;
    destAttributes.size.needsUpdate = true;

    meshSelected.geometry.setDrawRange(0, selected.idx.length);

    // Updates parent state, to find metadata on selected items
    // Ideally this should be prior to setting draw range on mesh
    // as it invokes an asynchronous process
    if (updateParent) {
      meshSelected.geometry.computeBoundingBox();
      particleSelectionCallback(selected.ids);
      // selectionCallback(selected.ids);
    }
  };

  const addGrid = (mesh) => {
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

    scene.add(gridHelperX);
    // this.scene.add(gridHelperY);
  };

  const addNodes = () => {
    const { geometry, material } = nodes({
      data: layout.nodes,
      opacityMap: opacityMap,
    });

    mesh = new THREE.Points(geometry, material);
    mesh.name = "All_Particles";
    scene.add(mesh);

    // duplicate mesh
    meshSelected = mesh.clone();
    meshSelected.geometry = mesh.geometry.clone();
    meshSelected.geometry.setDrawRange(0, 0);
    meshSelected.name = "Selected_Particles";
    // meshSelected.position.z += 1;

    const count = meshSelected.geometry.userData.ids.length;

    // stride of 3
    const c = meshSelected.geometry.getAttribute("customColor").array;
    const o = meshSelected.geometry.getAttribute("opacity").array;

    for (let i = 0; i < count; i++) {
      let i3 = i * 3;

      // full opacity
      o[i] = 1;

      // add default selected color
      c[i3] = 1;
      c[i3 + 1] = 0;
      c[i3 + 2] = 0;
    }

    scene.add(meshSelected);
  };

  const resetFilters = () => {
    filter([]);
    resetSelection();
  };

  const resetSelection = () => {
    meshSelected.geometry.setDrawRange(0, 0);
    particleSelectionCallback([]);
  };

  const filter = (ids) => {
    const opacities = new Map(opacityMap);

    if (!ids.length) {
      // Exit filtered state
      mesh.geometry.getAttribute("opacity").array = Float32Array.from(
        opacities.values()
      );
    } else {
      // Enter filtered state
      // Fade out unselected particles
      opacities.forEach((val, key, map) => map.set(key, 0.05));

      // Selected particles get their original opacity
      ids.forEach((id) => {
        if (!opacities.has(id)) console.log("no id in opacities");
        opacities.has(id) && opacities.set(id, 1);
      });
      mesh.geometry.getAttribute("opacity").array = Float32Array.from(
        opacities.values()
      );
    }

    mesh.geometry.getAttribute("opacity").needsUpdate = true;
  };

  const render = () => {
    renderer.render(scene, camera);
  };

  const animate = (t) => {
    animationId = requestAnimationFrame(animate);
    renderer.clear(true, true, false);

    const rotationAmount = 0.01;

    if (navigation.state.disableOrbitControls) {
      // When SHIFT key is pressed, disable orbit controls and enable selection
      controls.enabled = false;
      selection.enabled = true;
      console.log("disabling controls");
    } else {
      // When SHIFT key is released, enable orbit controls and disable selection
      selection.enabled = false;
      controls.enabled = true;
    }

    if (navigation.state.rotate.right) {
      mesh.rotation.y += rotationAmount;
      meshSelected.rotation.y += rotationAmount;
    } else if (navigation.state.rotate.left) {
      mesh.rotation.y -= rotationAmount;
      meshSelected.rotation.y -= rotationAmount;
    }

    render();
  };

  const stopAnimation = () => {
    animationId && cancelAnimationFrame(animationId);
  };

  const show = () => {
    animationId && cancelAnimationFrame(animationId);
    // scene.visible = true;
    animate();
  };

  const hide = () => {
    // scene.visible = false;
    renderer.clear(true, true, false);
    console.log("HIDING", animationId);
    animationId && cancelAnimationFrame(animationId);
  };

  addNodes();
  addGrid(mesh);
  initSelectionBox();

  return {
    animate,
    stopAnimation,
    filter,
    render,
    setParticleSelectionCallback,
    show,
    hide,
  };
}

// export class ParticleContainerLatentSpace extends Renderer3D {
//   camera;
//   cursor;
//   geometry;
//   layout;
//   mesh; // for meshes
//   meshSelected; // for selected nodes
//   searchThreshold = 500;
//   selection;

//   // maps for O(1) property access
//   colorMap = new Map();
//   opacityMap = new Map();
//   visibilityMap = new Map();

//   constructor({ layout, canvas, selectionCallback = () => {} }) {
//     super({ canvas });

//     this.layout = layout;

//     // camera transformations
//     const [, farClippingPlane] = extent(this.layout.nodes, (d) => d.z);

//     // store node IDs for
//     this.layout.nodes.forEach((n) => {
//       // @todo this should be parameterized (citations?)
//       this.opacityMap.set(n.id, 0.2);
//     });

//     // this callback is called when the selection is finished.
//     // in our case it notifies the parent Component to obtain
//     // information on selected papers
//     this.selectionCallback = selectionCallback;

//     this.camera.far = farClippingPlane * 20;
//     this.camera.position.z = 15000;
//     this.camera.updateProjectionMatrix();

//     this.addNodes();
//     this.addGrid(this.mesh);
//     // this.cursor =  this.addCursor();
//     // high tolerance raycaster for our search radius
//     this.raycaster.params.Points.threshold = this.searchThreshold;

//     this.initSelectionBox();
//     this.initKeyListeners();
//     this.renderer.setClearColor(new THREE.Color(0x0c0c0c), 0);

//     this.navigation = new Navigation({
//       renderer: this.renderer,
//       camera: this.camera,
//       controls: this.controls,
//     });

//     this.animate = this.animate.bind(this);
//     this.animate();
//   }

//   animate(t) {
//     requestAnimationFrame(this.animate);
//     this.renderer.clear(true, true, false);

//     var time = Date.now() * 0.005;

//     // animate size
//     // for (var i = 0; i < this.geometry.attributes.size.array.length; i++) {
//     //   this.geometry.attributes.size.array[i] += 0.5 * Math.sin(0.1 * i + time);
//     // }

//     this.geometry.attributes.size.needsUpdate = true;
//     // this.geometry.attributes.color.needsUpdate = true;

//     const rotationAmount = 0.01;

//     if (this.navigation.state.disableOrbitControls) {
//       // When SHIFT key is pressed, disable orbit controls and enable selection
//       this.controls.enabled = false;
//       this.selection.enabled = true;
//       console.log("disabling controls");
//     } else {
//       // When SHIFT key is released, enable orbit controls and disable selection
//       this.selection.enabled = false;
//       this.controls.enabled = true;
//     }

//     if (this.navigation.state.rotate.right) {
//       this.mesh.rotation.y += rotationAmount;
//       this.meshSelected.rotation.y += rotationAmount;
//     } else if (this.navigation.state.rotate.left) {
//       this.mesh.rotation.y -= rotationAmount;
//       this.meshSelected.rotation.y -= rotationAmount;
//     }

//     this.render();
//   }

//   destroy() {
//     document.removeEventListener("keyup", this.keyFunctions);
//   }

//   initKeyListeners() {
//     console.log(this);
//     document.addEventListener("keyup", this.keyFunctions.bind(this));
//   }

//   // Selection Interactions
//   // =======================
//   initSelectionBox() {
//     this.selection = new Selection({
//       camera: this.camera,
//       onSelectionEnd: this.onSelectionEnd.bind(this),
//       raycaster: this.raycaster,
//       renderer: this.renderer,
//       scene: this.scene,
//     });
//   }

//   onSelectionEnd({ selected }, updateParent = false) {
//     if (!selected.idx.length) return;

//     const srcAttributes = {
//       position: this.mesh.geometry.getAttribute("position"),
//       size: this.mesh.geometry.getAttribute("size"),
//     };

//     const destAttributes = {
//       position: this.meshSelected.geometry.getAttribute("position"),
//       size: this.meshSelected.geometry.getAttribute("size"),
//     };

//     for (const [idx, index] of selected.idx.entries()) {
//       destAttributes.position.copyAt(idx, srcAttributes.position, index);
//       destAttributes.size.copyAt(idx, srcAttributes.size, index);
//     }

//     destAttributes.position.needsUpdate = true;
//     destAttributes.size.needsUpdate = true;

//     this.meshSelected.geometry.setDrawRange(0, selected.idx.length);

//     // Updates parent state, to find metadata on selected items
//     // Ideally this should be prior to setting draw range on mesh
//     // as it invokes an asynchronous process
//     if (updateParent) {
//       this.meshSelected.geometry.computeBoundingBox();
//       // const { min, max } = this.meshSelected.geometry.boundingBox;

//       // @todo handle flying here
//       // this.navigation.flyTo({
//       //   position: {
//       //     x: (min.x + max.x) / 2,
//       //     y: (min.y + max.y) / 2,
//       //     z: this.camera.position.z,
//       //   },
//       // });
//       this.selectionCallback(selected.ids);
//     }
//   }

//   keyFunctions(e) {
//     switch (e.code) {
//       case "KeyR":
//         // Toggles rotation
//         break;
//       case "BracketRight":
//         // Increase search radius
//         this.searchThreshold *= 1.2;
//         this.raycaster.params.Points.threshold = this.searchThreshold;
//         this.cursor.scale.multiplyScalar(1.2);
//         // make cursor bigger
//         break;
//       case "BracketLeft":
//         // Decrease search radius
//         this.searchThreshold /= 1.2;
//         this.raycaster.params.Points.threshold = this.searchThreshold;
//         this.cursor.scale.divideScalar(1.2);
//         // make cursor smaller
//         break;
//       default:
//         break;
//     }
//   }

//   addCursor() {
//     let { geometry, material } = cursor();

//     const m = new THREE.Mesh(geometry, material);
//     // this.cursor.renderOrder = 0;
//     this.scene.add(m);
//     return m;
//   }

//   // returns two grids surrounding a given mesh
//   addGrid(mesh) {
//     mesh.geometry.computeBoundingBox();
//     const width =
//       mesh.geometry.boundingBox.max.x - mesh.geometry.boundingBox.min.x;
//     const height =
//       mesh.geometry.boundingBox.max.y - mesh.geometry.boundingBox.min.y;

//     let gridHelperX = new THREE.GridHelper(width, 10, 0xff0000, 0xffffff);
//     gridHelperX.position.y = mesh.geometry.boundingBox.min.y;

//     let gridHelperY = new THREE.GridHelper(height, 10, 0xff0000, 0xffffff);
//     gridHelperY.rotateX(Math.PI / 2);
//     gridHelperY.position.z = mesh.geometry.boundingBox.min.z;
//     gridHelperY.depthTest = true;

//     this.scene.add(gridHelperX);
//     // this.scene.add(gridHelperY);
//   }

//   addNodes() {
//     const { geometry, material } = nodes({
//       data: this.layout.nodes,
//       opacityMap: this.opacityMap,
//     });
//     this.geometry = geometry;
//     this.material = material;

//     this.mesh = new THREE.Points(this.geometry, this.material);
//     this.mesh.name = "All_Particles";
//     this.scene.add(this.mesh);

//     // duplicate mesh
//     this.meshSelected = this.mesh.clone();
//     this.meshSelected.geometry = this.mesh.geometry.clone();
//     this.meshSelected.geometry.setDrawRange(0, 0);
//     this.meshSelected.name = "Selected_Particles";
//     // this.meshSelected.position.z += 1;

//     const count = this.meshSelected.geometry.userData.ids.length;

//     // stride of 3
//     const c = this.meshSelected.geometry.getAttribute("customColor").array;
//     const o = this.meshSelected.geometry.getAttribute("opacity").array;

//     for (let i = 0; i < count; i++) {
//       let i3 = i * 3;

//       // full opacity
//       o[i] = 1;

//       // add default selected color
//       c[i3] = 1;
//       c[i3 + 1] = 0;
//       c[i3 + 2] = 0;
//     }

//     this.scene.add(this.meshSelected);
//   }

//   resetFilters() {
//     this.filter([]);
//     this.resetSelection();
//   }

//   resetSelection() {
//     this.meshSelected.geometry.setDrawRange(0, 0);
//     this.selectionCallback([]);
//   }

//   filter(ids) {
//     const opacities = new Map(this.opacityMap);

//     if (!ids.length) {
//       // Exit filtered state
//       this.mesh.geometry.getAttribute("opacity").array = Float32Array.from(
//         opacities.values()
//       );
//     } else {
//       // Enter filtered state
//       // Fade out unselected particles
//       opacities.forEach((val, key, map) => map.set(key, 0.05));

//       // Selected particles get their original opacity
//       ids.forEach((id) => {
//         if (!opacities.has(id)) console.log("no id in opacities");
//         opacities.has(id) && opacities.set(id, 1);
//       });
//       this.mesh.geometry.getAttribute("opacity").array = Float32Array.from(
//         opacities.values()
//       );
//     }

//     this.mesh.geometry.getAttribute("opacity").needsUpdate = true;
//   }
// }
