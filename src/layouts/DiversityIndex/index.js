/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import React, { // eslint-disable-line no-unused-vars
  useRef,
  useDebugValue,
  useEffect,
  useState,
  useLayoutEffect,
  useCallback
} from "react";
import { scaleLinear, scaleOrdinal, extent } from "d3";
// import { useOrionData } from "../../OrionData.context";

import Filters from "./Filters";
import DiversityIndexVisualization from "../../visualizations/DiversityIndex";
import { accessors } from "../../utils";

const DiversityIndex = ({ data }) => {
  const canvasRef = useRef(null);
  const canvasHUDRef = useRef(null);
  const canvasContainerRef = useRef(null);

  const viz = useRef(null);
  const canvasWidthRef = useRef(null);

  const [groupingAccessor, setGroupingAccessor] = useState(
    accessors.names.topic
  );
  const [xAccessor] = useState(accessors.names.diversity);
  const [yAccessor] = useState(accessors.names.femaleShare);
  const [year, setYear] = useState(2019);

  const layout = {
    margins: {
      top: 40,
      bottom: 200,
      perGroup: 100
    },
    labels: {
      width: 100
    },
    pointSegment: {
      widthRatio: 0.8,
      height: 50 // perGroup / 2
    }
  };

  const generateScales = useCallback(() => {
    console.log("grouping accessor", groupingAccessor);
    const groups = [...new Set(data.map(d => d[groupingAccessor]))];
    return {
      x: scaleLinear()
        .domain(extent(data, d => d[xAccessor]))
        .range([0, layout.pointSegment.widthRatio * canvasWidthRef.current]),
      y: scaleLinear()
        .domain([0, 1])
        .range([layout.pointSegment.height, 0]),
      category: scaleOrdinal(
        groups,
        groups.map((g, i) => i * layout.margins.perGroup)
      ),
      filterFunc: d => accessors.types.year(d) === year,
      groupFunc: d => d[groupingAccessor],
      xFunc: d => +d[xAccessor],
      yFunc: d => +d[yAccessor]
    };
  }, [data, xAccessor, yAccessor, layout, groupingAccessor, year]);

  useDebugValue(canvasRef);
  useLayoutEffect(() => {
    console.log("LAYOUT EFFECT");
    const {
      width: canvasWidth,
      y: canvasY
      // height: canvasHeight
    } = canvasRef.current.getBoundingClientRect();
    console.log(canvasWidth);

    canvasWidthRef.current = canvasWidth;

    canvasContainerRef.current.style.height = `${window.innerHeight -
      canvasY}px`;
    // canvasRef.current.style.height = `${window.innerHeight -
    // canvasRef.current.offsetTop}px`;

    viz.current = new DiversityIndexVisualization({
      canvas: canvasRef.current,
      hudCanvas: canvasHUDRef.current
    });
  }, []);

  useEffect(() => {
    console.log("re-drawing");
    if (!viz.current) return;

    viz.current.setScales(generateScales());
    viz.current.setLayout(layout);
    viz.current.setData(data);
  });

  return (
    <>
      <Filters
        onChangeGrouping={e => setGroupingAccessor(e.target.value)}
        onChangeYear={e => setYear(+e.target.value)}
        year={year}
        groupingAccessor={groupingAccessor}
      />
      <div
        css={css`
          display: flex;
          position: relative;

          mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 1) 6%,
            rgba(0, 0, 0, 1) 94%,
            rgba(0, 0, 0, 0) 100%
          );
        `}
        ref={canvasContainerRef}
      >
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
        <canvas
          css={css`
            position: absolute;
            pointer-events: none;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            &:focus {
              outline: none;
            }
          `}
          ref={canvasHUDRef}
        />
      </div>
    </>
  );
};

export default DiversityIndex;
