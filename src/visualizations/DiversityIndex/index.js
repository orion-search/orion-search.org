import * as THREE from "three";

import { clamp } from "../../utils";
import ForceLayout from "../../workers/subscribers/force-layout-links";
import theme from "../../styles";
import { scatterplotMesh } from "./geometry";

export function DiversityIndex({
  hudCanvas,
  camera,
  renderer,
  scene,
  drawSecondCanvas,
}) {
  let animationId;
  let hudCanvas;
  let ctx;
  let bbox;
  let forceLayout;
  let layout; // aligning spacing across canvases

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
  const setData = (data) => {
    data = data.filter((d) => scales.filterFunc(d));
    nodes = data.map((d) => ({
      x: scales.x(scales.xFunc(d)),
      y: scales.category(scales.groupFunc(d)) + scales.y(scales.yFunc(d)),
      r: Math.random() * 10 + 2,
    }));

    updateForceLayout(nodes);

    if (drawSecondCanvas) {
      drawLabels();
    }
    draw();
  };

  const setLayout = (l) => {
    layout = l;
  };

  const setScales = (s) => {
    scales = s;
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

  return {
    animate,
    hide,
    setData,
    setLayout,
    setScales,
    show,
  };
}
