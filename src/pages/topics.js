import React from "react";

import { PageLayout } from "../components/layout";
import { LinkButton } from "../components/button";

const Topics = () => {
  return (
    <PageLayout>
      <div>
        <LinkButton to={"/"}>Home</LinkButton>
        <LinkButton to={"/"}>Search</LinkButton>
        <LinkButton to={"/"}>Buy Now</LinkButton>
      </div>
    </PageLayout>
  );
};

export default Topics;
