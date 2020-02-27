/**
 * This acts as an interface between the filtering mechanism
 * and the web workers
 *
 * @todo implement methods for changing the filters after computation —
 * this will mean we don't have to init/destroy web workers
 * @todo figure out optimizations in how we compute set intersections
 * @todo generalize set intersections for N > 2 filter dimensions
 * @todo reduce onto Set? ie. paperIdArrays become two sets rather than two arrays
 */

/* eslint-env worker */
/* eslint no-restricted-globals: 0 */
import { from, forkJoin } from "rxjs";
import { reduce, toArray } from "rxjs/operators";

// store our reducers
let idsByDimension;

self.addEventListener("message", ({ data }) => {
  if (data) {
    const { type, dimensions } = data;

    switch (type) {
      case "init":
        idsByDimension = dimensions.map((d, i) => {
          return d.filter.length === 0
            ? from([...new Set(d.data.flatMap(e => e.ids))]).pipe(toArray())
            : from(d.filter).pipe(
                reduce(
                  (acc, dimValue) => [
                    ...acc,
                    ...d.data.find(n => n[d.accessorName] === dimValue).ids
                  ],
                  []
                )
              );
        });
        self.postMessage({
          type: "init"
        });

        break;
      case "compute":
        forkJoin(...idsByDimension).subscribe(paperIdArrays => {
          // compute intersection here
          // @todo chance to optimize?
          var intersect = new Set();
          const setA = new Set(paperIdArrays[0]);
          const setB = new Set(paperIdArrays[1]);
          console.log(setA, setB);
          if (setA.size < setB.size) {
            for (let x of setA) if (setB.has(x)) intersect.add(x);
          } else {
            for (let x of setB) if (setA.has(x)) intersect.add(x);
          }
          // console.log(intersect);

          self.postMessage({
            type: "compute",
            data: [...intersect]
          });
        });
        break;
      default:
        break;
    }
  }
});
/* eslint no-restricted-globals: 1 */
