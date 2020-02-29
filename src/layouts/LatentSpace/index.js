import { cold } from "react-hot-loader";
import React, { useRef, useEffect, useState, useMemo } from "react";
// import { useQuery } from "@apollo/react-hooks";

import { Row, Column } from "../../components/shared/layout";
import { formatThousands } from "../../utils";

import { MultiItemSearch } from "../../components/shared/search";
import Filters from "./Filters";

import { schemeCategory10 } from "d3";

import { ParticleContainerLatentSpace } from "../../visualizations/ParticleContainerLatentSpace";
import { AbsoluteCanvas } from "../../components/shared/renderer";
import { PAPER_CITATIONS } from "../../queries";

const LatentSpace = ({ data, papers }) => {
  const canvasRef = useRef(null);
  const particles = useRef(null);

  const [filters, setFilters] = useState({
    citations: 0,
    countries: papers.byCountry.map(p => p.country),
    topics: papers.byTopic.map(p => p.name)
  });

  const layout = useRef({
    nodes: data.map(item => {
      return {
        x: item.vector_3d[0] * 1000,
        y: item.vector_3d[1] * 1000,
        z: item.vector_3d[2] * 1000,
        id: item.id
      };
    })
  });

  // @todo memoization is not working for some reason
  // const filteredPapers = useMemo(() => {
  //   if (!particles.current) return;
  //   console.groupCollapsed("Filtering");
  //   console.time("Filtering ID");
  //   console.time("filteredByCountry");
  //   const filteredByCountry = new Set(
  //     p(papers.byCountry, filters.countries, d => d.country)
  //   );
  //   console.timeEnd("filteredByCountry");
  //   console.time("filteredByTopic");
  //   const filteredByTopic = new Set(
  //     p(papers.byTopic, filters.topics, d => d.name)
  //   );
  //   console.timeEnd("filteredByTopic");

  //   console.time("filteredIntersection");
  //   var intersect = new Set();
  //   for (var x of filteredByCountry)
  //     if (filteredByTopic.has(x)) intersect.add(x);
  //   console.timeEnd("filteredIntersection");
  //   console.timeEnd("Filtering ID");
  //   console.groupEnd("Filtering");

  //   return {
  //     ids: [...intersect],
  //     colors: c(papers.byCountry, filters.countries, d => d.country)
  //   };
  //   // return [...intersect];
  // }, [filters, papers.byCountry, papers.byTopic]);

  // useEffect(() => {
  //   console.groupCollapsed("Particle Viz Attribute Update");
  //   console.time("updating particle viz attributes");
  //   particles.current && particles.current.filterPapers(filteredPapers.ids);
  //   particles.current && particles.current.colorPapers(filteredPapers.colors);
  //   console.timeEnd("updating particle viz attributes");
  //   console.groupEnd("Particle Viz Attribute Update");
  // }, [filters, filteredPapers]);

  // return ids
  function p(data = [], include = [], accessor = id => id) {
    if (include.length === 0) return [...new Set(data.flatMap(d => d.ids))];

    return [
      ...new Set(include.flatMap(i => data.find(d => accessor(d) === i).ids))
    ];
  }

  // return ids paired with colors
  function c(data = [], include = [], accessor = id => id) {
    if (include.length === 0) {
      console.log("include length === 0");
      return [
        data
          .flatMap(d => d.ids)
          .map(id => ({
            id,
            color: "#ffffff"
          }))
      ];
    }
    const colors = schemeCategory10;

    return include.flatMap((i, idx) => {
      // console.log(data.find(d => accessor(d) === i).ids);
      return data
        .find(d => accessor(d) === i)
        .ids.map(id => ({
          id,
          color: colors[idx % colors.length]
        }));
    });
  }

  const updateVizAttributes = ({ ids, colors }) => {
    ids.length && particles.current && particles.current.filterPapers(ids);

    if (!colors) return;

    if (colors.length) {
      particles.current && particles.current.colorPapers(colors);
    } else {
      particles.current && particles.current.resetColors();
    }
  };

  useEffect(() => {
    console.log("new particle container");
    particles.current = new ParticleContainerLatentSpace({
      canvas: canvasRef.current,
      layout: layout.current
    });
  }, [canvasRef]);

  return (
    <div>
      <AbsoluteCanvas ref={canvasRef} />
      {/* <input
        type="range"
        value={citationFilter}
        min={1}
        max={100}
        onChange={e => setCitationFilter(e.target.value)}
      /> */}
      <Column width={1 / 8}>
        <Filters
          colorScheme={schemeCategory10}
          papers={papers}
          ids={layout.current.nodes.map(o => o.id)}
          dimensions={[
            {
              accessor: d => d.country,
              accessorName: "country",
              component: MultiItemSearch,
              data: papers.byCountry,
              filter: [],
              placeholder: "Search by Country...",
              title: "Country"
            },
            {
              accessor: d => d.name,
              accessorName: "name",
              component: MultiItemSearch,
              data: papers.byTopic,
              filter: [],
              placeholder: "Search by Topic...",
              title: "Topic"
            }
          ]}
          onChange={updateVizAttributes}
        />
        <Row>
          {/* <Summary paperIDs={filteredPapers.ids} filters={filters} /> */}
        </Row>
      </Column>
    </div>
  );
};

const Summary = ({ paperIDs, filters = [] }) => {
  const p = formatThousands(paperIDs.length);
  const c = filters.countries.length ? filters.countries.length : `All`;
  const t = filters.topics.length ? filters.topics.length : `All`;
  return <div>{`Showing ${p} papers from ${c} countries and ${t} topics`}</div>;
};

export default cold(LatentSpace);