/** @jsx jsx */
import React, { useEffect, useRef } from "react";
import { brushX } from "d3-brush";
import { select, event } from "d3-selection";
import useDimensions from "react-use-dimensions";
import styled from "@emotion/styled";
import { css, jsx } from "@emotion/core";

const BrushContainer = styled("div")`
  width: 100%;
  height: 100px;
`;

const Timeline = () => {
  const [chartRef, chartSize] = useDimensions();
  const brushRef = useRef(null);

  function onBrushEnd(e) {
    console.log("hello", e, event.selection);
  }

  function filter() {}

  const brush = brushX()
    .extent([
      [0, 0],
      [chartSize.width, chartSize.height]
    ])
    .on("end", onBrushEnd);

  useEffect(() => {
    // if (!chartSize.width) return;
    select(brushRef.current).call(brush);
  }, [chartSize]);

  return (
    <BrushContainer ref={chartRef}>
      <h1>
        {chartSize.width}/{chartSize.height}
      </h1>
      {chartSize.width && (
        <svg
          height={chartSize.height}
          width={chartSize.width}
          css={css`
            rect.overlay {
              fill: white;
            }
          `}
        >
          <g ref={brushRef} />
        </svg>
      )}
    </BrushContainer>
  );
};

// Timeline.propTypes = {
//   groupby: PropType.string
// };

export default Timeline;
