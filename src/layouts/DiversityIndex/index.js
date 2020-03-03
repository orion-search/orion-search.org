import React, {
  useRef,
  useDebugValue,
  useEffect,
  useState,
  useLayoutEffect,
  useCallback
} from "react";
import { scaleLinear, scaleOrdinal, extent } from "d3";
// import { useOrionData } from "../../OrionData.context";

import Filters from "./Filters";
import DiversityIndexVisualization from "../../visualizations/DiversityIndex";

const DiversityIndex = ({ data }) => {
  const canvasRef = useRef(null);
  const viz = useRef(null);
  const canvasWidthRef = useRef(null);

  const [groupingAccessor, setGroupingAccessor] = useState("topic");
  const [xAccessor, setXAccessor] = useState("diversity");
  const [yAccessor, setYAccessor] = useState("female_share");
  const [year, setYear] = useState(2019);

  const layout = {
    margins: {
      top: 40,
      bottom: 200,
      perGroup: 100
    },
    labels: {
      width: 100
    },
    pointSegment: {
      widthRatio: 0.8,
      height: 50 // perGroup / 2
    }
  };

  const generateScales = useCallback(() => {
    console.log("grouping accessor", groupingAccessor);
    const groups = [...new Set(data.map(d => d[groupingAccessor]))];
    return {
      x: scaleLinear()
        .domain(extent(data, d => d[xAccessor]))
        .range([0, layout.pointSegment.widthRatio * canvasWidthRef.current]),
      y: scaleLinear()
        .domain([0, 1])
        .range([layout.pointSegment.height, 0]),
      category: scaleOrdinal(
        groups,
        groups.map((g, i) => i * layout.margins.perGroup)
      ),
      filterFunc: d => +d["year"] === year,
      groupFunc: d => d[groupingAccessor],
      xFunc: d => +d[xAccessor],
      yFunc: d => +d[yAccessor]
    };
  }, [data, xAccessor, yAccessor, layout, groupingAccessor, year]);

  useDebugValue(canvasRef);
  useLayoutEffect(() => {
    console.log("LAYOUT EFFECT");
    const {
      width: canvasWidth
      // height: canvasHeight
    } = canvasRef.current.getBoundingClientRect();

    canvasWidthRef.current = canvasWidth;

    canvasRef.current.style.height = `${window.innerHeight -
      canvasRef.current.offsetTop}px`;

    viz.current = new DiversityIndexVisualization({
      canvas: canvasRef.current
    });
  }, []);

  useEffect(() => {
    console.log("re-drawing");
    if (!viz.current) return;
    // scales.current = generateScales();
    viz.current.setScales(generateScales());
    viz.current.setData(data);
    viz.current.setLayout(layout);
    viz.current.draw();
  });

  return (
    <>
      <Filters
        onChangeGrouping={e => setGroupingAccessor(e.target.value)}
        onChangeYear={e => setYear(+e.target.value)}
        year={year}
        groupingAccessor={groupingAccessor}
      />
      <>
        <canvas ref={canvasRef} />
      </>
    </>
  );
};

export default DiversityIndex;
