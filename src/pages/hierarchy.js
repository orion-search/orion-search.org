import React, { useEffect, useRef } from "react";
import { useQuery } from "@apollo/react-hooks";
import { stratify, pack, select } from "d3";

import { PageLayout } from "../components/shared/layout";

import { FIELDS_OF_STUDY } from "../queries/topics";

const p = data =>
  pack()
    .size([1500, 1500])
    .padding(3)(data);

function UUID() {
  function s(n) {
    return h((Math.random() * (1 << (n << 2))) ^ Date.now()).slice(-n);
  }
  function h(n) {
    return (n | 0).toString(16);
  }
  return [
    s(4) + s(4),
    s(4),
    "4" + s(3), // UUID version 4
    h(8 | (Math.random() * 4)) + s(3), // {8|9|A|B}xxx
    // s(4) + s(4) + s(4),
    Date.now()
      .toString(16)
      .slice(-10) + s(2) // Use timestamp to avoid collisions
  ].join("-");
}

const Hierarchy = () => {
  let { error, data } = useQuery(FIELDS_OF_STUDY);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data || !chartRef.current) return;

    // add root
    data.hierarchy.push({
      name: "root",
      level: 0,
      parent: null
    });

    [
      ...new Set(data.hierarchy.filter(d => d.level === 1).map(d => d.parent))
    ].forEach(topic => {
      data.hierarchy.push({
        name: topic,
        parent: "root"
      });
    });

    const root = stratify()
      .id(d => d.name)
      .parentId(d => d.parent)(data.hierarchy);
    // console.log(
    //   root.sum(d => d.children.length).sort((a, b) => b.value - a.value)
    // );
    // console.log(root);
    root.count();

    // console.log(p(stratifiedData));
    const node = select(chartRef.current)
      .append("g")
      .attr("pointer-events", "all")
      .selectAll("g")
      .data(p(root).descendants())
      .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    node
      .append("circle")
      .attr("r", d => d.r)
      .attr("stroke", d => (d.children ? "#bbb" : "none"))
      .attr("fill", d => (d.children ? "black" : "rgba(255, 0, 0, .3"));

    const leaf = node.filter(d => !d.children);
    node
      .filter(d => d.children)
      .on("click", function(d) {
        console.log(d.id);
      });

    leaf.select("circle").attr("id", d => (d.leafUid = UUID("leaf")).id);

    leaf
      .append("clipPath")
      .attr("id", d => (d.clipUid = UUID("clip")).id)
      .append("use")
      .attr("xlink:href", d => d.leafUid.href);

    leaf
      .append("text")
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("dy", () => Math.random() * 20 - 5)
      .attr("font-size", 6)
      .attr("clip-path", d => d.clipUid)
      .selectAll("tspan")
      .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .join("tspan")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
      .text(d => d);

    node.append("title").text(
      d =>
        `${d
          .ancestors()
          .map(d => d.data.name)
          .reverse()
          .join("/")}`
    );

    console.log(data);
  }, [error, data, chartRef]);

  return (
    <PageLayout>
      <svg ref={chartRef} width={1500} height={1500} />
    </PageLayout>
  );
};

export default Hierarchy;
