import * as THREE from "three";
// import TextSprite from "@seregpie/three.text-sprite";
// import TextTexture from "@seregpie/three.text-texture";
import SpriteText from "three-spritetext";

import { clamp } from "../utils";
import Renderer2D from "./Renderer2D";
import theme from "../styles";

class DiversityIndex extends Renderer2D {
  constructor({ canvas, textCanvas }) {
    super({ canvas });

    this.groups = {
      labels: new THREE.Group(),
      points: new THREE.Group()
    };

    this.textCanvas = textCanvas;
    this.textCanvas.width = this.width;
    this.textCanvas.height = this.height;
    this.ctx = textCanvas.getContext("2d");
    this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    this.scene.add(this.groups.points);
    this.scene.add(this.groups.labels);

    this.initScrollListeners();
    this.animate = this.animate.bind(this);
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.render();
  }

  setData(data) {
    this.data = data;
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

    // scroll text canvas
    this.ctx.setTransform(
      window.devicePixelRatio || 1,
      0,
      0,
      window.devicePixelRatio || 1,
      0,
      0
    );
    this.ctx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);
    this.ctx.translate(0, -yOffset / 2);
    this.drawLabels();
  }

  drawLabels() {
    this.ctx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);
    this.scales.category.domain().forEach((category, i) => {
      this.ctx.fillStyle = "white";
      this.ctx.fontStyle = "Matter 40px";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(`${category}`, 0, i * this.layout.pointSegment.height);
    });
  }

  draw() {
    for (var i = this.groups.points.children.length - 1; i >= 0; i--) {
      this.groups.points.remove(this.groups.points.children[i]);
    }

    let pointsGeometry = new THREE.Geometry();

    let colors = [];

    this.data
      .filter(d => this.scales.filterFunc(d))
      .forEach(d => {
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

    this.groups.points.add(new THREE.Points(pointsGeometry, pointsMaterial));
    this.groups.points.position.x = this.width * 0.2;
    // this.scene.add(this.groups.points);

    this.bbox = {
      max: new THREE.Box3().setFromObject(this.scene).max,
      min: new THREE.Box3().setFromObject(this.scene).min
    };
  }
}

export default DiversityIndex;
