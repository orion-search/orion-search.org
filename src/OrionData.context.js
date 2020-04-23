/**
 * Everything that happens before the app kicks off.
 */
import React, {
  useRef,
  useState,
  useContext,
  useLayoutEffect,
  createContext,
} from "react";
import { useQuery } from "@apollo/react-hooks";
import { AbsoluteCanvas, initApp } from "./components/shared/renderer";

import { accessors } from "../src/utils";
import LoadingBar from "./components/shared/loading-bar";
import { SEED_DATA } from "./queries";
import cachedData from "./data/data.json";
import { ParticleContainerLatentSpace } from "./visualizations/LatentSpace";
import { DiversityIndex } from "./visualizations/DiversityIndex";

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
  const canvasRef = useRef(null);
  const [providerData, setProviderData] = useState(null);
  // const [providerData, setProviderData] = useState(seedData)

  useLayoutEffect(() => {
    if (!ready) return;
    console.info("Mounting App");
    const { controls, raycaster, renderer, render, views } = initApp({
      canvas: canvasRef.current,
    });

    // initial render of visualizations
    views.particles.viz = ParticleContainerLatentSpace({
      camera: views.particles.camera,
      controls,
      layout: {
        nodes: data.vectors.map((item) => {
          const [x, y, z] = accessors.types.vector3d(item);
          const id = accessors.types.id(item);
          return {
            x: x * 1000,
            y: y * 1000,
            z: z * 1000,
            id,
          };
        }),
      },
      raycaster,
      renderer,
      scene: views.particles.scene,
      selectionCallback: () => {},
    });

    views.diversity.viz = DiversityIndex({
      camera: views.diversity.camera,
      data: data.diversity,
      // dimensions: add defaults
      drawSecondCanvas: false,
      renderer,
      scene: views.diversity.scene,
    });

    setProviderData({
      ...data,
      stage: { controls, raycaster, renderer, render, views },
    });
  }, [canvasRef, ready, data]);

  return (
    <OrionDataContext.Provider value={providerData}>
      {!ready && !providerData && <LoadingBar />}
      {ready && providerData && children}
      <AbsoluteCanvas ref={canvasRef} />
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
