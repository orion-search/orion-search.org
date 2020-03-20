// import * as THREE from "three";
import { coordinatesToScreen } from "../utils";
import { accessors } from "../utils";

// import Renderer2D from "./Renderer2D";

class CollaborationNetwork {
  constructor({ canvas }) {
    // super({ canvas });

    // this.groups = {
    //   points: new THREE.Group()
    // };

    // this.scene.add(this.groups.points);
    this.canvas = canvas;

    const { width, height } = canvas.getBoundingClientRect();
    this.width = width;
    this.height = height;

    // this.canvas.width = this.width;
    // this.canvas.height = this.height;
    this.canvas.width = this.width * (window.devicePixelRatio || 1);
    this.canvas.height = this.height * (window.devicePixelRatio || 1);
    this.ctx = canvas.getContext("2d");

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.animate = this.animate.bind(this);
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate);
    // this.update();
    // this.render();
  }

  setData({ links, nodes }) {
    console.log(nodes);
    const positions = {};
    const circles = [];

    function isIntersect(point, circle) {
      return (
        Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) <
        circle.r
      );
    }

    nodes.forEach(n => {
      const { x, y } = coordinatesToScreen(
        n.lat,
        n.lng,
        this.width,
        this.height
      );
      positions[accessors.types.country(n)] = { x, y };
    });

    links
      .filter(l => l.year === 2019)
      .forEach(l => {
        let sourceX, sourceY, targetX, targetY;
        try {
          let s = positions[accessors.types.source(l)];
          let t = positions[accessors.types.target(l)];
          sourceX = s.x;
          sourceY = s.y;
          targetX = t.x;
          targetY = t.y;
        } catch (error) {
          throw error;
        }

        this.ctx.strokeStyle = "rgba(255, 255, 255, 0.1";
        this.ctx.lineWidth = accessors.types.weight(l) / 10;
        this.ctx.beginPath();
        this.ctx.moveTo(sourceX, sourceY);
        this.ctx.lineTo(targetX, targetY);
        this.ctx.stroke();
      });

    this.ctx.strokeStyle = "rgba(255, 255, 255, 1";
    this.ctx.lineWidth = 2;
    nodes.forEach(n => {
      this.ctx.fillStyle = "white";
      const { x, y } = positions[accessors.types.country(n)];
      const r = Math.random() * 20;
      circles.push({
        id: accessors.types.country(n),
        x: x,
        y: y,
        r
      });

      this.ctx.beginPath();
      this.ctx.ellipse(x, y, r, r, 0, 0, 2 * Math.PI, false);
      this.ctx.stroke();
    });

    this.canvas.addEventListener("click", e => {
      const { left, top } = this.canvas.getBoundingClientRect();
      const pos = {
        x: (e.clientX - left) * window.devicePixelRatio,
        y: (e.clientY - top) * window.devicePixelRatio
      };

      circles.forEach(circle => {
        if (isIntersect(pos, circle)) {
          console.log("click on circle: " + circle.id);
        }
      });
    });
  }

  update() {}
}

export default CollaborationNetwork;
