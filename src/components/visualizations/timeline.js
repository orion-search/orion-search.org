/** @jsx jsx */
import { useEffect, useRef, cloneElement } from "react";
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

const Timeline = ({ children }) => {
  const [containerRef, chartSize] = useDimensions();
  const brushRef = useRef(null);
  const svgRef = useRef(null);
  const chartRef = useRef(null);

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
  }, [chartSize, brush]);

  return (
    <BrushContainer ref={containerRef}>
      <p>
        {chartSize.width}/{chartSize.height}
      </p>
      {chartSize.width && (
        <svg
          ref={svgRef}
          height={chartSize.height}
          width={chartSize.width}
          css={css`
            rect.overlay {
              // stroke: white;
            }
          `}
        >
          <g ref={chartRef}>
            {children &&
              svgRef &&
              chartRef &&
              cloneElement(children, {
                svg: svgRef.current,
                g: chartRef.current,
                width: chartSize.width,
                height: chartSize.height
              })}
          </g>
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
