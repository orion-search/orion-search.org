/** @jsx jsx */
import React, { useState, useRef, useEffect } from "react";
import { css, jsx } from "@emotion/core";
// import { useOrionData } from "../../OrionData.context";

import { Row } from "../../components/shared/layout";
import Dropdown from "../../components/shared/dropdown";
import DiversityIndexVisualization from "../../visualizations/DiversityIndex";
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
      <Dropdown
        values={[2016, 2017, 2018, 2019]}
        selected={2019}
        // onChange={onChangeView}
      />
      {/* <Legend /> */}
    </Row>
  );
};

const DiversityIndex = ({ data }) => {
  const currentView = useState(VIEW_BY_TOPIC);
  const canvasRef = useRef(null);
  const viz = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    canvasRef.current.style.height = `${window.innerHeight -
      canvasRef.current.offsetTop}px`;

    viz.current = new DiversityIndexVisualization({
      canvas: canvasRef.current,
      data
    });
    viz.current.draw();
  }, [
    canvasRef,
    data
    //size
  ]);

  return (
    <>
      <ControlPanel views={VIEWS} currentView={currentView} />
      <canvas ref={canvasRef} />
    </>
  );
};

export default DiversityIndex;
