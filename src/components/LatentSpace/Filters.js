import React, { useRef, useEffect, useState, useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";

import { useOrionData } from "../../OrionData.context";
import { MultiItemSearch } from "../search";
import { Row } from "../layout";

import { from, forkJoin } from "rxjs";
import { filter, merge, scan, distinct, reduce, map } from "rxjs/operators";

import CrossFilter from "../../workers/subscribers/crossfilter";

/**
 takes different data frames, filters the intersection and gives back the node indices

 compute the filter stack for enter/hover interactions

 @todo debounce hover interactions
 @todo compute ID intersections on web-worker
*/
const Filters = ({ filters, ids, papers, dimensions }) => {
  const [filterState, setFilterState] = useState(filters);
  const prevFiltersRef = useRef();

  const crossFilterSubscriber = useRef(
    new CrossFilter({
      dimensions: dimensions.map((d, i) => ({
        accessorName: i === 0 ? "country" : "name",
        data: d.data,
        filter: i === 0 ? filters.countries : filters.topics
      }))
    })
  );
  crossFilterSubscriber.current.compute().then(d => {
    console.log("web worker done", d);
  });

  console.log(filters);
  // this hook keeps track of previous state
  useEffect(() => {
    prevFiltersRef.current = filterState;
  });

  console.time("transducer");

  // what happens in case of empty filter?
  const idsByCountry$ = from(filters.countries).pipe(
    reduce(
      (acc, country) => [
        ...acc,
        ...papers.byCountry.find(n => n.country === country).ids
      ],
      []
    )
  );

  // what happens in case of empty filter?
  const idsByTopic$ = from(filters.topics).pipe(
    reduce(
      (acc, topic) => [
        ...acc,
        ...papers.byTopic.find(n => n.name === topic).ids
      ],
      []
    )
  );

  forkJoin(idsByCountry$, idsByTopic$).subscribe(papers => {
    // @todo merge distinct array elements

    console.timeEnd("transducer");
  });

  // const allFiltered = merge(idsByCountry$, idsByTopic$)

  // idsByCountry$.subscribe(papers => {
  //   console.log(papers);
  //   console.timeEnd("transducer");
  // });
  // console.log(r);

  return (
    <>
      {dimensions.map(d => {
        const TagName = d.component;
        return (
          <Row key={`${d.title}-row`}>
            <TagName
              dataset={d.data.map(p => d.accessor(p))}
              placeholder={d.placeholder}
              title={d.title}
            />
          </Row>
        );
      })}
    </>
  );
};

export default Filters;
