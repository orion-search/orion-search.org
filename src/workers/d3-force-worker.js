/* eslint-env worker */
/* eslint no-restricted-globals: 0 */
import {
  forceSimulation,
  forceLink,
  forceX,
  forceY,
  forceCollide,
  forceManyBody,
} from "d3";

const link = forceLink();
const simulation = forceSimulation().on("tick", () => {
  postMessage({
    nodes: simulation.nodes(),
    links: link.links(),
  });
});

let active;

self.addEventListener("message", ({ data }) => {
  if (data) {
    const { nodes, links, minWeight, width, height, type, setting } = data;

    switch (type) {
      case "populate":
        active = { links, nodes };
        if (active.nodes && active.links && minWeight && width && height) {
          link.links(
            active.links.filter((l) => {
              if (!l.weight) return true;
              return l.weight >= minWeight;
            })
          );

          simulation
            .nodes(active.nodes)
            .force(
              "link",
              link.id(({ id }) => id)
            )
            .force(
              "x",
              forceX().x(({ x }) => x)
            )
            .force(
              "y",
              forceY().y(({ y }) => y)
            )
            // .force(
            //   "charge",
            //   forceManyBody()
            //     .strength(-100)
            //     .distanceMin(40)
            //     .distanceMax(130)
            // )
            .force(
              "collide",
              forceCollide()
                .radius(({ r }) => r)
                .iterations(2)
            )
            // .force("center", forceCenter(width / 2, height / 2))
            .velocityDecay(0.8)
            .stop();
        }

        break;

      case "tick":
        for (let i = 0; i < data.ticks; i++) {
          simulation.tick();
        }

        self.postMessage({
          type: "tick",
          nodes: simulation.nodes(),
          links: link.links(),
        });
        break;

      case "stop":
        simulation.stop();
        self.postMessage({
          type: "stop",
        });
        break;

      case "start":
        simulation.restart();
        self.postMessage({
          type: "start",
        });
        break;

      case "nodes":
        self.postMessage({ type: "nodes", nodes: simulation.nodes() });
        break;

      case "links":
        self.postMessage({ type: "links", links: link.links() });
        break;

      case "set":
        const [key, val] = setting;
        if (typeof simulation[key] === "function") {
          try {
            simulation[key](val);
            self.postMessage({ type: "set", setting: [key, val] });
          } catch (e) {
            self.postMessage({
              type: "set",
              error: new Error("Invalid setting"),
            });
          }
        } else {
          self.postMessage({
            type: "set",
            error: new Error("Invalid setting"),
          });
        }
        break;
      default:
    }
  }
});
/* eslint no-restricted-globals: 1 */
