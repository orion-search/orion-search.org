/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { Fragment } from "react";
import { useSpring, animated } from "react-spring";
import { useHistory } from "react-router-dom";

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
import { accessors, fadeIn, formatPercentage, urls } from "../../utils";
import { useOrionData } from "../../OrionData.context";
import { HUD } from "../../components/shared/renderer";
import { SmallButton } from "../../components/shared/button";
import { layout } from "../../visualizations/DiversityIndex/geometry";

const DiversityIndex = ({ data }) => {
  const canvasHUDRef = useRef(null);

  const [groupingAccessor, setGroupingAccessor] = useState(
    accessors.names.topic
  );
  const [xAccessor] = useState(accessors.names.diversity);
  const [yAccessor] = useState(accessors.names.femaleShare);
  const [year, setYear] = useState(2019);
  const [tooltip, setTooltip] = useState(null);
  const {
    stage: {
      views: { diversity },
    },
  } = useOrionData();
  const [categories, setCategories] = useState(diversity.viz.categories());
  const history = useHistory();

  // console.log(categories);

  const handleEvent = ({ type, data }, e) => {
    switch (type) {
      case "visitCluster":
        console.log(type, data, e);
        history.push(urls.explore, {
          filters: {
            [groupingAccessor]: [data],
          },
        });
        break;
      default:
        break;
    }
  };

  // set on hover callback (for tooltips)
  diversity.viz.onHover(({ data, coords }) => {
    console.log("Hovered", data, coords);
    if (data !== tooltip?.data) {
      if (!data) {
        setTooltip(null);
      } else {
        setTooltip({ data, coords });
      }
    }
  });

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
              {/* <div>
                μ={(0.5).toFixed(2)} / σ={(0.5).toFixed(2)} / Ν=
                {~~(0.5 * 1300)}
              </div> */}
              <SmallButton
                data-filter-link={category}
                onClick={(e) =>
                  handleEvent({
                    type: "visitCluster",
                    data: e.target.dataset.filterLink,
                  })
                }
              >
                Explore Cluster in 3D
              </SmallButton>
              {/* <button>Explore Cluster in 3D</button> */}
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
      {tooltip && <Tooltip data={tooltip.data} coords={tooltip.coords} />}
    </Fragment>
  );
};

const Tooltip = ({ data, coords }) => {
  const Wrapper = styled(animated.div)`
    pointer-events: none;
    background-color: rgba(0, 0, 0, 0.6);
    position: absolute;
    top: ${coords.y - 20}px;
    left: ${coords.x + (coords.x > window.innerWidth / 2 ? -100 : 10)}px;
    padding: ${(props) => `${props.theme.spacing.small}`};
  `;

  const wrapperAnimation = useSpring(fadeIn);

  return (
    <Wrapper style={wrapperAnimation}>
      <div>Country: {data.country}</div>
      <div>Topic: {data.topic}</div>
      <div>Revealed Comparative Advantage: {data.rca.toFixed(2)}</div>
      <div>Female Share of Research: {formatPercentage(data.femaleShare)}</div>
      <div>Year: {data.year}</div>
    </Wrapper>
  );
};

export default DiversityIndex;
