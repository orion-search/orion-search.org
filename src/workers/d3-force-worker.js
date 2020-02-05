/* eslint-env worker */
/* eslint no-restricted-globals: 0 */
import { forceSimulation, forceLink, forceManyBody } from "d3";

const link = forceLink();
const simulation = forceSimulation().on("tick", () => {
  postMessage({
    nodes: simulation.nodes(),
    links: link.links()
  });
});

let active;

self.addEventListener("message", ({ data }) => {
  if (data) {
    const {
      nodes,
      links,
      newNode,
      minWeight,
      width,
      height,
      construct,
      lastAddedNodeIdx,
      type
    } = data;

    // const [key, val] = setting;

    switch (type) {
      case "populate":
        active = construct
          ? {
              links: [],
              nodes: nodes.slice(lastAddedNodeIdx, 1)
            }
          : { links, nodes };
        if (active.nodes && active.links && minWeight && width && height) {
          link.links(
            active.links.filter(l => {
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
              "charge",
              forceManyBody()
                .strength(-100)
                .distanceMin(30)
                .distanceMax(150)
            )
            // .force("center", forceCenter(width / 2, height / 2))
            .velocityDecay(0.4)
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
          links: link.links()
        });
        break;

      case "add-node":
        active.nodes.push(newNode);
        for (let i = 0; i < lastAddedNodeIdx; i++) {
          active.links = [
            ...active.links,
            ...(links.filter(
              l => l.source === i && l.target === lastAddedNodeIdx
            ) || []),
            ...(links.filter(
              l => l.target === i && l.source === lastAddedNodeIdx
            ) || [])
          ];
        }
        simulation
          .nodes(active.nodes)
          .force("link", forceLink(active.links))
          .velocityDecay(0.4)
          .alphaTarget(0.1);

        self.postMessage({
          type: "nodes",
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

      case "links":
        self.postMessage({ type: "links", links: link.links() });
        break;

      default:
    }
  }
});
/* eslint no-restricted-globals: 1 */
