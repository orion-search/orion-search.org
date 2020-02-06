import { fromEvent } from "rxjs";
import { filter } from "rxjs/operators";
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "workerize-loader!./workers/d3-force-worker";

/**
 * Takes in a, non-hierarchical weighted graph
 * and initialize a Force Layout Simulation
 */
function ForceLayout(props) {
  let { nodes, links, minWeight = 1 } = props;

  const worker = new Worker();
  const worker$ = fromEvent(worker, "message");

  // worker$.subscribe(console.log);

  const tick$ = worker$.pipe(filter(({ data: { type } }) => type === "tick"));

  tick$.subscribe(({ links: newLinks, nodes: newNodes }) => {
    links = newLinks;
    nodes = newNodes;
  });

  // Initialise worker
  worker.postMessage({
    type: "populate",
    links,
    nodes,
    minWeight,
    width: window.innerWidth,
    height: window.innerHeight
  });

  return {
    start: () => worker.postMessage("start"),
    stop: () => worker.postMessage("stop"),
    tick: async (iterations = 1) =>
      new Promise(resolve => {
        tick$.subscribe(({ data: { links, nodes } }) => {
          resolve({ links, nodes });
        });
        worker.postMessage({ type: "tick", ticks: iterations });
      }),
    nodes: async () =>
      new Promise(resolve => {
        worker$.subscribe(({ data: { type, nodes } }) => {
          if (type === "nodes") resolve({ nodes });
        });
        worker.postMessage({ type: "nodes" });
      }),
    links: async () =>
      new Promise(resolve => {
        worker$.subscribe(({ data: { type, links } }) => {
          if (type === "links") resolve({ links });
        });
        worker.postMessage({ type: "links" });
      }),
    set: async (key, value) =>
      new Promise((resolve, reject) => {
        worker$.subscribe(({ type, setting, error }) => {
          if (type === "set" && error) reject(error);
          else resolve(setting);
        });
        worker.postMessage({ type: "set", setting: [key, value] });
      }),
    worker$,
    tick$,
    terminate: () => worker.terminate()
  };
}

export default ForceLayout;
