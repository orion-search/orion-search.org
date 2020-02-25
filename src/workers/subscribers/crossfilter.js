// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "workerize-loader!../crossfilter";
import { fromEvent } from "rxjs";
import { filter } from "rxjs/operators";

function CrossFilter({ ids = [], dimensions = [] }) {
  const worker = new Worker();
  const worker$ = fromEvent(worker, "message");
  const compute$ = worker$.pipe(
    filter(({ data: { type } }) => type === "compute")
  );

  worker.postMessage({
    type: "init",
    dimensions: dimensions.map(d => ({
      accessorName: d.accessorName,
      data: d.data,
      filter: d.filter
    }))
  });

  return {
    compute: async () =>
      new Promise(resolve => {
        compute$.subscribe(({ data }) => {
          // console.log("compute subscription", data);
          resolve(data);
        });
        worker.postMessage({
          type: "compute"
        });
      }),
    terminate: () => worker.terminate()
  };
}

export default CrossFilter;
