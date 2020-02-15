import React, { useRef, useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Row, Column } from "../layout";

import { MultiItemSearch } from "../search";

import { ParticleContainerLatentSpace } from "../visualizations/ParticleContainerLatentSpace";
import { AbsoluteCanvas } from "../renderer";
import { PAPER_CITATIONS } from "../../queries";
import { useOrionData } from "../../OrionData.context";

const LatentSpace = ({ data }) => {
  const canvasRef = useRef(null);
  const particles = useRef(null);

  const [citationFilter, setCitationFilter] = useState(0);
  const [filters, setFilters] = useState({
    citations: 0,
    countries: useOrionData().papers.byCountry.map(p => p.country),
    topics: useOrionData().papers.byTopic.map(p => p.name)
  });

  const { papers } = useOrionData();

  console.log(useOrionData());

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
        x: item.vector_3d[0] * 100,
        y: item.vector_3d[1] * 100,
        z: item.vector_3d[2] * 100,
        id: item.id
      };
    })
  });

  useEffect(() => {
    console.log("filters", filters);
    const filteredByCountry = new Set(
      p(papers.byCountry, filters.countries, d => d.country)
    );
    const filteredByTopic = new Set(
      p(papers.byTopic, filters.topics, d => d.name)
    );

    var intersect = new Set();
    for (var x of filteredByCountry)
      if (filteredByTopic.has(x)) intersect.add(x);

    particles.current && particles.current.filterPapers([...intersect]);
  }, [filters]);

  // return ids
  function p(data = [], include = [], accessor = id => id) {
    if (include.length === 0) return [...new Set(data.flatMap(d => d.ids))];

    return [
      ...new Set(include.flatMap(i => data.find(d => accessor(d) === i).ids))
    ];
  }

  // useEffect(() => {
  //   console.log(`Filtering for articles with over ${citationFilter} citations`);
  // }, [citationFilter]);

  // useEffect(() => {
  //   // first time round
  //   if (!filters.citations.data) return;
  //   if (!particles.current) return;

  //   // @todo need to debounce this
  //   // @todo multiple effects and set union here

  //   if (citationFilter === 0) {
  //     particles.current.filterPapers();
  //   } else {
  //     const paperIDs = filters.citations.data.papers.map(p => p.id);

  //     particles.current.filterPapers(paperIDs);
  //   }
  // }, [filters.citations.data, citationFilter]);

  useEffect(() => {
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
            dataset={useOrionData().papers.byCountry.map(p => p.country)}
            onChange={countries =>
              setFilters({
                ...filters,
                countries
              })
            }
            // onChange={c => console.log(c)}
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
            // onChange={topics => console.log("topics", topics)}
            title={"Topic"}
            placeholder={"Search by topic..."}
          />
        </Row>
      </Column>
    </div>
  );
};

export default LatentSpace;
