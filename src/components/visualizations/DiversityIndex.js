import { scaleLinear, extent, select, axisBottom, axisLeft } from "d3";
import * as THREE from "three";

import Renderer2D from "./Renderer2D";

// export const DiversityIndex = function({ ctx, data }) {
//   const {clientWidth, clientHeight} = ctx.canvas;

//   return {
//     scroll: () => {},

//     draw: () => {
//       ctx.fillStyle = "white";
//       ctx.fillRect(0, 0, 100, 100);
//       ctx.fillRect(100, 400, 100, 100);
//       ctx.fillRect(200, 400, 100, 400);
//       ctx.fillRect(200, 400, 100, 400);
//       console.log(ctx.canvas.clientWidth, ctx.canvas.clientHeight);
//     }
//   };
// };

class DiversityIndex extends Renderer2D {
  constructor({ canvas, data }) {
    super({ canvas });

    this.data = data;
    this.draw();
    this.initScrollListeners();

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
    // const yOffset = yDelta
  }

  scrollTo(yOffset = 0) {
    this.camera.top = yOffset > 0 ? yOffset : 0;
    this.camera.bottom = (yOffset > 0 ? yOffset : 0) + this.height;
    this.camera.updateProjectionMatrix();
  }

  setScales() {}

  draw(data) {
    let pointsGeometry = new THREE.Geometry();

    let colors = [];

    for (let i = 0; i < 1000; i++) {
      pointsGeometry.vertices.push(
        new THREE.Vector3(
          this.width * 0.33 + Math.random() * this.width * 0.66,
          ((i % 100) / 10) * this.height,
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

    this.scene.add(new THREE.Points(pointsGeometry, pointsMaterial));
  }

  get layout() {
    return {
      margins: {
        top: 40
      },
      labels: {
        width: 100
      }
    };
  }
}

export default DiversityIndex;
