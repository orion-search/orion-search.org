/**
 * This component takes in a data structure of dimensions,
 * alongside their respective filter arrays and renders
 * provided components for each filtering type.
 *
 * At the moment only MultiItemSearch filter components are supported,
 * but in the future it would make sense to develop Range-like filtering
 * for numerical filtering of eg. citations.
 *
 * Using rxjs observables, we throttle hover interactions on filters
 * and, at the end of each emission, the filter stack is passed to
 * a web wowrker to compute the intersection of paper IDs, so the UI
 * doesn't freeze
 *
 * @todo debounce hover interactions
 * @todo compute ID intersections on web-worker
 * @todo investigate the use of https://github.com/LeetCode-OpenSource/rxjs-hooks
 * @todo figure out distinctUntilChanged operators in order to de-dupe operations on identical fukter sets
 * @todo find way to combine filters_ with filtersHover_
 */

import React, { useRef } from "react";

import { Row } from "../../components/shared/layout";

import { BehaviorSubject } from "rxjs";
import {
  throttleTime,
  skip
  // distinctUntilChanged
} from "rxjs/operators";

import CrossFilter from "../../workers/subscribers/crossfilter";

const Filters = ({ colorScheme, ids, papers, dimensions, onChange }) => {
  const filtersRef = useRef(dimensions.map(d => d.filter));
  const filters_ = new BehaviorSubject();
  const filtersHover_ = new BehaviorSubject();

  const crossFilterSubscriber = useRef(null);

  const onFilterComponentChange = ({ filterIdx, _ }) => value => {
    filtersRef.current[filterIdx] = value;
    filters_.next(filtersRef.current);
  };

  const onFilterComponentHover = ({ filterIdx, _ }) => value => {
    filtersRef.current[filterIdx] = value;
    filtersHover_.next(filtersRef.current);
  };

  const spawnIntersectionWorker = filters => {
    return CrossFilter({
      dimensions: dimensions.map((d, i) => ({
        accessorName: i === 0 ? "country" : "name",
        data: d.data,
        filter: filters[i]
      }))
    });
  };

  filtersHover_.pipe(skip(1)).subscribe(filters => {
    crossFilterSubscriber.current = spawnIntersectionWorker(filters);

    crossFilterSubscriber.current.compute().then(ids => {
      console.timeEnd("web worker computations");
      console.groupEnd("web worker computations");
      onChange({
        ids,
        colors: null
      });
      crossFilterSubscriber.current.terminate();
    });
  });

  filters_
    .pipe(
      // don't emit provided filter props
      skip(1),
      throttleTime(1000)
      // pairwise()
      // distinctUntilChanged((prev, current) => {
      //   console.log(prev, current);
      //   for (let i = 0; i < prev.length; i++) {
      //     if (prev[i].toString() !== current[i].toString()) return false;
      //   }
      //   return true;
      // })
    )
    .subscribe(filters => {
      console.log(filters);
      console.groupCollapsed("web worker computations");
      console.time("web worker computations");

      crossFilterSubscriber.current = spawnIntersectionWorker(filters);

      crossFilterSubscriber.current.compute().then(ids => {
        console.timeEnd("web worker computations");
        console.groupEnd("web worker computations");
        onChange({
          ids,
          colors: filters[0].length
            ? filters[0].flatMap((d, idx) =>
                dimensions[0].data
                  .find(e => e[dimensions[0].accessorName] === d)
                  .ids.map(id => ({
                    color: colorScheme[idx % colorScheme.length],
                    id
                  }))
              )
            : []
        });
        crossFilterSubscriber.current.terminate();
      });
    });

  return (
    <>
      {dimensions.map((d, filterIdx) => {
        const TagName = d.component;
        return (
          <Row key={`${d.title}-row`}>
            <TagName
              colorScheme={filterIdx === 0 && colorScheme}
              dataset={d.data.map(p => d.accessor(p))}
              placeholder={d.placeholder}
              title={d.title}
              onChange={onFilterComponentChange({ filterIdx })}
              onHover={onFilterComponentHover({ filterIdx })}
            />
          </Row>
        );
      })}
    </>
  );
};

export default Filters;