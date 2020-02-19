import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { groupBy } from "lodash-es";

import { PageLayout } from "../components/layout";
import Timeline from "../components/visualizations/timeline";
import Histogram from "../components/visualizations/histogram";

import Dropdown from "../components/dropdown";
import List from "../components/list";
import Header from "../components/header";
import { COUNTRY_OUTPUT_TOPIC } from "../queries/profile";
import { useOrionData } from "../OrionData.context";
import { DIVERSITY_BY_COUNTRY } from "../queries";
import Scatterplot from "../components/visualizations/Scatterplot";

const Profile = () => {
  const countries = useOrionData().papers.byCountry.map(p => p.country);
  const [country, setCountry] = useState("United States");
  // const [topics, setTopics] = useState([]);

  let { error, loading, data } = useQuery(DIVERSITY_BY_COUNTRY, {
    variables: { country }
  });

  useEffect(() => {
    if (!data) return;
    console.log(data);
    //   // console.log(country, data);

    //   // output by topic
    //   // const output = groupBy(data.view_country_output_topic, d => d.topic_name);

    //   // most popular topics
    //   const topics = Object.keys(output)
    //     .sort((k1, k2) => output[k2].length - output[k1].length)
    //     .slice(0, 20);

    //   // setTopics(topics);
  }, [error, data]);

  return (
    <PageLayout>
      <Header title={`Country Research Profile`} />
      <Header title={`${country}`} />
      {/* <Timeline>
        {data && <Histogram data={data.view_country_output_topic} />}
      </Timeline> */}
      <Dropdown values={countries} onChange={e => setCountry(e.target.value)} />
      {data && (
        <Scatterplot
          data={data.view_diversity_by_country}
          y={d => d.female_share}
          x={d => d.diversity}
        />
      )}
      {/* {!loading && <List title={"Most Popular Topics"} values={topics} />} */}
    </PageLayout>
  );
};

export default Profile;
