/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { cold } from "react-hot-loader";
import { useState, useEffect } from "react";
import Select from "react-select";
import styled from "@emotion/styled";
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

const LatentSpace = ({ papers = [], filters }) => {
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
      <Filters
        dimensions={[
          {
            data: byCountry.map((p) => accessors.types.country(p)),
            filter: [],
            placeholder: "Search by Country...",
            selected: filters.country,
            title: "Country",
            accessor: "country",
          },
          {
            data: byTopic.map((p) => accessors.types.topic(p)),
            filter: [],
            placeholder: "Search by Topic...",
            selected: filters.topic,
            title: "Topic",
            accessor: "topic",
          },
        ]}
      />
    </PageLayout>
  );
};

const Filters = ({ dimensions }) => {
  const Filter = styled(Select)`
    width: 45%;
    color: ${(props) => props.theme.colors.black};
    font-size: ${(props) => props.theme.type.sizes.normal};
  `;

  console.log(dimensions);
  return (
    <Row
      css={css`
        position: absolute;
        top: 80px;
        left: 40%;
        width: 50%;
        justify-content: space-between;
      `}
    >
      {/* <Column width={1 / 3}> */}
      {dimensions.map((dimension) => (
        <Filter
          closeMenuOnSelect={false}
          isMulti
          key={`${dimension.title}-filter`}
          name={dimension.title}
          defaultValue={
            dimension.selected?.length
              ? dimension.selected.map((d) => ({ value: d, label: d }))
              : []
          }
          // onChange={(e) => {
          //   console.log(e, "onChange");
          // }}
          options={dimension.data.map((d) => ({ value: d, label: d }))}
          placeholder={dimension.placeholder}
        />
      ))}
      {/* </Column> */}
    </Row>
  );
};

export default cold(LatentSpace);
