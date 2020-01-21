import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";

import Network from "../components/network";
import { ARTICLE_VECTORS } from "../queries";
import { FullPageLayout } from "../components/layout";
import { SharedCanvasProvider } from "../SharedCanvas.context";

const Explore = () => {
  const { data } = useQuery(ARTICLE_VECTORS);
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <FullPageLayout>
      <SharedCanvasProvider>
        {data && <Network data={data} />}
      </SharedCanvasProvider>
    </FullPageLayout>
  );
};

export default Explore;
