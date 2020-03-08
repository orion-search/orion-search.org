import React, { useRef, useState, useContext, createContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { csv } from "d3";
import { accessors } from "../src/utils";

import LoadingBar from "./components/shared/loading-bar";
import { SEED_DATA } from "./queries";
import papersByCountry from "./data/old/paper_country.csv";
import papersByTopic from "./data/old/paper_topics.csv";
import topTopics from "./data/old/top_topics.csv";

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

const FetchOffline = ({ children }) => {
  const data = useRef();
  const [ready, setReady] = useState(false);

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
    // csv(documentVectors, d => ({
    //   vector_3d: d.vector_3d.split("|").map(v => +v),
    //   vector_2d: d.vector_2d.split("|").map(v => +v),
    //   id: +d.id
    // }))
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
