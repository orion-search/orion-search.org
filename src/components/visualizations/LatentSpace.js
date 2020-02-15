import React, { useRef, useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Row, Column } from "../layout";

import Search from "../search";

import { ParticleContainerLatentSpace } from "../visualizations/ParticleContainerLatentSpace";
import { AbsoluteCanvas } from "../renderer";
import { PAPER_CITATIONS } from "../../queries";
import { useOrionData } from "../../OrionData.context";

const LatentSpace = ({ data }) => {
  const canvasRef = useRef(null);
  const particles = useRef(null);

  const [citationFilter, setCitationFilter] = useState(0);

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

  // useEffect(() => {
  //   particles.current = new ParticleContainerLatentSpace({
  //     canvas: canvasRef.current,
  //     layout: layout.current
  //   });
  // }, [canvasRef]);

  return (
    <div>
      <AbsoluteCanvas ref={canvasRef} />
      <input
        type="range"
        value={citationFilter}
        min={1}
        max={100}
        onChange={e => setCitationFilter(e.target.value)}
      />
      <Row width={2 / 4}>
        <Column width={2 / 4}>
          <Search
            dataset={useOrionData().papers.byCountry.map(p => p.country)}
            placeholder={"Search by country..."}
          />
        </Column>
        <Column width={2 / 4}>
          <Search
            dataset={useOrionData().papers.byTopic.map(p => p.name)}
            placeholder={"Search by topic..."}
          />
        </Column>
      </Row>
    </div>
  );
};

export default LatentSpace;
