/** @jsx jsx */
// import React from "react";
import { css, jsx } from "@emotion/core";

import { PageLayout } from "../../components/shared/layout";
import DiversityIndex from "../../layouts/DiversityIndex";
import { useOrionData } from "../../OrionData.context";

const Diversity = () => {
  const diversity = useOrionData().diversity;

  return (
    <PageLayout
      css={css`
        padding-bottom: 0;
      `}
    >
      <DiversityIndex data={diversity} />
    </PageLayout>
  );
};

export default Diversity;
