import React from "react";

import LatentSpace from "../../layouts/LatentSpace";
import { useOrionData } from "../../OrionData.context";

const Explore = () => {
  const { papers, vectors } = useOrionData();

  return <LatentSpace data={vectors} papers={papers} />;
};

export default Explore;
