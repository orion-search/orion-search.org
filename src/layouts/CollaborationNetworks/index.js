/** @jsx jsx */
import { useRef, useEffect, useLayoutEffect } from "react";
import { css, jsx } from "@emotion/core";

import CollaborationNetwork from "../../visualizations/CollaborationNetwork";

const Networks = ({ data, metadata }) => {
  const canvasRef = useRef(null);
  const viz = useRef(null);

  useLayoutEffect(() => {
    console.log("LAYOUT EFFECT");
    const {
      width: canvasWidth,
      y: canvasY
      // height: canvasHeight
    } = canvasRef.current.getBoundingClientRect();
    console.log(canvasWidth);

    canvasRef.current.style.height = `${window.innerHeight - canvasY}px`;
    // canvasRef.current.style.height = `${window.innerHeight -
    // canvasRef.current.offsetTop}px`;

    viz.current = new CollaborationNetwork({
      canvas: canvasRef.current
    });
  }, []);

  useEffect(() => {
    if (!viz.current) return;

    viz.current.setData({
      links: data,
      nodes: metadata
    });
  });

  console.log(data);
  return (
    <canvas
      css={css`
        width: 100%;
        height: 100%;
        &:focus {
          outline: none;
        }
      `}
      ref={canvasRef}
    />
  );
};

export default Networks;
