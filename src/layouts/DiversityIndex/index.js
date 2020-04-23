/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Fragment } from "react";

import React, { // eslint-disable-line no-unused-vars
  useRef,
  // useDebugValue,
  useEffect,
  useState,
  useLayoutEffect,
  // useCallback,
} from "react";
// import { scaleLinear, scaleOrdinal, extent, group } from "d3";

import Filters from "./Filters";
// import DiversityIndexVisualization from "../../visualizations/DiversityIndex";
import { accessors } from "../../utils";
import { useOrionData } from "../../OrionData.context";

const DiversityIndex = ({ data }) => {
  const canvasRef = useRef(null);
  const canvasHUDRef = useRef(null);
  const canvasContainerRef = useRef(null);

  // const viz = useRef(null);
  const canvasWidthRef = useRef(null);

  const [groupingAccessor, setGroupingAccessor] = useState(
    accessors.names.topic
  );
  const [xAccessor] = useState(accessors.names.diversity);
  const [yAccessor] = useState(accessors.names.femaleShare);
  const [year, setYear] = useState(2019);

  const {
    stage: {
      views: { diversity },
    },
  } = useOrionData();
  console.log(diversity);

  useLayoutEffect(() => {
    console.log("LAYOUT EFFECT");
    const {
      width: canvasWidth,
      y: canvasY,
    } = canvasRef.current.getBoundingClientRect();

    canvasWidthRef.current = canvasWidth;

    canvasContainerRef.current.style.height = `${
      window.innerHeight - canvasY
    }px`;

    diversity.viz.show();

    // viz.current = new DiversityIndexVisualization({
    //   canvas: canvasRef.current,
    //   hudCanvas: canvasHUDRef.current,
    // });

    // add HUD canvas
    return function cleanup() {
      diversity.viz.hide();
      // return canvas to original size
    };
  }, [diversity.viz]);

  useEffect(() => {
    diversity.viz.x((d) => accessors.types[xAccessor](d));
  }, [diversity.viz, xAccessor]);

  useEffect(() => {
    diversity.viz.y((d) => accessors.types[yAccessor](d));
  }, [diversity.viz, yAccessor]);

  useEffect(() => {
    diversity.viz.group((d) => accessors.types[groupingAccessor](d));
  }, [diversity.viz, groupingAccessor]);

  useEffect(() => {
    // our filter is hardcoded /
    // @todo make n-dimensional filtering
    // debugger;
    diversity.viz.filter((d) => accessors.types.year(d) === year);
  }, [diversity.viz, year]);

  useEffect(() => {
    console.log("calling .setData()");
    data.length && diversity.viz.setData(data);
  }, [diversity.viz, data]);

  // useEffect(() => {
  //   console.log("re-drawing");
  //   if (!viz.current) return;

  //   viz.current.setScales(generateScales());
  //   // viz.current.setLayout(layout);
  //   viz.current.setData(data);
  // });

  return (
    <Fragment>
      <Filters
        onChangeGrouping={(e) => setGroupingAccessor(e.target.value)}
        onChangeYear={(e) => setYear(+e.target.value)}
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
    </Fragment>
  );
};

export default DiversityIndex;
