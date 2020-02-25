/* eslint-env worker */
/* eslint no-restricted-globals: 0 */
import { from, forkJoin } from "rxjs";
import { reduce } from "rxjs/operators";

// store our reducers
let idsByDimension;

self.addEventListener("message", ({ data }) => {
  if (data) {
    const { type, dimensions } = data;

    switch (type) {
      case "init":
        idsByDimension = dimensions.map((d, i) =>
          from(d.filter).pipe(
            reduce(
              (acc, dimValue) => [
                ...acc,
                d.data.find(n => n[d.accessorName] === dimValue).ids
              ],
              []
            )
          )
        );
        self.postMessage({
          type: "init"
        });

        break;
      case "compute":
        console.log("web worker: computing");
        forkJoin(...idsByDimension).subscribe(paperIdArrays => {
          // console.log("done", paperIdArrays);
          self.postMessage({
            type: "compute",
            data: paperIdArrays
          });
        });
        break;
      default:
        break;
    }
  }
});
/* eslint no-restricted-globals: 1 */
