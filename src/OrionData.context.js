import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  createContext
} from "react";
import { useQuery } from "@apollo/react-hooks";
import { csv } from "d3";

import LoadingBar from "./components/loading-bar";
import { SEED_PAPER_COUNTRY, SEED_PAPER_TOPICS } from "./queries";
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

  switch (process.env.NODE_ENV) {
    case "development":
      Promise.all([
        csv(papersByCountry, d => ({
          country: d.country,
          count: +d.count,
          ids: d.ids.split("|").map(i => +i)
        })),
        csv(papersByTopic),
        d => ({
          topic_id: d.id,
          name: d.name,
          level: +d.level,
          frequency: +d.frequency,
          ids: d.paper_ids.split("|").map(i => i)
        })
      ]).then(([byCountry, byTopic], error) => {
        data.current.papers = {
          byCountry,
          byTopic
        };
        setReady(true);
      });
      break;
    case "production":
      break;
    default:
      break;
  }

  // const {
  //   data: paperCountryData,
  //   error: paperCountryError,
  //   loading: paperCountryLoading
  // } = useQuery(SEED_PAPER_COUNTRY);

  // const {
  //   data: paperTopicData,
  //   error: paperTopicError,
  //   loading: paperTopicLoading
  // } = useQuery(SEED_PAPER_TOPICS);

  // useEffect(() => {
  //   if (process.env.NODE_ENV === "development") return;
  //   console.log(paperCountryData, paperTopicData);
  //   if (paperCountryData && paperTopicData) {
  //     data.current = {
  //       country: paperCountryData,
  //       topic: paperTopicData
  //     };
  //     setReady(true);
  //   }
  // }, [paperCountryData, paperTopicData, paperCountryError, paperTopicError]);

  return (
    <OrionDataContext.Provider value={data.current}>
      {!ready && <LoadingBar />}
      {ready && children}
    </OrionDataContext.Provider>
  );
};

export const OrionDataConsumer = OrionDataContext.Consumer;

export const useOrionData = () => useContext(OrionDataContext);
