import { useEffect } from "react";
import { groupBy } from "lodash-es";

import {
  scaleTime,
  extent,
  line,
  select,
  curveCatmullRomOpen,
  scaleLinear
} from "d3";

const Histogram = ({
  svg,
  g,
  data,
  xFunc = d => new Date(d.date),
  yFunc = d => d["total_citations"],
  width,
  height,
  stack = null
}) => {
  console.log(svg, data);

  useEffect(() => {
    const timeGrouped = groupBy(
      data.sort((d1, d2) => new Date(d1.date) - new Date(d2.date)),
      xFunc
    );
    const summedData = Object.keys(timeGrouped)
      .map(date => {
        return timeGrouped[date].reduce((acc, d) => ({
          date: d.date,
          total_citations: acc["total_citations"] + d["total_citations"]
        }));
      })
      .sort((d1, d2) => new Date(d1.date) - new Date(d2.date));
    console.log(summedData);

    const y = scaleLinear()
      .domain(extent(summedData, yFunc))
      .range([height, 0]);

    const time = scaleTime()
      .domain(extent(summedData, xFunc))
      .range([0, width]);
    // .nice();

    const area = line()
      .curve(curveCatmullRomOpen)
      .x(d => {
        return time(xFunc(d));
      })
      .y(d => y(yFunc(d)));

    select(g)
      .append("path")
      .datum(summedData)
      .style("stroke", "#fff")
      .style("fill", "none")
      .attr("d", area);

    return function cleanup() {
      select(g).html("");
    };
  }, [data, width, height]);
  return null;
};

export default Histogram;
