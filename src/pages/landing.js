import React from "react";

import { PageLayout, Row, Column } from "../components/layout";
import { Title } from "../components/layout";

import { LinkButton } from "../components/button";

const Landing = () => {
  return (
    <PageLayout>
      <Row>
        <Title>Orion Search Engine</Title>
      </Row>
      <Row>
        <Column alignSelf={"normal"} width={1 / 2}>
          <p>
            Orion is an odiven-source tool to monitor and measure progress in
            science. Orion depends on a flexible data collection, enrichment,
            and analysis system that enables users to create and explore
            research databases.
          </p>
          <p>
            Orion also has a semantic search engine that enables researchers to
            retrieve relevant cuts of the rich and content-specific database
            they created. Users can query Orion with anything between one or two
            words (for example, gene editing) and a blogpost they read online.
          </p>
          <p>
            Orion uses state-of-the-art machine learning methods to find a
            numerical representation of the users’ query and search for its
            closest matches in a high-dimensional, academic publication space.
          </p>
          <p>
            This flexibility can be powerful; researchers can query Orion with
            an abstract of their previous work, policymakers could use a news
            article or the executive the summary of a white paper.
          </p>
        </Column>
      </Row>
      <Row width={2 / 3}>
        <LinkButton to={"/profile/country"}>Explore Country</LinkButton>
        <LinkButton to={"/explore"}>Explore all Papers</LinkButton>
        <LinkButton inactive to={"/profile/topic"}>
          Explore Topic
        </LinkButton>

        <LinkButton inactive to={"/search"}>
          Search by Abstract
        </LinkButton>
      </Row>
    </PageLayout>
  );
};

export default Landing;
