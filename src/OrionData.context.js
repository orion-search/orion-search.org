import React, {
  useRef,
  useState,
  useContext,
  createContext,
  useEffect
} from "react";
import { useQuery } from "@apollo/react-hooks";
import { csv } from "d3";

import LoadingBar from "./components/shared/loading-bar";
import { TOP_TOPICS } from "./queries";
import papersByCountry from "./data/paper_country.csv";
import papersByTopic from "./data/paper_topics.csv";
import topTopics from "./data/top_topics.csv";

const OrionDataContext = createContext({});

export const OrionDataProvider = ({ children }) => {
  const [ready, setReady] = useState(false);

  const data = useRef({
    papers: {
      byCountry: null,
      byTopic: null,
      topics: null
    }
  });

  // const { data: topics, loading } = useQuery(TOP_TOPICS);

  // useEffect(() => {
  //   if (loading) return;

  //   data.current = {
  //     ...data.current,
  //     papers: {
  //       ...data.current.papers
  //     },
  //     topics: topics.view_top_topics
  //   };
  //   console.log(data.current);
  // }, [loading, topics]);

  switch (process.env.NODE_ENV) {
    case "development":
    case "production":
      Promise.all([
        csv(papersByCountry, d => ({
          country: d.country,
          count: +d.count,
          ids: d.ids.split("|").map(i => +i)
        })),
        csv(papersByTopic, d => ({
          topic_id: d.id,
          name: d.name,
          level: +d.level,
          frequency: +d.frequency,
          ids: d.paper_ids.split("|").map(i => +i)
        })),
        csv(topTopics)
      ]).then(([byCountry, byTopic, topics], error) => {
        data.current = {
          papers: {
            byCountry,
            byTopic
          },
          topics
        };
        setReady(true);
      });
      break;
    default:
      break;
  }

  return (
    <OrionDataContext.Provider value={data.current}>
      {!ready && <LoadingBar />}
      {ready && children}
    </OrionDataContext.Provider>
  );
};

export const OrionDataConsumer = OrionDataContext.Consumer;

export const useOrionData = () => useContext(OrionDataContext);
