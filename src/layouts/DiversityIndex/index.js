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
import { HUD } from "../../components/shared/renderer";
import { layout } from "../../visualizations/DiversityIndex/geometry";

const DiversityIndex = ({ data }) => {
  const canvasHUDRef = useRef(null);

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
  const [categories, setCategories] = useState(diversity.viz.categories());

  // console.log(categories);

  useLayoutEffect(() => {
    console.log("LAYOUT EFFECT");

    diversity.viz.HUD(canvasHUDRef.current);
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
    // console.log("setting categories");
    setCategories(diversity.viz.categories());
  }, [diversity.viz, groupingAccessor]);

  useEffect(() => {
    // our filter is hardcoded /
    // @todo make n-dimensional filtering
    diversity.viz.filter((d) => accessors.types.year(d) === year);
    setCategories(diversity.viz.categories());
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
      {/* <div
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
      </div> */}
      <HUD ref={canvasHUDRef}>
        {categories.map(({ category, y: offsetTop }, i) => {
          return (
            <div
              key={`category-label-${category}`}
              css={css`
                position: absolute;
                top: ${// diversity.viz.scales.category(category)
                // offsetTop - layout.pointSegment.height / 2
                offsetTop - layout.pointSegment.height / 2}px;

                // layout.margins.top + i * (layout.margins.perGroup - 20)
                left: 3vw;
                color: white;
                padding-bottom: ${layout.margins.bottom}px;
              `}
            >
              <div
                css={css`
                  position: relative;
                  border-bottom: 1px solid white;
                  opacity: 0.5;
                  top: ${layout.pointSegment.height / 2}px;
                  width: 77vw;
                  left: 17vw;
                `}
              ></div>
              <div>{category}</div>
              <div>
                μ={Math.random().toFixed(2)} / σ={Math.random().toFixed(2)} / Ν=
                {~~(Math.random() * 1300)}
              </div>
              <button>Explore Cluster</button>
              {/* <p>Explore</p> */}
              {/* <LinkButton
                css={css`
                  margin: 0;
                `}
              >
                Explore cluster
              </LinkButton> */}
            </div>
          );
        })}
      </HUD>
    </Fragment>
  );
};

export default DiversityIndex;
