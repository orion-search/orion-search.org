import { scaleLinear, extent, select, axisBottom, axisLeft } from "d3";
import * as THREE from "three";

import { clamp } from "../../utils";
import Renderer2D from "./Renderer2D";

class DiversityIndex extends Renderer2D {
  constructor({ canvas, data }) {
    super({ canvas });

    this.groups = {
      categories: new THREE.Group(),
      points: new THREE.Group()
    };

    this.data = data;
    this.draw();

    this.initScrollListeners();
    this.bbox = {
      max: new THREE.Box3().setFromObject(this.scene).max,
      min: new THREE.Box3().setFromObject(this.scene).min
    };

    this.animate = this.animate.bind(this);
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.render();
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
    const yOffset = clamp(yPos, this.bbox.min.y, this.bbox.max.y);
    this.camera.top = yOffset;
    this.camera.bottom = yOffset + this.height;
    this.camera.updateProjectionMatrix();
  }

  setScales() {}

  draw(data) {
    let pointsGeometry = new THREE.Geometry();

    let colors = [];

    for (let i = 0; i < 1000; i++) {
      pointsGeometry.vertices.push(
        new THREE.Vector3(
          this.width * 0.2 + Math.random() * this.width * 0.8,
          ((i % 100) / 10) * this.height + Math.random() * 10,
          0
        )
      );
      colors.push(new THREE.Color(0xffffff));
    }
    pointsGeometry.colors = colors;

    let pointsMaterial = new THREE.PointsMaterial({
      size: 2,
      sizeAttenuation: false,
      vertexColors: THREE.VertexColors
    });

    this.groups.points.add(new THREE.Points(pointsGeometry, pointsMaterial));
    this.scene.add(this.groups.points);
  }

  get layout() {
    return {
      margins: {
        top: 40,
        bottom: 100
      },
      labels: {
        width: 100
      }
    };
  }
}

export default DiversityIndex;
