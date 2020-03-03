import React, { useRef, useLayoutEffect, useEffect, useState } from "react";
import { scaleLinear, scaleOrdinal, extent } from "d3";
import { findDOMNode } from "react-dom";

// import { useOrionData } from "../../OrionData.context";

import Filters from "./Filters";
import Categories from "./Categories";
import DiversityIndexVisualization from "../../visualizations/DiversityIndex";
import { Flex } from "../../components/shared/layout";

const DiversityIndex = ({ data }) => {
  const [groupingAccessor, setGroupingAccessor] = useState("topic");
  const [xAccessor, setXAccessor] = useState("diversity");
  const [yAccessor, setYAccessor] = useState("female_share");
  const [year, setYear] = useState(2019);

  return (
    <>
      <Filters
        onChangeGrouping={grouping => setGroupingAccessor(grouping)}
        onChangeYear={year => setYear(year)}
      />
      <>
        {/* {true && } */}
        <LayoutManager
          data={data}
          groupingAccessor={groupingAccessor}
          xAccessor={xAccessor}
          yAccessor={yAccessor}
          year={year}
        ></LayoutManager>
      </>
    </>
  );
};

const LayoutManager = ({
  children,
  data,
  xAccessor,
  yAccessor,
  groupingAccessor,
  year
}) => {
  const [renderCategories, setRenderCategories] = useState(false);

  const canvasRef = useRef(null);
  const containerRef = useRef();
  const categoriesRef = useRef();
  const scrollYRef = useRef(0);
  const [deltaY, setDeltaY] = useState(0);

  const scales = useRef(null);
  const viz = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const {
      width: canvasWidth
      // height: canvasHeight
    } = canvasRef.current.getBoundingClientRect();

    canvasRef.current.style.height = `${window.innerHeight -
      canvasRef.current.offsetTop}px`;

    setRenderCategories(true);
  }, [canvasRef]);

  useLayoutEffect(() => {
    console.log("HELLOOO");
    if (
      !containerRef.current &&
      !scrollYRef.current &&
      !categoriesRef.current &&
      !viz.current
    )
      return;
    containerRef.current.addEventListener("wheel", e => {
      e.preventDefault();
      setDeltaY(e.deltaY);
      viz.current.scroll(e.deltaY);
    });
  }, [containerRef, scrollYRef, categoriesRef]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const {
      width: canvasWidth
      // height: canvasHeight
    } = canvasRef.current.getBoundingClientRect();

    canvasRef.current.style.height = `${window.innerHeight -
      canvasRef.current.offsetTop}px`;

    const groups = [...new Set(data.map(d => d[groupingAccessor]))];

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

    scales.current = {
      x: scaleLinear()
        .domain(extent(data, d => d[xAccessor]))
        .range([0, layout.pointSegment.widthRatio * canvasWidth]),
      y: scaleLinear()
        .domain([0, 1])
        .range([layout.pointSegment.height, 0]),
      category: scaleOrdinal(
        groups,
        groups.map((g, i) => i * layout.margins.perGroup)
      )
    };

    viz.current = new DiversityIndexVisualization({
      canvas: canvasRef.current,
      data,
      filterFunc: d => +d["year"] === year,
      groupBy: d => d[groupingAccessor],
      layout,
      scales: scales.current,
      xFunc: d => +d[xAccessor],
      yFunc: d => +d[yAccessor]
    });
    viz.current.draw();
  }, [canvasRef, data, groupingAccessor, xAccessor, yAccessor, year]);

  return (
    <Flex
      css={`
        // position: relative;
      `}
      ref={containerRef}
    >
      {/* {renderCategories && ( */}
      {scales.current && (
        <Categories
          deltaY={deltaY}
          ref={categoriesRef}
          categoryScale={scales.current.category}
        />
      )}
      {/* )} */}
      <canvas ref={canvasRef} />
    </Flex>
  );
};

export default DiversityIndex;
