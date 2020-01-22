import React, {
  useLayoutEffect,
  useRef,
  useState,
  useContext,
  createContext
} from "react";

import { AbsoluteCanvas, initAppFromCanvasElm } from "./components/renderer";
import LoadingBar from "./components/loading-bar";
const SharedCanvasContext = createContext({});

export const SharedCanvasProvider = ({ children }) => {
  const [render, setRender] = useState(false);

  const canvasRef = useRef(null);
  const pixi = useRef(null);
  const appRef = useRef(null);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    if (!pixi.current) {
      const { app, enablePanZoom, stage } = initAppFromCanvasElm({
        canvasRef: canvasRef.current,
        appConfig: {
          antialias: true,
          autoStart: true,
          backgroundColor: 0x000000,
          resolution: window.devicePixelRatio || 1,
          transparent: true
        }
      });

      appRef.current = app;

      pixi.current = {
        app,
        enablePanZoom,
        stage
      };
    }
    if (pixi.current) {
      // const { app } = pixi.current;

      // window.addEventListener("resize", () => {
      //   container.resize(window.innerWidth, window.innerHeight);
      //   container.dirty = true;
      // });

      // viewport.visible = false; // let <EyeballViz /> decide whether it needs to be rendered or not
      // container.visible = false;

      pixi.current = {
        ...pixi.current
        // container
      };
      setRender(true);
    }
  }, []);

  return (
    <SharedCanvasContext.Provider value={pixi.current}>
      <AbsoluteCanvas ref={canvasRef} />
      {/* render only after the canvas initializes */}
      {!render && <LoadingBar />}
      {render && children}
    </SharedCanvasContext.Provider>
  );
};

export const SharedCanvasConsumer = SharedCanvasContext.Consumer;

/**
 * @returns {SharedEyeballCanvasContextType}
 */
export const useSharedCanvas = () => useContext(SharedCanvasContext);
