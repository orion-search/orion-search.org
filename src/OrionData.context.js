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
import csvCountryCollaboration from "./data/country_collaboration.csv";
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
    csv(csvPapersByCountry, d => ({
      [accessors.names.country]: accessors.types.country(d),
      [accessors.names.count]: accessors.types.count(d),
      [accessors.names.ids]: d["paper_ids"].replace(/{|}/g, " ").split(",")
    })),
    csv(csvPapersByTopic, d => ({
      [accessors.names.topic]: d["name"],
      [accessors.names.count]: accessors.types.count(d),
      [accessors.names.ids]: d["paper_ids"].replace(/{|}/g, " ").split(",")
    })),
    csv(csvPapersByYear, d => ({
      [accessors.names.year]: accessors.types.year(d),
      [accessors.names.count]: accessors.types.count(d),
      [accessors.names.ids]: d["paper_ids"].replace(/{|}/g, " ").split(",")
    })),
    csv(csvDiversity, d => ({
      [accessors.names.year]: accessors.types.year(d),
      [accessors.names.country]: accessors.types.country(d),
      [accessors.names.diversity]: +d["shannon_diversity"],
      [accessors.names.rca]: +d["rca_sum"],
      [accessors.names.femaleShare]: +d["female_share"],
      [accessors.names.topic]: d["name"]
    })),
    csv(csvCountryCollaboration, d => ({
      [accessors.names.source]: d["country_a"],
      [accessors.names.target]: d["country_b"],
      [accessors.names.weight]: accessors.types.weight(d),
      [accessors.names.year]: accessors.types.year(d)
    })),
    csv(csvVectors, d => ({
      [accessors.names.vector3d]: d["vector_3d"]
        .replace(/{|}/g, " ")
        .split(",")
        .map(d => +d),
      [accessors.names.id]: accessors.types.id(d)
    }))
  ]).then(
    ([byCountry, byTopic, byYear, diversity, networks, vectors], error) => {
      if (error) throw error;
      data.current = {
        papers: {
          byCountry,
          byTopic,
          byYear
        },
        diversity,
        networks,
        topics: byTopic.map(t => ({
          [accessors.names.topic]: accessors.types.topic(t)
        })),
        vectors
      };
      setReady(true);
    }
  );

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
        <FetchOffline>{children}</FetchOffline>
      )}
      {process.env.NODE_ENV === "production" && (
        <FetchOnline>{children}</FetchOnline>
      )}
    </>
  );
};

export const OrionDataConsumer = OrionDataContext.Consumer;

export const useOrionData = () => useContext(OrionDataContext);
