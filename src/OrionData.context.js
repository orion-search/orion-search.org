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

const OrionDataContext = createContext({});

export const OrionDataProvider = ({ children }) => {
  const [ready, setReady] = useState(false);

  const data = useRef({
    papers: {
      byCountry: null,
      byTopic: null
    }
  });

  const { data: topics, loading } = useQuery(TOP_TOPICS);

  useEffect(() => {
    if (loading) return;

    data.current = {
      ...data.current,
      topics: topics.view_top_topics
    };
  }, [loading, topics]);

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
        }))
      ]).then(([byCountry, byTopic], error) => {
        data.current = {
          ...data.current,
          papers: {
            byCountry,
            byTopic
          }
        };
        // data.current.papers = {
        //   byCountry,
        //   byTopic
        // };
        // setReady(true);
      });
      break;
    default:
      break;
  }

  /**
   * @todo find a better way to merge useQuery and CSVs
   */
  useEffect(() => {
    if (data.current.topics && data.current.papers) {
      setReady(true);
    }
  });

  return (
    <OrionDataContext.Provider value={data.current}>
      {!ready && <LoadingBar />}
      {ready && children}
    </OrionDataContext.Provider>
  );
};

export const OrionDataConsumer = OrionDataContext.Consumer;

export const useOrionData = () => useContext(OrionDataContext);
