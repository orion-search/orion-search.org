/** @jsx jsx */
import React, { useState, useRef, useEffect } from "react";
import { css, jsx } from "@emotion/core";
import { useOrionData } from "../../OrionData.context";

import { Row } from "../../components/layout";
import Dropdown from "../../components/dropdown";
import DiversityIndexVisualization from "../../components/visualizations/DiversityIndex";
import Diversity from "../diversity";

const VIEWS = ["topics", "countries"];
const VIEW_BY_TOPIC = 0;
const VIEW_BY_COUNTRY = 1;

// contains all the filters
const ControlPanel = ({ views, currentView, onChangeView = () => {} }) => {
  const Legend = null;

  return (
    <Row
      css={css`
        width: fit-content;
      `}
    >
      Explore diversity for{" "}
      <Dropdown
        values={views}
        selected={views[currentView]}
        onChange={onChangeView}
      />
      {/* <Legend /> */}
    </Row>
  );
};

const DiversityIndex = ({ topics }) => {
  const currentView = useState(VIEW_BY_TOPIC);
  const canvasRef = useRef(null);
  const viz = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const dpr = window.devicePixelRatio || 1;

    const viewportHeight = window.innerHeight - canvasRef.current.offsetTop;

    // canvasRef.current.height = window.innerHeight - canvasRef.current.offsetTop;
    canvasRef.current.style.height = `${window.innerHeight -
      canvasRef.current.offsetTop}px`;

    const rect = canvasRef.current.getBoundingClientRect();

    canvasRef.current.height = rect.height * dpr;
    canvasRef.current.width = rect.width * dpr;

    // const ctx = canvasRef.current.getContext("2d");

    // viz.current = DiversityIndexVisualization({
    //   ctx
    // });
    // viz.current.draw();
    console.log("hello");
    viz.current = new DiversityIndexVisualization({
      canvas: canvasRef.current
    });
    viz.current.draw();
  }, [
    canvasRef
    //size
  ]);

  console.log(useOrionData());

  return (
    <>
      <ControlPanel views={VIEWS} currentView={currentView} />
      <canvas ref={canvasRef} />
    </>
  );
};

export default DiversityIndex;
