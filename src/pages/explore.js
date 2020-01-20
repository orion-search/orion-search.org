import React, { useRef, useEffect, useLayoutEffect } from "react";
import { css } from "@emotion/core";

import { AbsoluteCanvas, initAppFromCanvasElm } from "../components/renderer";
import Network from "../components/network";
import { SharedCanvasProvider } from "../SharedCanvas.context";

const Explore = ({}) => {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const { app, stage } = initAppFromCanvasElm({
      canvasRef: canvasRef.current
    });
    stageRef.current = stage;
  }, []);

  return (
    <main
      css={css`
        width: 100vw;
        height: 100vh;
        position: relative;
        display: flex;
        flex-direction: column;
        overflow: hidden; /* @TODO figure out why this is necessary to prevent scroll (vh units??) */

        & > * {
          animation: 2s fadeIn;
        }
      `}
    >
      <SharedCanvasProvider>
        <Network stage={stageRef.current} />
      </SharedCanvasProvider>
    </main>
  );
};

// Explore.propTypes = {};

export default Explore;
