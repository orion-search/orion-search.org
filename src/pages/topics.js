import React from "react";

import { PageLayout } from "../components/layout";
import Breadcrumbs from "../components/breadcrumbs";
import { LinkButton } from "../components/button";

const Topics = () => {
  return (
    <PageLayout>
      <Breadcrumbs values={["Explore", "Topics"]} />

      <LinkButton to={"/"}>Home</LinkButton>
    </PageLayout>
  );
};

export default Topics;
