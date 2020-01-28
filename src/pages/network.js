import React from "react";

import { PageLayout } from "../components/layout";
import Map from "../components/collaborations/map";
// import { SharedCanvasProvider } from "../SharedCanvas.context";

const Network = () => {
  // const { data } = useQuery(ARTICLE_VECTORS);
  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  return (
    <PageLayout>
      {/* <SharedCanvasProvider> */}
      <Map />
      {/* </SharedCanvasProvider> */}
    </PageLayout>
  );
};

export default Network;
