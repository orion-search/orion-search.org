/** @jsx jsx */
import { jsx } from "@emotion/core";

import DiversityIndex from "../../layouts/DiversityIndex";
import { useOrionData } from "../../OrionData.context";

const Diversity = () => {
  const { diversity } = useOrionData();

  return <DiversityIndex data={diversity} />;
};

export default Diversity;
