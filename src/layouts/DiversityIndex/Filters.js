/** @jsx jsx */
/** @jsxFrag Fragment */
import { css, jsx } from "@emotion/core";
import { Fragment } from "react"; // eslint-disable-line no-unused-vars

import { Column, Row } from "../../components/shared/layout";
import Toggle from "../../components/shared/toggle";
import { accessors } from "../../utils/accessors";

// const groupings = ["topic", "country"];

// these should be data-driven
export const filterOptions = {
  groupings: [accessors.names.topic, accessors.names.country],
  time: [2019, 2018, 2017, 2016],
  x: [accessors.names.diversity],
  y: [accessors.names.femaleShare, accessors.names.rca],
};

// contains all the filters
const Filters = ({
  groupingAccessor,
  onChangeGrouping = () => {},
  onChangeX = () => {},
  onChangeY = () => {},
  onChangeYear = () => {},
  x = filterOptions.x[0],
  y = filterOptions.y[0],
  year,
}) => {
  return (
    <Row
      css={(props) => css`
        padding: ${props.spacing.normal} 5vw;
        margin: 0 -5vw;
        backdrop-filter: blur(2px) brightness(20%);
        border-bottom: 1px solid white;
        justify-content: flex-start;
        flex-wrap: wrap;
      `}
    >
      <Column width={0.55}>
        <div>{`Explore research diversity metrics across different countries or topical research areas.`}</div>
        <div>{`Use the toggles on the right to change the axes, groupings, or time filters`}</div>
      </Column>
      <Column width={0.2}>
        {/* Explore diversity by{" "} */}
        <Toggle
          values={filterOptions.groupings}
          selected={groupingAccessor}
          onChange={onChangeGrouping}
        />
        {"  "}
        {/* in{"  "} */}
        <Toggle
          values={filterOptions.time}
          selected={year}
          onChange={onChangeYear}
        />
        {/* <Legend /> */}
      </Column>
      <Column width={0.25}>
        <div>
          {`x-axis: (`}
          <Toggle values={filterOptions.x} selected={x} onChange={onChangeX} />
          {`)`}
        </div>
        <div>
          {`y-axis: (`}
          <Toggle values={filterOptions.y} selected={y} onChange={onChangeY} />
          {`)`}
        </div>
      </Column>
    </Row>
  );
};

export default Filters;
