/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { cold } from "react-hot-loader";
import { useState, useEffect } from "react";
// import { schemeCategory10 } from "d3";

// import { MultiItemSearch } from "../../components/shared/search";
import { Row, Column } from "../../components/shared/layout";
import { MultiItemSearch } from "../../components/shared/search";
import { accessors } from "../../utils";
import Summary from "./Summary";
import Explainer from "./Explainer";

// import { ParticleContainerLatentSpace } from "../../visualizations/LatentSpace";
// import { AbsoluteCanvas } from "../../components/shared/renderer";
import { PageLayout } from "../../components/shared/layout";
import { useOrionData } from "../../OrionData.context";
import { schemeCategory10 } from "d3";

const LatentSpace = ({ papers = [] }) => {
  const {
    stage: {
      views: { particles },
    },
    papers: { byCountry, byTopic, byYear },
  } = useOrionData();

  const [selectedPaperIds, setSelectedPaperIds] = useState(papers);

  const updateSelectedPapers = (ids) => {
    // particles.viz.filter([]);
    setSelectedPaperIds(ids);
  };

  useEffect(() => {
    particles.viz.show();
    particles.viz.setParticleSelectionCallback(updateSelectedPapers);
    particles.viz.filter(papers);

    return function cleanup() {
      particles.viz.hide();
    };
  }, [particles.viz, papers]);

  // useEffect(() => {
  //   console.log("FILTERING");
  //   particles.viz.filter(selectedPaperIds);
  // }, [selectedPaperIds, particles.viz]);

  console.log(
    [accessors.filters.country].map((p) => accessors.types.country(p))
  );

  return (
    <PageLayout>
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
            {selectedPaperIds.length ? (
              <Summary
                paperIds={selectedPaperIds}
                onFilterReset={() => particles.viz.resetFilters()}
              />
            ) : (
              <Explainer />
            )}
          </Row>
        </Column>
      </div>
      <div
        css={css`
          position: absolute;
          top: 60px;
          left: 40%;
          width: 60%;
        `}
      >
        <Column>
          <MultiItemSearch
            colorScheme={schemeCategory10}
            dataset={byCountry.map((p) => accessors.types.country(p))}
            placeholder={"Search by country..."}
            // title={"Country"}
            onChange={() => {}}
            onHover={() => {}}
          />
          <MultiItemSearch
            colorScheme={schemeCategory10}
            dataset={byTopic.map((p) => accessors.types.topic(p))}
            placeholder={"Search by Topic..."}
            // title={"Country"}
            onChange={() => {}}
            onHover={() => {}}
          />
        </Column>
      </div>
    </PageLayout>
  );
};

export default cold(LatentSpace);
