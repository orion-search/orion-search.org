/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { cold } from "react-hot-loader";
import { Fragment, useRef, useState, useEffect } from "react";
import { schemeCategory10 } from "d3";

import { MultiItemSearch } from "../../components/shared/search";

import { Row, Column } from "../../components/shared/layout";
import { accessors } from "../../utils";
import Summary from "./Summary";

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

export default cold(LatentSpace);
