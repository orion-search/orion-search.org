import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";

import Network from "../components/network";
import { ARTICLE_VECTORS } from "../queries";
import { PageLayout } from "../components/layout";
import { SharedCanvasProvider } from "../SharedCanvas.context";

const Explore = () => {
  const { data } = useQuery(ARTICLE_VECTORS);
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <PageLayout>
      <SharedCanvasProvider>
        {data && <Network data={data} />}
      </SharedCanvasProvider>
    </PageLayout>
  );
};

export default Explore;
