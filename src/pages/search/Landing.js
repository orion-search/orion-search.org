/** @jsx jsx */
// import React from "react";
import { css, jsx } from "@emotion/core";

import { Row } from "../../components/shared/layout";
import { Card } from "../../components/shared/card";

import svgFlexible from "../../assets/img/landing-flexible.svg";
import svgInformationRich from "../../assets/img/landing-information-rich.svg";
import svgProgress from "../../assets/img/landing-progress.svg";
import svgSearch from "../../assets/img/landing-search.svg";

const Landing = () => {
  return (
    // <Flex>
    <Row
      css={(theme) =>
        css`
          max-width: ${theme.breakpoints.width.max};
          margin-top: 50px;
          justify-content: space-around;
        `
      }
    >
      <Row>
        <h2>What is Orion Search?</h2>
      </Row>
      <Row
        css={css`
          justify-content: start;
          margin: 0;
          align-self: start;
        `}
      >
        <Card
          css={(theme) => css`
            max-width: 800px;
            text-align: left;
            align-items: start;
            margin-left: 0;
            margin-bottom: ${theme.spacing.huge};
          `}
          title={"Knowledge discovery and research measurement"}
          text={
            "Orion is a knowledge discovery and research measurement tool that enables users to visually explore the scientific landscape and interactively search for relevant publications."
          }
        />
      </Row>
      <Row />
      <Row />
      <Row />
      {/* <Row>
        <h2>Why Orion?</h2>
      </Row> */}
      <Card
        image={svgProgress}
        title={"Measure progress in science"}
        text={
          "Orion creates indicators showing dimensions of scientific progress, like research diversity."
        }
      />
      <Card
        image={svgSearch}
        title={"ML-powered search"}
        text={
          "Orion’s semantic search engine enables queries with anything from a keyword or phrase to entire paragraphs of text."
        }
      />
      <Card
        image={svgFlexible}
        title={"It's flexible"}
        text={
          "Orion indexes bioRxiv papers but it can be deployed for any field of study, journal or conference."
        }
      />
      <Card
        image={svgInformationRich}
        title={"Information-rich, domain-specific explorations"}
        text={
          "Orion combines data from a variety of sources and was designed for visual exploration and discovery."
        }
      />
    </Row>
    // </Flex>
  );
};

export default Landing;
