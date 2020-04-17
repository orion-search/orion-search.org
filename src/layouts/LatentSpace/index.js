/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { cold } from "react-hot-loader";
import { Fragment, useRef, useState, useEffect } from "react";
import { schemeCategory10 } from "d3";
import { Query } from "@apollo/react-components";

import { Row, Column } from "../../components/shared/layout";
import { accessors, formatThousands } from "../../utils";
import { PAPER_METADATA } from "../../queries";

import { MultiItemSearch } from "../../components/shared/search";
import Filters from "./Filters";

import { ParticleContainerLatentSpace } from "../../visualizations/LatentSpace";
import { AbsoluteCanvas } from "../../components/shared/renderer";

const LatentSpace = ({ data, papers }) => {
  const [selectedPaperIds, setSelectedPaperIds] = useState([]);
  const canvasRef = useRef(null);
  const selectionBoxRef = useRef(null);
  const particles = useRef(null);

  const layout = useRef({
    nodes: data.map((item) => {
      const [x, y, z] = accessors.types.vector3d(item);
      const id = accessors.types.id(item);
      return {
        x: x * 1000,
        y: y * 1000,
        z: z * 1000,
        id,
      };
    }),
  });

  const updateVizAttributes = ({ ids, colors }) => {
    ids.length && particles.current && particles.current.filterPapers(ids);
    particles.current && particles.current.rotation(false);

    if (!colors) return;

    if (colors.length) {
      particles.current && particles.current.colorPapers(colors);
    } else {
      particles.current && particles.current.resetColors();
    }
  };

  const updateSelectedPapers = (ids) => {
    setSelectedPaperIds(ids);
  };

  useEffect(() => {
    console.log("new particle container");
    particles.current = new ParticleContainerLatentSpace({
      canvas: canvasRef.current,
      layout: layout.current,
      selectionBoxRef: selectionBoxRef.current,
      selectionCallback: updateSelectedPapers,
    });
  }, [canvasRef]);

  return (
    <Fragment>
      <AbsoluteCanvas ref={canvasRef} />
      {/* <SelectionBoxWrapper ref={selectionBoxRef} /> */}
      <div
        css={css`
          position: absolute;
          top: 60px;
          width: 25%;
        `}
      >
        <Column>
          {/* <Filters
            colorScheme={schemeCategory10}
            papers={papers}
            ids={layout.current.nodes.map((o) => accessors.types.id(o))}
            dimensions={[
              {
                accessor: accessors.types.country,
                accessorName: accessors.names.country,
                component: MultiItemSearch,
                data: papers[accessors.filters.country],
                filter: [],
                placeholder: "Search by Country...",
                title: "Country",
              },
              {
                accessor: accessors.types.topic,
                accessorName: accessors.names.topic,
                component: MultiItemSearch,
                data: papers[accessors.filters.topic],
                filter: [],
                placeholder: "Search by Topic...",
                title: "Topic",
              },
            ]}
            onChange={updateVizAttributes}
          /> */}
          <Row>
            <Summary paperIds={selectedPaperIds} />
          </Row>
        </Column>
      </div>
    </Fragment>
  );
};

const Summary = ({ paperIds }) => {
  const p = formatThousands(paperIds.length);
  if (!paperIds.length) return null;
  return (
    <Query query={PAPER_METADATA} variables={{ ids: paperIds.slice(0, 20) }}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) throw error;
        if (!data.papers) return null;
        return (
          <ul>
            <li>{`Showing 20/${p} papers -> EXPLORE CLUSTER`}</li>
            {data.papers.map((p) => (
              <li key={`${p.id}`}>{p.title}</li>
            ))}
          </ul>
        );
      }}
    </Query>
  );
  // return <div>{`Showing ${p} papers from`}</div>;
};

export default cold(LatentSpace);
