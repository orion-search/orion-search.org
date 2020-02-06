import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";

import { PageLayout } from "../components/layout";
import Breadcrumbs from "../components/breadcrumbs";
import Hierarchical from "../components/visualizations/hierarchical";

import { OUTPUT_PER_COUNTRY } from "../queries/topics";

const Output = () => {
  // let { error, data } = useQuery(OUTPUT_PER_COUNTRY, {
  //   variables: {
  //     country: "United Kingdom"
  //   }
  // });

  // useEffect(() => {
  //   console.log(error);
  //   if (!data) return;
  //   console.log(data);
  // }, [error, data]);

  return (
    <PageLayout>
      <Breadcrumbs values={["Explore", "Country", "Output"]} />
      <Hierarchical />
    </PageLayout>
  );
};

export default Output;
