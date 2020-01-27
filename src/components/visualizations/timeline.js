/** @jsx jsx */
import React, { useEffect, useRef } from "react";
import { brushX } from "d3-brush";
import { select, event } from "d3-selection";
import useDimensions from "react-use-dimensions";
import styled from "@emotion/styled";
import { css, jsx } from "@emotion/core";

const BrushContainer = styled("div")`
  display: flex;

  width: 100%;
  height: 100px;

  margin-bottom: ${props => props.theme.spacing.large};
`;

const Timeline = () => {
  const [chartRef, chartSize] = useDimensions();
  const brushRef = useRef(null);

  function onBrushEnd(e) {
    console.log("hello", e, event.selection);
  }

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
      <p>
        {chartSize.width}/{chartSize.height}
      </p>
      {chartSize.width && (
        <svg
          height={chartSize.height}
          width={chartSize.width}
          css={css`
            rect.overlay {
              stroke: white;
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
