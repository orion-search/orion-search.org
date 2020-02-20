/** @jsx jsx */
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Query } from "@apollo/react-components";
import { css, jsx } from "@emotion/core";
// import { groupBy } from "lodash-es";

import { PageLayout } from "../components/layout";
// import Timeline from "../components/visualizations/timeline";
// import Histogram from "../components/visualizations/histogram";

import Dropdown from "../components/dropdown";
import List from "../components/list";
// import Header from "../components/header";
import {
  Title,
  Subheader,
  Header,
  Row,
  Column,
  Flex
} from "../components/layout";
// import { COUNTRY_OUTPUT_TOPIC } from "../queries/profile";
import { useOrionData } from "../OrionData.context";
import { DIVERSITY_BY_COUNTRY } from "../queries";
import Scatterplot from "../components/visualizations/Scatterplot";

const Profile = () => {
  const countries = useOrionData().papers.byCountry.map(p => p.country);
  const [country, setCountry] = useState("United States");
  const [year, setYear] = useState("2019");
  // const [topics, setTopics] = useState([]);

  let { error, data } = useQuery(DIVERSITY_BY_COUNTRY, {
    variables: { country, year }
  });

  return (
    <PageLayout>
      <Row
        css={css`
          width: fit-content;
          align-items: center;
        `}
      >
        <Title>{`Country /`} </Title>
        <Dropdown
          values={countries}
          selected={country}
          onChange={e => setCountry(e.target.value)}
        />
      </Row>
      <Flex justifyContent={"space-between"}>
        <Column width={0.4}>
          <Row>
            <Header>Research Profile</Header>
          </Row>
          <Row>
            <div>
              {country} produced <strong>xxx</strong> papers in{" "}
              <Dropdown
                values={["2019", "2018", "2017", "2016"]}
                selected={year}
                onChange={e => setYear(e.target.value)}
              />
            </div>
          </Row>
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Non enim
            harum iure, labore ut molestiae, cumque sed voluptatem culpa
            consequuntur natus! Delectus deleniti provident consectetur.
          </div>
          <Row></Row>
          <div>
            <Header>Top Research Areas by Output</Header>
            {data && (
              <List
                values={data.view_diversity_by_country
                  .map(
                    t =>
                      `${t.topic} (${Math.floor(Math.random() * 1000)} papers)`
                  )
                  .slice(0, 10)}
              />
            )}
          </div>
          <div>
            <Header>Related Countries by Research Profile</Header>
            <List
              values={"Lorem ipsum dolor sit amet consectetur".split(" ")}
            />
          </div>
        </Column>
        {/* <Row>
      </Row> */}
        {/* <Timeline>
        {data && <Histogram data={data.view_country_output_topic} />}
      </Timeline> */}
        <Column width={1 / 2}>
          {data && (
            <Scatterplot
              data={data.view_diversity_by_country}
              y={d => d.female_share}
              x={d => d.diversity}
              nodeFunc={d => d.topic}
            />
          )}
        </Column>
      </Flex>
      {/* {!loading && <List title={"Most Popular Topics"} values={topics} />} */}
    </PageLayout>
  );
};

export default Profile;
