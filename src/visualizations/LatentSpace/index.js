/**
 * @todo add Bloom Filter on meshSelected
 */
import * as THREE from "three";
import { extent } from "d3";

import { nodes } from "./geometry";
import { Selection } from "./interactions";
import { Navigation } from "./navigation";

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
    // This happens when the mouse has been unclicked
    if (updateParent) {
      meshSelected.geometry.computeBoundingBox();
      // HACK: force the unselected particles to fade with
      // with a non-existent ID.
      filter(["non_existent_id"]);
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

  const resetSelection = (notifyParent = true) => {
    meshSelected.geometry.setDrawRange(0, 0);
    notifyParent && particleSelectionCallback([]);
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
      opacities.forEach((val, key, map) => map.set(key, 0.03));

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

  const show = () => {
    animationId && cancelAnimationFrame(animationId);
    // scene.visible = true;
    animate();
  };

  const hide = () => {
    // scene.visible = false;
    resetSelection(false);
    renderer.clear(true, true, false);
    console.log("STOPPING ANIMATION", animationId);
    animationId && cancelAnimationFrame(animationId);
  };

  addNodes();
  addGrid(mesh);
  initSelectionBox();

  return {
    animate,
    filter,
    render,
    resetFilters,
    setParticleSelectionCallback,
    show,
    hide,
  };
}
