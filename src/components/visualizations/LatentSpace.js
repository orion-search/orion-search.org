import { cold } from "react-hot-loader";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";

import { Row, Column } from "../layout";
import { formatThousands } from "../../utils";

import { MultiItemSearch } from "../search";

import { schemeCategory10 } from "d3";

import { ParticleContainerLatentSpace } from "../visualizations/ParticleContainerLatentSpace";
import { AbsoluteCanvas } from "../renderer";
import { PAPER_CITATIONS } from "../../queries";
import { useOrionData } from "../../OrionData.context";

const LatentSpace = ({ data }) => {
  const canvasRef = useRef(null);
  const particles = useRef(null);

  // const [citationFilter, setCitationFilter] = useState(0);
  const [filters, setFilters] = useState({
    citations: 0,
    countries: useOrionData().papers.byCountry.map(p => p.country),
    topics: useOrionData().papers.byTopic.map(p => p.name)
  });

  const { papers } = useOrionData();

  // const filters = {
  //   citations: useQuery(PAPER_CITATIONS, {
  //     variables: {
  //       citations: citationFilter
  //     }
  //   })
  // };

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
  const filteredPapers = useMemo(() => {
    console.time("Filtering ID");
    const filteredByCountry = new Set(
      p(papers.byCountry, filters.countries, d => d.country)
    );
    const filteredByTopic = new Set(
      p(papers.byTopic, filters.topics, d => d.name)
    );

    var intersect = new Set();
    for (var x of filteredByCountry)
      if (filteredByTopic.has(x)) intersect.add(x);
    console.timeEnd("Filtering ID");

    return {
      ids: [...intersect],
      colors: c(papers.byCountry, filters.countries, d => d.country)
    };
    // return [...intersect];
  }, [filters.countries, filters.topics]);

  useEffect(() => {
    particles.current && particles.current.filterPapers(filteredPapers.ids);
    particles.current && particles.current.colorPapers(filteredPapers.colors);
  }, [filters.countries, filters.topics]);

  // return ids
  function p(data = [], include = [], accessor = id => id) {
    filters.countries.map(d => ({}));

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
        <Row width={4 / 4}>
          <MultiItemSearch
            colorScheme={schemeCategory10}
            dataset={useOrionData().papers.byCountry.map(p => p.country)}
            onChange={countries =>
              setFilters({
                ...filters,
                countries
              })
            }
            placeholder={"Search by country..."}
            title={"Country"}
          />
        </Row>
        <Row width={4 / 4}>
          <MultiItemSearch
            dataset={useOrionData().papers.byTopic.map(p => p.name)}
            onChange={topics =>
              setFilters({
                ...filters,
                topics
              })
            }
            title={"Topic"}
            placeholder={"Search by topic..."}
          />
        </Row>
        <Row>
          <Summary paperIDs={filteredPapers.ids} filters={filters} />
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
