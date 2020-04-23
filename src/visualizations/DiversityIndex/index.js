import * as THREE from "three";
import { extent, scaleLinear, scaleOrdinal } from "d3";

import { clamp, accessors } from "../../utils";
import ForceLayout from "../../workers/subscribers/force-layout-links";
import theme from "../../styles";
import { scatterplotMesh, layout } from "./geometry";

export function DiversityIndex({
  hudCanvas,
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
  let ctx;
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

  // get access to HUD canvas context
  if (drawSecondCanvas) {
    hudCanvas.width = width;
    hudCanvas.height = height;
    ctx = hudCanvas.getContext("2d");
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }

  const animate = () => {
    animationId = requestAnimationFrame(animate);

    update();
    renderer.render(scene, camera);
  };

  const hide = () => {
    renderer.clear(true, true, false);
    animationId && cancelAnimationFrame(animationId);
  };

  const show = () => {
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
      r: Math.random() * 10 + 2,
    }));

    updateForceLayout(nodes);

    if (drawSecondCanvas) {
      drawLabels();
    }
    draw();
  };

  const x = (a) => {
    if (a) {
      dimensions.x = a;
      setScales();
      setData(unfilteredData);
    }
  };

  const y = (a) => {
    if (a) {
      dimensions.y = a;
      setScales();
      setData(unfilteredData);
    }
  };

  const group = (a) => {
    if (a && typeof a === "function") {
      dimensions.group = a;
      setScales();
      setData(unfilteredData);
    }
  };

  const filter = (a) => {
    if (a && typeof a === "function") {
      dimensions.filter = a;
      data = unfilteredData.filter(dimensions.filter);
      setScales();
      setData(unfilteredData);
    }
  };

  // const setScales = (s) => {
  //   scales = s;
  // };
  const setScales = () => {
    const groups = [...new Set(data.map(dimensions.group))];
    scales = {
      x: scaleLinear()
        .domain(extent(data, dimensions.x))
        .range([0, layout.pointSegment.widthRatio * width]),
      y: scaleLinear().domain([0, 1]).range([layout.pointSegment.height, 0]),
      category: scaleOrdinal(
        groups,
        groups.map((g, i) => i * layout.margins.perGroup)
      ),
      filterFunc: (d) => dimensions.filter,
      groupFunc: dimensions.group,
      xFunc: dimensions.x,
      yFunc: dimensions.y,
    };
  };
  // ====================================

  // scroll-based actions ===============
  const initScrollListeners = () => {
    renderer.domElement.addEventListener("wheel", (e) => {
      e.preventDefault();
      scroll(e.deltaY);
    });
  };

  const scroll = (yDelta = 0) => {
    scrollTo(camera.top + yDelta);
  };

  const scrollTo = (yPos = 0) => {
    const yOffset = clamp(
      yPos,
      bbox.min.y - layout.margins.top,
      bbox.max.y + layout.margins.bottom - height
    );
    camera.top = yOffset;
    camera.bottom = yOffset + height;
    camera.updateProjectionMatrix();

    if (drawSecondCanvas) {
      // scroll HUD canvas
      const { a: scaleX, d: scaleY } = ctx.getTransform();
      ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
      ctx.clearRect(0, 0, hudCanvas.width, hudCanvas.height);
      ctx.translate(0, -yOffset / scaleY);
      drawLabels();
    }

    // @todo (optional) if simulation is running do something funky with vy
  };
  // ====================================

  // force layout-related ===============
  const destroy = () => {
    forceLayout.terminate();
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
  const drawLabels = () => {
    const textFont = 12;
    ctx.clearRect(0, 0, hudCanvas.width, hudCanvas.height);
    scales.category.domain().forEach((category, i) => {
      let labelBaseline =
        i * layout.pointSegment.height + layout.margins.top / 2;
      ctx.fillStyle = "white";
      ctx.font = `bold ${theme.type.sizes.tiny} ${theme.type.fonts.regular}`;
      ctx.textBaseline = "middle";

      ctx.fillText(`${category}`, 0, labelBaseline);

      ctx.font = `normal ${theme.type.sizes.tiny} ${theme.type.fonts.regular}`;
      ctx.fillText(`X papers / Explore`, 0, (labelBaseline += textFont));
    });
  };

  const draw = () => {
    // EXIT previous
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
  initScrollListeners();
  setData(unfilteredData);

  return {
    setData,
    hide,
    show,
    x,
    y,
    filter,
    group,
  };
}
