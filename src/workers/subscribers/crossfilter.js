/**
 * This class acts as a liaison between Filter components
 * and the crossfilter web worker.
 *
 * @todo implement message passing that enables re-computation of
 * dimension filters. This way we don't have to destroy and spawn web workers.
 */

// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "workerize-loader!../crossfilter";
import { fromEvent } from "rxjs";
import { filter } from "rxjs/operators";

export default function CrossFilter({ dimensions = [] }) {
  const worker = new Worker();
  const workerObservable = fromEvent(worker, "message");
  const computeObservable = workerObservable.pipe(
    filter(({ data: { type } }) => type === "compute")
  );

  worker.postMessage({
    type: "init",
    dimensions,
  });

  return {
    compute: async () =>
      new Promise((resolve) => {
        computeObservable.subscribe(({ data: { type, data } }) => {
          resolve(data);
        });
        worker.postMessage({
          type: "compute",
        });
      }),
    dimensions: (dimensions) => {
      worker.postMessage({
        type: "init",
        dimensions,
      });
    },
    terminate: () => worker.terminate(),
  };
}
