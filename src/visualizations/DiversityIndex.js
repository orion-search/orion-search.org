import { scaleLinear, extent, scaleOrdinal } from "d3";
import * as THREE from "three";

import { clamp } from "../utils";
import Renderer2D from "./Renderer2D";

class DiversityIndex extends Renderer2D {
  constructor({ canvas }) {
    super({ canvas });

    this.groups = {
      categories: new THREE.Group(),
      points: new THREE.Group()
    };

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
  }

  // setScales({ data, xFunc, groupBy }) {
  //   const groups = [...new Set(data.map(d => groupBy(d)))];

  //   this.scales = {
  //     x: scaleLinear()
  //       .domain(extent(data, d => xFunc(d)))
  //       .range([0, this.layout.pointSegment.widthRatio * this.width]),
  //     y: scaleLinear()
  //       .domain([0, 1])
  //       .range([this.layout.pointSegment.height, 0]),
  //     category: scaleOrdinal(
  //       groups,
  //       groups.map((g, i) => i * this.layout.margins.perGroup)
  //     )
  //   };

  //   // compute average here and then sort
  // }

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
            this.scales.category(this.scales.groupFunc(d)) -
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
    this.scene.add(this.groups.points);

    this.bbox = {
      max: new THREE.Box3().setFromObject(this.scene).max,
      min: new THREE.Box3().setFromObject(this.scene).min
    };
  }
}

export default DiversityIndex;
