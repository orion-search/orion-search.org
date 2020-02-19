import React, { useEffect, useRef } from "react";
import { scaleLinear, extent, select, axisBottom, axisLeft } from "d3";
import styled from "@emotion/styled";
import useDimensions from "react-use-dimensions";

const Wrapper = styled("div")`
  display: flex;
  width: 100%;
  height: 500px;

  margin: ${props => props.theme.spacing.large} 0;
`;

const Scatterplot = ({ data, x, y }) => {
  const [containerRef, chartSize] = useDimensions();

  const chartRef = useRef(null);
  const gRef = useRef(null);
  const axisLeftRef = useRef(null);
  const axisBottomRef = useRef(null);

  const scales = useRef({
    x: null,
    r: null,
    y: null
  });

  const margins = {
    side: 40,
    top: 20
  };

  useEffect(() => {
    if (!data) return;
    if (!gRef.current || !chartRef.current) return;
    if (!chartSize.width || !chartSize.height) return;

    scales.current.x = scaleLinear()
      .domain(extent(data, x))
      .range([margins.side, chartSize.width - margins.side]);

    scales.current.y = scaleLinear()
      // .domain(extent(data, y))
      .domain([0, 1])
      .range([chartSize.height - margins.top, margins.top]);

    select(axisLeftRef.current)
      .call(axisLeft(scales.current.y))
      .attr("transform", `translate(${margins.side}, 0)`);
    select(axisBottomRef.current)
      .call(axisBottom(scales.current.x))
      .attr("transform", `translate(0, ${chartSize.height - margins.top})`);

    const svg = chartRef.current;

    const t = select(svg)
      .transition()
      .duration(750);

    select(gRef.current)
      .selectAll("circle")
      .data(data)
      .join(
        enter =>
          enter
            .append("circle")
            .attr("fill", "white")
            .attr("cx", chartSize.width / 2)
            .attr("cy", chartSize.height / 2)
            .attr("r", 0)
            .call(enter =>
              enter
                .transition(t)
                .attr("cx", d => scales.current.x(x(d)))
                .attr("cy", d => scales.current.y(y(d)))
                .attr("r", d => 2.5 * Math.random() + 2.5)
            ),

        update =>
          update.call(update =>
            update
              .transition(t)
              .attr("cx", d => scales.current.x(x(d)))
              .attr("cy", d => scales.current.y(y(d)))
              .attr("r", d => 2.5 * Math.random() + 2.5)
          ),
        exit =>
          exit.call(exit =>
            exit
              .transition(t)
              .attr("r", 0)
              .remove()
          )
      );

    // return function cleanup() {
    //   svg.removeChild(g);
    // };
  }, [data, x, y, chartSize, scales, margins]);

  return (
    <Wrapper ref={containerRef}>
      <svg ref={chartRef} height={chartSize.height} width={chartSize.width}>
        <g ref={axisLeftRef} />
        <g ref={gRef} />
        <g ref={axisBottomRef} />
      </svg>
    </Wrapper>
  );
};

export default Scatterplot;
