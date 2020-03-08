import React, { useRef, useState, useContext, createContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { csv } from "d3";
import { accessors } from "../src/utils";

import LoadingBar from "./components/shared/loading-bar";
import { SEED_DATA } from "./queries";
import csvPapersByCountry from "./data/viz_paper_country.csv";
import csvPapersByTopic from "./data/viz_paper_topics.csv";
import csvPapersByYear from "./data/viz_paper_year.csv";
import csvDiversity from "./data/viz_metrics_by_country.csv";
import csvVectors from "./data/doc_vectors.csv";

const OrionDataContext = createContext({});

const FetchOnline = ({ children }) => {
  const data = useRef();
  const [ready, setReady] = useState(false);
  console.log(accessors);

  useQuery(SEED_DATA, {
    onError: e => {
      throw e;
    },
    onCompleted: ({
      byCountry,
      byTopic,
      byYear,
      topics,
      diversity,
      vectors
    }) => {
      data.current = {
        diversity,
        papers: {
          byCountry,
          byTopic,
          byYear,
          vectors
        },
        topics,
        vectors
      };
      setReady(true);
    }
  });

  return (
    <LoadingOrChildren ready={ready} data={data.current}>
      {children}
    </LoadingOrChildren>
  );
};

const LoadingOrChildren = ({ ready, children, data }) => {
  return (
    <OrionDataContext.Provider value={data}>
      {!ready && <LoadingBar />}
      {ready && children}
    </OrionDataContext.Provider>
  );
};

// eslint-disable-next-line
const FetchOffline = ({ children }) => {
  const data = useRef();
  const [ready, setReady] = useState(false);

  Promise.all([
    csv(csvPapersByCountry),
    csv(csvPapersByTopic),
    csv(csvPapersByYear),
    csv(csvDiversity),
    csv(csvVectors)
  ]).then(([byCountry, byTopic, byYear, diversity, vectors], error) => {
    if (error) throw error;
    data.current = {
      papers: {
        byCountry,
        byTopic,
        byYear
      },
      diversity,
      topics: byTopic.map(t => ({
        [accessors.names.topic]: accessors.types.topic(t)
      })),
      vectors
    };
    setReady(true);
  });

  return (
    <LoadingOrChildren ready={ready} data={data.current}>
      {children}
    </LoadingOrChildren>
  );
};

export const OrionDataProvider = ({ children }) => {
  return (
    <>
      {process.env.NODE_ENV === "development" && (
        <FetchOnline>{children}</FetchOnline>
      )}
      {process.env.NODE_ENV === "production" && (
        <FetchOnline>{children}</FetchOnline>
      )}
    </>
  );
};

export const OrionDataConsumer = OrionDataContext.Consumer;

export const useOrionData = () => useContext(OrionDataContext);
