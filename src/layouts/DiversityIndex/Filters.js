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
      css={css`
        width: fit-content;
      `}
    >
      Explore diversity for{" "}
      <Dropdown
        values={groupings}
        selected={groupingAccessor}
        onChange={onChangeGrouping}
      />
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
