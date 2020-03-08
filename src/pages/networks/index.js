/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { PageLayout } from "../../components/shared/layout";
import CollaborationNetworks from "../../layouts/CollaborationNetworks";
import { useOrionData } from "../../OrionData.context";

const Networks = () => {
  const data = useOrionData().networks;
  return (
    <PageLayout
      css={css`
        padding-bottom: 0;
      `}
    >
      <CollaborationNetworks data={data} />
    </PageLayout>
  );
};

export default Networks;
