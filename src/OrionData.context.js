import React, { useRef, useState, useContext, createContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { accessors } from "../src/utils";

import LoadingBar from "./components/shared/loading-bar";
import { SEED_DATA } from "./queries";
import cachedData from "./data/data.json";

const OrionDataContext = createContext({});

const FetchOnline = ({ children }) => {
  const data = useRef();
  const [ready, setReady] = useState(false);
  console.log(accessors);

  useQuery(SEED_DATA, {
    onError: (e) => {
      throw e;
    },
    onCompleted: ({
      byCountry,
      byTopic,
      byYear,
      topics,
      diversity,
      vectors,
    }) => {
      data.current = {
        diversity,
        papers: {
          byCountry,
          byTopic,
          byYear,
          vectors,
        },
        topics,
        vectors,
      };
      setReady(true);
    },
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
  const { byCountry, byTopic, byYear } = cachedData.data;
  data.current = cachedData.data;
  data.current.papers = {
    byCountry,
    byTopic,
    byYear,
  };
  delete data.current.byCountry;
  delete data.current.byTopic;
  delete data.current.byYear;

  return (
    <LoadingOrChildren ready={true} data={data.current}>
      {children}
    </LoadingOrChildren>
  );
};

export const OrionDataProvider = ({ children }) => {
  return (
    <>
      {process.env.NODE_ENV === "development" && (
        // <FetchOnline>{children}</FetchOnline>
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
