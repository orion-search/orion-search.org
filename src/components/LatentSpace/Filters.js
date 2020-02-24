import React, { useRef, useEffect, useState, useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";

import { useOrionData } from "../../OrionData.context";
import { MultiItemSearch } from "../search";
import { Row } from "../layout";

import { from, forkJoin } from "rxjs";
import { filter, merge, scan, distinct, reduce, map } from "rxjs/operators";

/**
 takes different data frames, filters the intersection and gives back the node indices

 compute the filter stack for enter/hover interactions
*/
const Filters = ({ filters, ids, papers }) => {
  const [filterState, setFilterState] = useState(filters);
  const prevFiltersRef = useRef();

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
      <Row>
        <MultiItemSearch
          dataset={useOrionData().papers.byCountry.map(p => p.country)}
          placeholder={"Search by country..."}
          title={"Country"}
        />
      </Row>
      <Row>
        <MultiItemSearch
          dataset={useOrionData().papers.byTopic.map(p => p.name)}
          title={"Topic"}
          placeholder={"Search by topic..."}
        />
      </Row>
    </>
  );
};

export default Filters;
