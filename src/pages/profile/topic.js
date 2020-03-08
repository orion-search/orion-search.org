/** @jsx jsx */
import React, { useState } from "react"; // eslint-disable-line no-unused-vars
import { useQuery } from "@apollo/react-hooks";
import { Query } from "@apollo/react-components";
import { css, jsx } from "@emotion/core";

import {
  Title,
  Header,
  Row,
  Column,
  Flex
} from "../../components/shared/layout";
import Dropdown from "../../components/shared/dropdown";
import { DIVERSITY_BY_TOPIC, TOP_TOPICS } from "../../queries";
import Scatterplot from "../../components/visualizations/scatterplot";

const TopicProfile = () => {
  const [topic, setTopic] = useState("Bioinformatics");
  const [year, setYear] = useState("2019");
  // const [topics, setTopics] = useState([]);

  let { data } = useQuery(DIVERSITY_BY_TOPIC, {
    variables: { topic, year }
  });

  return (
    <>
      <Row
        css={css`
          width: fit-content;
          align-items: center;
        `}
      >
        <Title>{`Topic /`} </Title>
        <Query query={TOP_TOPICS}>
          {({ loading, error, data }) => {
            if (loading) return null;
            if (error) return `Error! ${error}`;
            console.log(data);

            return (
              <Dropdown
                values={data.view_top_topics.map(d => d.topic)}
                selected={topic}
                onChange={e => setTopic(e.target.value)}
              />
            );
          }}
        </Query>
      </Row>
      <Flex justifyContent={"space-between"}>
        <Column width={0.4}>
          <Row>
            <Header>Research Profile</Header>
          </Row>
          <Row>
            <div>
              <Dropdown
                values={[2019, 2018, 2017, 2016]}
                selected={year}
                onChange={e => setYear(e.target.value)}
              />
            </div>
          </Row>
        </Column>
        <Column width={1 / 2}>
          <Header>Diversity of research</Header>

          {data && (
            <Scatterplot
              data={data.view_diversity_by_country}
              y={d => d.female_share}
              x={d => d.diversity}
              nodeFunc={d => d.country}
            />
          )}
        </Column>
      </Flex>
    </>
  );
};

export default TopicProfile;
