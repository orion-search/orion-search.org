import * as THREE from "three";

import { clamp } from "../utils";
import ForceLayout from "../workers/subscribers/force-layout-links";
import Renderer2D from "./Renderer2D";
import theme from "../styles";

class DiversityIndex extends Renderer2D {
  constructor({ canvas, hudCanvas }) {
    super({ canvas });

    this.groups = {
      points: new THREE.Group()
    };

    // get access to HUD canvas context
    this.hudCanvas = hudCanvas;
    this.hudCanvas.width = this.width;
    this.hudCanvas.height = this.height;
    this.ctx = hudCanvas.getContext("2d");
    this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    this.scene.add(this.groups.points);

    this.initScrollListeners();
    this.animate = this.animate.bind(this);
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.update();
    this.render();
  }

  setData(data) {
    this.data = data.filter(d => this.scales.filterFunc(d));
    this.nodes = this.data.map(d => ({
      x: this.scales.x(this.scales.xFunc(d)),
      y:
        this.scales.category(this.scales.groupFunc(d)) +
        this.scales.y(this.scales.yFunc(d)),
      r: Math.random() * 5
    }));
    const { tick: tickSimulation, tickS, terminate } = ForceLayout({
      nodes: this.nodes,
      links: []
    });

    this.tickS = tickS;
    this.tickSimulation = tickSimulation;
    this.terminate && this.terminate();
    this.terminate = terminate;
  }

  setLayout(layout) {
    this.layout = layout;
  }

  setScales(scales) {
    this.scales = scales;
  }

  initScrollListeners() {
    this.canvas.addEventListener("wheel", e => {
      e.preventDefault();
      this.scroll(e.deltaY);
    });
  }

  scroll(yDelta = 0) {
    this.scrollTo(this.camera.top + yDelta);
  }

  scrollTo(yPos = 0) {
    const yOffset = clamp(
      yPos,
      this.bbox.min.y - this.layout.margins.top,
      this.bbox.max.y + this.layout.margins.bottom - this.height
    );
    this.camera.top = yOffset;
    this.camera.bottom = yOffset + this.height;
    this.camera.updateProjectionMatrix();

    // scroll HUD canvas
    const { a: scaleX, d: scaleY } = this.ctx.getTransform();
    this.ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
    this.ctx.clearRect(0, 0, this.hudCanvas.width, this.hudCanvas.height);
    this.ctx.translate(0, -yOffset / scaleY);
    this.drawLabels();
  }

  drawLabels() {
    const textFont = 12;
    this.ctx.clearRect(0, 0, this.hudCanvas.width, this.hudCanvas.height);
    this.scales.category.domain().forEach((category, i) => {
      let labelBaseline =
        i * this.layout.pointSegment.height + this.layout.margins.top / 2;
      this.ctx.fillStyle = "white";
      this.ctx.font = `bold ${theme.type.sizes.tiny} ${theme.type.fonts.regular}`;
      this.ctx.textBaseline = "middle";

      this.ctx.fillText(`${category}`, 0, labelBaseline);

      this.ctx.font = `normal ${theme.type.sizes.tiny} ${theme.type.fonts.regular}`;
      this.ctx.fillText(`X papers`, 0, (labelBaseline += textFont));
    });
  }

  draw() {
    for (var i = this.groups.points.children.length - 1; i >= 0; i--) {
      this.groups.points.remove(this.groups.points.children[i]);
    }

    let pointsGeometry = new THREE.Geometry();

    let colors = [];

    this.data.forEach(d => {
      pointsGeometry.vertices.push(
        new THREE.Vector3(
          this.scales.x(this.scales.xFunc(d)),
          this.scales.category(this.scales.groupFunc(d)) +
            this.scales.y(this.scales.yFunc(d)),
          0
        )
      );
      colors.push(new THREE.Color(0xffffff));
    });
    pointsGeometry.colors = colors;

    let pointsMaterial = new THREE.PointsMaterial({
      size: 2,
      sizeAttenuation: false,
      vertexColors: THREE.VertexColors
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);

    this.groups.points.add(points);
    this.groups.points.position.x = this.width * 0.2;
    // this.scene.add(this.groups.points);

    this.bbox = {
      max: new THREE.Box3().setFromObject(this.scene).max,
      min: new THREE.Box3().setFromObject(this.scene).min
    };
    this.geometry = points;
  }

  update() {
    if (this.tickSimulation) {
      this.tickSimulation(1).then(({ nodes }) => {
        this.nodes = nodes;
        // update positions / radii
        const vertices = this.groups.points.children[0].geometry.vertices;
        for (var i = 0; i < vertices.length; i++) {
          vertices[i].x = nodes[i].x;
          vertices[i].y = nodes[i].y;
        }

        // @todo use morph target
        this.groups.points.children[0].geometry.verticesNeedUpdate = true;
      });
    }
  }
}

export default DiversityIndex;
