/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { Fragment } from "react";
import { animated } from "react-spring";
import { useHistory } from "react-router-dom";

import React, { useRef, useEffect, useState, useLayoutEffect } from "react"; // eslint-disable-line no-unused-vars

import Filters, { filterOptions } from "./Filters";
import { XAxis, YAxis } from "./Axes";
import { accessors, formatPercentage, urls } from "../../utils";
import { useOrionData } from "../../OrionData.context";
import { HUD } from "../../components/shared/renderer";
import { SmallButton } from "../../components/shared/button";
import { layout } from "../../visualizations/DiversityIndex/geometry";

const DiversityIndex = ({ data }) => {
  const canvasHUDRef = useRef(null);

  const [groupingAccessor, setGroupingAccessor] = useState(
    // accessors.names.topic
    filterOptions.groupings[0]
  );
  const [xAccessor, setXAccessor] = useState(filterOptions.x[0]);
  const [yAccessor, setYAccessor] = useState(filterOptions.y[0]);
  const [year, setYear] = useState(filterOptions.time[0]);
  const [tooltip, setTooltip] = useState(null);
  const {
    stage: {
      views: { diversity },
    },
  } = useOrionData();
  const [categories, setCategories] = useState(diversity.viz.categories());
  const [currentScales, setCurrentScales] = useState(diversity.viz.getScales());

  const history = useHistory();

  const handleEvent = ({ type, data }, e) => {
    switch (type) {
      case "visitCluster":
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
    if (data !== tooltip?.data) {
      if (!data) {
        setTooltip(null);
      } else {
        setTooltip({ data, coords });
      }
    }
  });

  useLayoutEffect(() => {
    diversity.viz.HUD(canvasHUDRef.current);
    diversity.viz.show();

    // add HUD canvas
    return function cleanup() {
      diversity.viz.hide();
      // return canvas to original size
    };
  }, [diversity.viz]);

  useEffect(() => {
    diversity.viz.x((d) => accessors.types[xAccessor](d));
    setCurrentScales(diversity.viz.getScales());
  }, [diversity.viz, xAccessor]);

  useEffect(() => {
    diversity.viz.y((d) => accessors.types[yAccessor](d));
    setCurrentScales(diversity.viz.getScales());
  }, [diversity.viz, yAccessor]);

  useEffect(() => {
    diversity.viz.group((d) => accessors.types[groupingAccessor](d));
    setCategories(diversity.viz.categories());
  }, [diversity.viz, groupingAccessor]);

  useEffect(() => {
    // our filter is hardcoded /
    // @todo make n-dimensional filtering
    diversity.viz.filter((d) => accessors.types.year(d) === year);
    setCategories(diversity.viz.categories());
  }, [diversity.viz, year]);

  useEffect(() => {
    data.length && diversity.viz.setData(data);
  }, [diversity.viz, data]);

  return (
    <Fragment>
      <Filters
        groupingAccessor={groupingAccessor}
        onChangeGrouping={(e) => setGroupingAccessor(e)}
        onChangeX={(e, i) => setXAccessor(filterOptions.x[i])}
        onChangeY={(e, i) => setYAccessor(filterOptions.y[i])}
        onChangeYear={(e) => setYear(+e)}
        x={accessors.ui[xAccessor]}
        y={accessors.ui[yAccessor]}
        year={year}
      />
      <HUD ref={canvasHUDRef}>
        {categories.map(({ category, y: offsetTop }, i) => {
          return (
            <div
              key={`category-label-${category}`}
              css={(theme) => css`
                position: absolute;
                top: ${offsetTop - layout.pointSegment.height / 2}px;

                left: ${theme.layout.page.side};
                color: white;
                padding-bottom: ${layout.margins.bottom}px;
              `}
            >
              {/* <div
                css={css`
                  position: relative;
                  border-bottom: 1px solid white;
                  opacity: 0.5;
                  top: ${layout.pointSegment.height / 2}px;
                  width: 77vw;
                  left: 17vw;
                `}
              ></div> */}
              <div
                css={css`
                  max-width: 10vw;
                `}
              >
                {category}
              </div>
              {/* <div>
                μ={(0.5).toFixed(2)} / σ={(0.5).toFixed(2)} / Ν=
                {~~(0.5 * 1300)}
              </div> */}
              <SmallButton
                data-filter-link={category}
                nofill
                onClick={(e) =>
                  handleEvent({
                    type: "visitCluster",
                    data: e.target.dataset.filterLink,
                  })
                }
              >
                Explore Cluster in 3D
              </SmallButton>
            </div>
          );
        })}
      </HUD>
      {tooltip && <Tooltip data={tooltip.data} coords={tooltip.coords} />}
      <XAxis
        min={currentScales.x.domain()[0]}
        max={currentScales.x.domain()[1]}
        metric={accessors.ui[xAccessor]}
      />
      <YAxis
        min={currentScales.y.domain()[0]}
        max={currentScales.y.domain()[1]}
        colorScale={currentScales.color}
        metric={accessors.ui[yAccessor]}
      />
    </Fragment>
  );
};

const Tooltip = ({ data, coords }) => {
  const Wrapper = styled(animated.div)`
    pointer-events: none;
    background-color: rgba(0, 0, 0, 0.75);
    position: absolute;
    top: ${coords.y + (coords.y > window.innerHeight / 2 ? -100 : 10)}px;
    left: ${coords.x + (coords.x > window.innerWidth / 2 ? -100 : 10)}px;
    padding: ${(props) => `${props.theme.spacing.small}`};
    border: 1px solid ${(props) => props.theme.colors.orange};
    border-radius: 4px;
  `;

  // const wrapperAnimation = useSpring(fadeIn);

  return (
    <Wrapper
    // style={wrapperAnimation}
    >
      <div>Country: {data.country}</div>
      <div>Topic: {data.topic}</div>
      <div>Revealed Comparative Advantage: {data.rca.toFixed(2)}</div>
      <div>Female Share of Research: {formatPercentage(data.femaleShare)}</div>
      <div>Year: {data.year}</div>
    </Wrapper>
  );
};

export default DiversityIndex;
