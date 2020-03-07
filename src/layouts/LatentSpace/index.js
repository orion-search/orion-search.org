import { cold } from "react-hot-loader";
import React, { useRef, useEffect, useState } from "react";
// import { useQuery } from "@apollo/react-hooks";

import { Row, Column } from "../../components/shared/layout";
import { formatThousands, accessors } from "../../utils";

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
    countries: papers[accessors.filters.country].map(p =>
      accessors.types.country(p)
    ),
    topics: papers[accessors.filters.topic].map(p => accessors.types.topic(p))
  });

  const layout = useRef({
    nodes: data.map(item => {
      const [x, y, z] = accessors.types.vector3d(item);
      const id = accessors.types.id(item);
      return {
        x: x * 1000,
        y: y * 1000,
        z: z * 1000,
        id
      };
    })
  });

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
          ids={layout.current.nodes.map(o => accessors.types.id(o))}
          dimensions={[
            {
              accessor: accessors.types.country,
              accessorName: accessors.names.country,
              component: MultiItemSearch,
              data: papers[accessors.filters.country],
              filter: [],
              placeholder: "Search by Country...",
              title: "Country"
            },
            {
              accessor: accessors.types.topic,
              accessorName: accessors.names.topic,
              component: MultiItemSearch,
              data: papers[accessors.filters.topic],
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
