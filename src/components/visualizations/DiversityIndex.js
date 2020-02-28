import { scaleLinear, extent, scaleOrdinal } from "d3";
import * as THREE from "three";

import { clamp } from "../../utils";
import Renderer2D from "./Renderer2D";

class DiversityIndex extends Renderer2D {
  constructor({
    canvas,
    data,
    xAccessor = d => +d["diversity"],
    yAccessor = d => +d["female_share"],
    groupBy = d => d["topic"]
  }) {
    super({ canvas });

    this.groups = {
      categories: new THREE.Group(),
      points: new THREE.Group()
    };

    this.setScales({
      data,
      xAccessor,
      yAccessor,
      groupBy
    });

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
    const yOffset = clamp(
      yPos,
      this.bbox.min.y - this.layout.margins.top,
      this.bbox.max.y + this.layout.margins.bottom - this.height
    );
    this.camera.top = yOffset;
    this.camera.bottom = yOffset + this.height;
    this.camera.updateProjectionMatrix();
  }

  setScales({ data, xAccessor, groupBy }) {
    const groups = [...new Set(data.map(d => groupBy(d)))];

    this.scales = {
      x: scaleLinear()
        .domain(extent(data, d => xAccessor(d)))
        .range([0, this.layout.pointSegment.width]),
      y: scaleLinear()
        .domain([0, 1])
        .range([this.layout.pointSegment.height, 0]),
      category: scaleOrdinal(
        groups,
        groups.map((g, i) => i * this.layout.margins.perGroup)
      )
    };

    // compute average here and then sort
  }

  draw(data) {
    let pointsGeometry = new THREE.Geometry();

    let colors = [];

    // for (let i = 0; i < 1000; i++) {
    //   pointsGeometry.vertices.push(
    //     new THREE.Vector3(
    //       this.width * 0.2 + Math.random() * this.layout.pointSegment.width,
    //       ((i % 100) / 10) * this.height + Math.random() * 10,
    //       0
    //     )
    //   );
    //   colors.push(new THREE.Color(0xffffff));
    // }
    this.data.forEach(d => {
      pointsGeometry.vertices.push(
        new THREE.Vector3(
          this.scales.x(+d["diversity"]),
          this.scales.category(d["topic"]) - this.scales.y(d["female_share"]),
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
  }

  get layout() {
    return {
      margins: {
        top: 40,
        bottom: 200,
        perGroup: 100
      },
      labels: {
        width: 100
      },
      pointSegment: {
        width: this.width * 0.8,
        height: 50 // perGroup / 2
      }
    };
  }
}

export default DiversityIndex;
