// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "workerize-loader!./workers/force-layout";

/* @todo add functionality for links */
function ForceLayout(props) {
  let {
    nodes = [
      { id: "hello", radius: 6 },
      { id: "bla", radius: 6 },
      { id: "yo", radius: 2 },
      { id: "re", radius: 100 }
    ]
  } = props;
  const worker = Worker();

  worker.addEventListener("message", ({ data }) => {
    console.log(data);
  });

  worker.postMessage({
    type: "populate",
    nodes
  });

  worker.postMessage({
    type: "tick",
    ticks: 1
  });

  return {
    start: () => worker.postMessage("start"),
    stop: () => worker.postMessage("stop"),
    tick: async (iterations = 1) =>
      new Promise(resolve => {
        worker.addEventListener("message", ({ data }) => {
          if (data.type === "tick") resolve({ nodes });
        });

        worker.postMessage({ type: "tick", ticks: iterations });
      }),
    nodes: async () =>
      new Promise(resolve => {
        worker.addEventListener("message", ({ data }) => {
          if (data.type === "nodes") resolve({ nodes });
        });
        worker.postMessage({ type: "nodes" });
      }),
    terminate: () => worker.terminate()
  };
}

export default ForceLayout;
