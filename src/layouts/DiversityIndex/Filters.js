/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { Row } from "../../components/shared/layout";
import Dropdown from "../../components/shared/dropdown";

const groupings = ["topic", "country"];

// contains all the filters
const Filters = ({
  onChangeGrouping = () => {},
  onChangeYear = () => {},
  year,
  groupingAccessor
}) => {
  return (
    <Row
      width={"fit-content"}
      css={props => css`
        width: fit-content;
        border-bottom: 1px solid white;
        align-items: center;
      `}
    >
      Explore diversity by{" "}
      <Dropdown
        values={groupings}
        selected={groupingAccessor}
        onChange={onChangeGrouping}
      />
      in
      <Dropdown
        values={[2016, 2017, 2018, 2019]}
        selected={year}
        onChange={onChangeYear}
      />
      {/* <Legend /> */}
    </Row>
  );
};

export default Filters;
