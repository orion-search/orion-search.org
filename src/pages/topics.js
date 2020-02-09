import React from "react";

import { PageLayout } from "../components/layout";
import Breadcrumbs from "../components/breadcrumbs";
import { LinkButton } from "../components/button";

const Topics = () => {
  return (
    <PageLayout>
      <Breadcrumbs values={["Explore", "Topics"]} />
      <div>
        <LinkButton to={"/"}>Home</LinkButton>
        <LinkButton to={"/"}>Search</LinkButton>
        <LinkButton to={"/"}>Buy Now</LinkButton>
      </div>
    </PageLayout>
  );
};

export default Topics;
