import React from "react";

import { PageLayout } from "../components/layout";
import Breadcrumbs from "../components/breadcrumbs";
import Hierarchical from "../components/visualizations/hierarchical";

const Output = () => {
  return (
    <PageLayout>
      <Breadcrumbs values={["Explore", "Country", "Output"]} />
      <Hierarchical />
    </PageLayout>
  );
};

export default Output;
