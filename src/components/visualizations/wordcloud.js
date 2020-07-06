/** @jsx jsx */

import { scaleLog, scaleLinear, extent } from "d3";
import { css, jsx } from "@emotion/core";

import { Flex } from "../shared/layout";
import theme from "../../styles/";

export const WordCloud = ({ histogram, numEntries = 10 }) => {
  const data = histogram.slice(0, numEntries);
  const color = scaleLinear()
    .domain(extent(data, (d) => d[1]))
    .range([theme.colors.orange, theme.colors.red]);
  const size = scaleLog()
    .domain(extent(data, (d) => d[1]))
    .range([14, 32]);

  return (
    <Flex
      css={(props) => css`
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: baseline;
        pointer-events: none;
        margin: ${props.spacing.large} 0;
        max-width: 500px;
      `}
    >
      {data.map(([topic, count], i) => {
        return (
          <div
            key={`top-topics-${i}-${count}`}
            style={{ fontSize: `${size(count)}px`, color: `${color(count)}` }}
          >
            {topic}
          </div>
        );
      })}
    </Flex>
  );
};
