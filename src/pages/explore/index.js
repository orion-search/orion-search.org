import React from "react";

import { PageLayout } from "../../components/shared/layout";
import LatentSpace from "../../layouts/LatentSpace";
import { useOrionData } from "../../OrionData.context";

const Explore = () => {
  const { papers, vectors } = useOrionData();

  return (
    <PageLayout>{<LatentSpace data={vectors} papers={papers} />}</PageLayout>
  );
};

export default Explore;
