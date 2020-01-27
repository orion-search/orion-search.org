import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { groupBy } from "lodash-es";

import { PageLayout } from "../components/layout";
import Breadcrumbs from "../components/breadcrumbs";
import Timeline from "../components/visualizations/timeline";
import Histogram from "../components/visualizations/histogram";
import Dropdown from "../components/dropdown";
import List from "../components/list";
import Header from "../components/header";
import { COUNTRY_OUTPUT_TOPIC } from "../queries/profile";

const countries = [
  "Argentina",
  "Brazil",
  "Mexico",
  "China",
  "Germany",
  "United Kingdom",
  "United States",
  "Greece",
  "Norway",
  "Sweden",
  "Finland",
  "Denmark",
  "France",
  "Italy",
  "Canada"
].sort();

const Profile = () => {
  const [topics, setTopics] = useState([]);
  const [country, setCountry] = useState(countries[0]);

  let { error, loading, data } = useQuery(COUNTRY_OUTPUT_TOPIC, {
    variables: { country }
  });

  useEffect(() => {
    if (!data) return;
    console.log(country, data);

    // output by topic
    const output = groupBy(data.view_country_output_topic, d => d.topic_name);

    // most popular topics
    const topics = Object.keys(output)
      .sort((k1, k2) => output[k2].length - output[k1].length)
      .slice(0, 20);

    setTopics(topics);
  }, [error, data]);

  return (
    <PageLayout>
      <Breadcrumbs values={["Explore Entity", "Country", `${country}`]} />
      <Header title={`Diversity of Research / Entity Profile`} />
      <Header title={`${country}`} />
      <Timeline>
        {data && <Histogram data={data.view_country_output_topic} />}
      </Timeline>
      <Dropdown values={countries} onChange={e => setCountry(e.target.value)} />
      <List
        title={"Top Authors"}
        values={["Zac Ioannidis", "Clement Rames", "Nick Kyrgios"]}
      />
      {!loading && <List title={"Most Popular Topics"} values={topics} />}
    </PageLayout>
  );
};

export default Profile;
