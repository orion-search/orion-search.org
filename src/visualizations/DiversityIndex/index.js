/**
 * @todo circle radius should be relative to DPR and should
 * change when moving from hi DPR screen to low
 *
 * @todo raycaster hover invokes callback
 */

import * as THREE from "three";
import { extent, scaleLinear, scaleOrdinal } from "d3";

import { clamp, accessors } from "../../utils";
import ForceLayout from "../../workers/subscribers/force-layout-links";
import theme from "../../styles";
import { scatterplotMesh, layout } from "./geometry";

export function DiversityIndex({
  camera,
  renderer,
  scene,
  data: unfilteredData = [],
  dimensions = {
    x: (d) => accessors.types.diversity(d),
    y: (d) => accessors.types.femaleShare(d),
    group: (d) => accessors.types.topic(d),
    filter: (d) => accessors.types.year(d) === 2019,
  },
  drawSecondCanvas = false,
}) {
  let animationId;

  let hudElm;

  let bbox;
  let forceLayout;

  let data; // essentially the filteredData
  let scales;
  let nodes;

  let { width, height } = renderer.domElement.getBoundingClientRect();
  let groups = {
    points: new THREE.Group(),
  };
  scene.add(groups.points);

  const animate = () => {
    animationId = requestAnimationFrame(animate);

    update();
    renderer.render(scene, camera);
  };

  const hide = () => {
    renderer.domElement.removeEventListener("wheel", onScroll);
    removeHUD();
    renderer.clear(true, true, false);
    animationId && cancelAnimationFrame(animationId);
  };

  const show = () => {
    // initScrollListeners();
    renderer.domElement.addEventListener("wheel", onScroll);
    animationId && cancelAnimationFrame(animationId);
    // scene.visible = true;
    animate();
  };

  // setters ============================
  const setData = (_) => {
    // Setting data updates the scales as well
    unfilteredData = _;
    data = unfilteredData.filter(dimensions.filter);

    setScales();

    nodes = data.map((d) => ({
      x: scales.x(dimensions.x(d)),
      y: scales.category(dimensions.group(d)) + scales.y(dimensions.y(d)),
      // y: scales.category(dimensions.group(d)),
      r: Math.random() * 10 + 5,
    }));

    updateForceLayout(nodes);

    draw();
  };

  const x = (a) => {
    if (a) {
      dimensions.x = a;
      setData(unfilteredData);
    }
  };

  const y = (a) => {
    if (a) {
      dimensions.y = a;
      setData(unfilteredData);
    }
  };

  const group = (a) => {
    if (a && typeof a === "function") {
      dimensions.group = a;
      setData(unfilteredData);
    }
  };

  const filter = (a) => {
    if (a && typeof a === "function") {
      dimensions.filter = a;
      // data = unfilteredData.filter(dimensions.filter);
      setData(unfilteredData);
    }
  };

  const categories = () => {
    return scales.category.domain().map((category) => ({
      category,
      y: scales.category(category),
    }));
  };

  const HUD = (a) => {
    hudElm = a;
  };

  // const setScales = (s) => {
  //   scales = s;
  // };
  const setScales = () => {
    // @todo Fix the hardcoded .97 value that corresponds
    // to page layout side padding
    const groups = [...new Set(data.map(dimensions.group))];
    scales = {
      x: scaleLinear()
        .domain(extent(data, dimensions.x))
        .range([0, layout.pointSegment.widthRatio * width * 0.97]),
      y: scaleLinear()
        .domain(extent(data, dimensions.y))
        .range([
          layout.pointSegment.height / 2,
          -layout.pointSegment.height / 2,
        ]),
      category: scaleOrdinal(
        groups,
        groups.map((g, i) => layout.margins.top + i * layout.margins.perGroup)
      ),
      filterFunc: (d) => dimensions.filter,
      groupFunc: dimensions.group,
      xFunc: dimensions.x,
      yFunc: dimensions.y,
    };
    console.log(scales, scales.category.domain());
  };
  // ====================================

  // scroll-based actions ===============
  const onScroll = (e) => {
    e.preventDefault();
    scroll(e.deltaY);
  };

  const scroll = (yDelta = 0) => {
    scrollTo(camera.top + yDelta);
  };

  const scrollTo = (yPos = 0) => {
    const yOffset = clamp(
      yPos,
      0,
      bbox.max.y + layout.margins.bottom - height
      // bbox.min.y - layout.margins.top,
      // bbox.max.y + layout.margins.bottom - height
    );
    if (hudElm) {
      hudElm.scrollTop = yOffset;
    }
    camera.top = yOffset;
    camera.bottom = yOffset + height;
    camera.updateProjectionMatrix();

    // @todo (optional) if simulation is running do something funky with vy
  };
  // ====================================

  const removeHUD = () => {
    // @todo remove actual HTML canvas element
    // hudElm = null;
  };

  // force layout-related ===============
  const destroy = () => {
    forceLayout.terminate();
    removeHUD();
  };

  const initForceLayout = () => {
    forceLayout = ForceLayout({
      nodes: [],
      links: [],
    });
  };

  const updateForceLayout = (nodes) => {
    forceLayout.elapsedTicks = 0;
    forceLayout.set("nodes", nodes);
  };
  // ====================================

  // draw-related =======================
  const draw = () => {
    // EXIT previous
    console.groupCollapsed("diversity index draw");
    for (var i = groups.points.children.length - 1; i >= 0; i--) {
      groups.points.remove(groups.points.children[i]);
    }

    const points = scatterplotMesh(nodes);
    groups.points.add(points);
    groups.points.position.x = width * 0.2;
    bbox = {
      max: new THREE.Box3().setFromObject(scene).max,
      min: new THREE.Box3().setFromObject(scene).min,
    };
    console.groupEnd("diversity index draw");
  };

  const update = () => {
    if (forceLayout && forceLayout.elapsedTicks < 120) {
      forceLayout.tick(1).then(({ nodes: newNodes }) => {
        forceLayout.elapsedTicks++;
        nodes = newNodes;
        // update positions / radii
        const positions =
          groups.points.children[0].geometry.attributes.position.array;

        for (var i = 0; i < nodes.length; i++) {
          const i3 = i * 3;
          positions[i3] = nodes[i].x;
          positions[i3 + 1] = nodes[i].y;
        }
        groups.points.children[0].geometry.attributes.position.needsUpdate = true;

        // @todo use morph target
        // groups.points.children[0].geometry.verticesNeedUpdate = true;
      });
    }
  };
  // ====================================

  initForceLayout();
  // initScrollListeners();
  setData(unfilteredData);

  return {
    setData,
    hide,
    HUD,
    categories,
    show,
    x,
    y,
    filter,
    group,
  };
}
