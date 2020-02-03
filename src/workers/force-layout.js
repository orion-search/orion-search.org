/* eslint-env worker */
/* eslint no-restricted-globals: 0 */
import {
  forceSimulation,
  forceCollide,
  forceX,
  forceY,
  forceManyBody
} from "d3";

const simulation = forceSimulation().on("tick", () => {
  postMessage({
    nodes: simulation.nodes()
  });
});

self.addEventListener("message", ({ data }) => {
  if (data) {
    const { nodes, minWeight, width, height, type, setting } = data;

    // const [key, val] = setting;
    const collide = forceCollide()
      .radius(d => d.radius)
      .iterations(2);

    switch (type) {
      case "populate":
        console.info("populating force layout", nodes);
        simulation
          .nodes(nodes)
          // .force(
          //   "charge",
          //   forceManyBody()
          //     .strength(-100)
          //     .distanceMin(30)
          //     .distanceMax(150)
          // )
          .force("x", forceX().strength(0.002))
          .force("y", forceY().strength(0.002))
          .force("collide", collide)
          // .force("center", forceCenter(width / 2, height / 2))
          .velocityDecay(0.4)
          .stop();
        break;

      case "tick":
        for (let i = 0; i < data.ticks; i++) {
          simulation.tick();
        }
        self.postMessage({
          type: "tick",
          nodes: simulation.nodes()
        });
        break;

      case "stop":
        simulation.stop();
        self.postMessage({
          type: "stop"
        });
        break;

      case "start":
        simulation.restart();
        self.postMessage({
          type: "start"
        });
        break;

      case "nodes":
        self.postMessage({ type: "nodes", nodes: simulation.nodes() });
        break;

      case "set":
        if (typeof simulation[key] === "function") {
          try {
            simulation[key](val);
            self.postMessage({ type: "set", setting: [key, val] });
          } catch (e) {
            self.postMessage({
              type: "set",
              error: new Error("Invalid setting")
            });
          }
        } else {
          self.postMessage({
            type: "set",
            error: new Error("Invalid setting")
          });
        }
        break;
      default:
    }
  }
});

/* eslint no-restricted-globals: 1 */
