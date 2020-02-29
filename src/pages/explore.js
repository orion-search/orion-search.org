import React, { useEffect, useState } from "react";
// import { useQuery } from "@apollo/react-hooks";
import { csv } from "d3";

import documentVectors from "../data/doc_vectors.csv";
// import Tree from "../components/tree";

// import Network from "../components/network";
// import { ARTICLE_VECTORS } from "../queries";
import { PageLayout } from "../components/shared/layout";
import LatentSpace from "../layouts/LatentSpace";
import { useOrionData } from "../OrionData.context";
// import { SharedCanvasProvider } from "../SharedCanvas.context";

const Explore = () => {
  // const { data, error } = useQuery(ARTICLE_VECTORS);
  // useEffect(() => {
  //   console.log(data, error);
  // }, [data, error]);
  const [data, setData] = useState(null);
  const papers = useOrionData().papers;

  useEffect(() => {
    Promise.all([
      csv(documentVectors, d => ({
        vector_3d: d.vector_3d.split("|").map(v => +v),
        vector_2d: d.vector_2d.split("|").map(v => +v),
        id: +d.id
      }))
    ]).then(([vectors], error) => {
      setData(vectors);
    });
  }, []);

  return (
    <PageLayout>
      {/* <SharedCanvasProvider>
        {data && <Network data={data} />}
      </SharedCanvasProvider> */}
      {data && <LatentSpace data={data} papers={papers} />}
      {/* <Tree /> */}
    </PageLayout>
  );
};

export default Explore;
