import * as THREE from "three";

import { clamp } from "../utils";
import pointVS from "../shaders/point.vs";
import pointFS from "../shaders/point.fs";
import ForceLayout from "../workers/subscribers/force-layout-links";
import Renderer2D from "./Renderer2D";
import theme from "../styles";

class DiversityIndex extends Renderer2D {
  constructor({ canvas, hudCanvas, drawSecondCanvas = true }) {
    super({ canvas });

    this.groups = {
      points: new THREE.Group()
    };

    // get access to HUD canvas context
    this.drawSecondCanvas = drawSecondCanvas;
    if (this.drawSecondCanvas) {
      this.hudCanvas = hudCanvas;
      this.hudCanvas.width = this.width;
      this.hudCanvas.height = this.height;
      this.ctx = this.hudCanvas.getContext("2d");
      this.ctx.scale(
        window.devicePixelRatio || 1,
        window.devicePixelRatio || 1
      );
    }

    this.scene.add(this.groups.points);

    this.initForceLayout();
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
      r: Math.random() * 10 + 2
    }));

    this.updateForceLayout(this.nodes);

    if (this.drawSecondCanvas) {
      this.drawLabels();
    }
    this.drawNodes();
  }

  initForceLayout() {
    this.forceLayout = ForceLayout({
      nodes: [],
      links: []
    });
  }

  updateForceLayout(nodes) {
    this.forceLayout.elapsedTicks = 0;
    this.forceLayout.set("nodes", nodes);
    // this.forceLayout.start();
    // this.forceLayout.tick(100);
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

  onWindowResize() {
    super.onWindowResize();
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

    if (this.drawSecondCanvas) {
      // scroll HUD canvas
      const { a: scaleX, d: scaleY } = this.ctx.getTransform();
      this.ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
      this.ctx.clearRect(0, 0, this.hudCanvas.width, this.hudCanvas.height);
      this.ctx.translate(0, -yOffset / scaleY);
      this.drawLabels();
    }

    // @todo (optional) if simulation is running do something funky with vy
  }

  // clean up
  destroy() {
    this.forceLayout.terminate();
  }

  drawLabels() {
    this.ctx.scale.x = window.devicePixelRatio || 1;
    this.ctx.scale.y = window.devicePixelRatio || 1;
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
      this.ctx.fillText(`X papers / Explore`, 0, (labelBaseline += textFont));
    });
  }

  drawNodes() {
    // EXIT previous
    for (var i = this.groups.points.children.length - 1; i >= 0; i--) {
      this.groups.points.remove(this.groups.points.children[i]);
    }

    this.geometry = new THREE.BufferGeometry();
    this.attributes = {
      position: [],
      color: [],
      size: [],
      opacity: []
    };

    var color = new THREE.Color();

    for (let i = 0; i < this.nodes.length; i++) {
      const { x, y, r } = this.nodes[i];
      color.setRGB(1, 1, 1);

      this.attributes.position.push(x, y, 0);
      this.attributes.color.push(color.r, color.g, color.b);
      this.attributes.size.push(2 * r);
      this.attributes.opacity.push(1);
    }

    this.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(this.attributes.position, 3)
    );

    this.geometry.setAttribute(
      "customColor",
      new THREE.Float32BufferAttribute(this.attributes.color, 3)
    );

    this.geometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(this.attributes.size, 1)
    );

    this.geometry.setAttribute(
      "opacity",
      new THREE.Float32BufferAttribute(this.attributes.opacity, 1)
    );

    this.geometry.computeBoundingSphere();

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        color: {
          value: new THREE.Color(0xffffff)
        },
        noDepth: {
          value: true
        }
      },

      vertexShader: pointVS,
      fragmentShader: pointFS,

      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });
    const points = new THREE.Points(this.geometry, this.material);
    this.groups.points.add(points);
    this.groups.points.position.x = this.width * 0.2;
    this.bbox = {
      max: new THREE.Box3().setFromObject(this.scene).max,
      min: new THREE.Box3().setFromObject(this.scene).min
    };
    this.geometry = points;
  }

  update() {
    if (this.forceLayout && this.forceLayout.elapsedTicks < 120) {
      this.forceLayout.tick(1).then(({ nodes }) => {
        this.forceLayout.elapsedTicks++;
        this.nodes = nodes;
        // update positions / radii
        const positions = this.groups.points.children[0].geometry.attributes
          .position.array;

        for (var i = 0; i < nodes.length; i++) {
          const i3 = i * 3;
          positions[i3] = nodes[i].x;
          positions[i3 + 1] = nodes[i].y;
        }
        this.groups.points.children[0].geometry.attributes.position.needsUpdate = true;

        // @todo use morph target
        // this.groups.points.children[0].geometry.verticesNeedUpdate = true;
      });
    }
  }
}

export default DiversityIndex;
