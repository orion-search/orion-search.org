// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "workerize-loader!./workers/force-layout";

/* @todo add functionality for links */
function ForceLayout({ nodes }) {
  const worker = Worker();
  // // Attach an event listener to receive calculations from your worker
  worker.addEventListener("message", ({ data }) => {
    console.log(data);
  });

  // worker.postMessage({
  //   type: "init"
  // });

  worker.postMessage({
    type: "populate",
    nodes: [
      { id: "hello", radius: 6 },
      { id: "bla", radius: 6 },
      { id: "yo", radius: 2 },
      { id: "re", radius: 100 }
    ]
  });

  worker.postMessage({
    type: "tick",
    ticks: 100
  });
}

export default ForceLayout;
