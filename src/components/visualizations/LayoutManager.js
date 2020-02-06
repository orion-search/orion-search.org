// A layout manager that initializes force layout web workers, runs them
// and communicates their position.

// import { extent } from "d3";
import ForceLayout from "../../force-layout-links";
import { scaleLinear, max } from "d3";
import { BehaviorSubject } from "rxjs";
import { takeWhile } from "rxjs/operators";

// country, topic, output, topics
export function OutputNetworkLayoutManager({
  country = "United Kingdom",
  output,
  topics
}) {
  let data, nodes, scales, links, forceLayout;

  // our global scale remains consistent between countries
  scales = {
    r: scaleLinear()
      .domain([0, max(output, d => d.total_citations)])
      .range([1, 20])
  };

  const country$ = new BehaviorSubject(country);
  country$.pipe(takeWhile((value, index) => value !== null || index === 0));

  country$.subscribe(
    value => {
      data = output.filter(d => d.country === value);

      // construct graph
      nodes = topics.map(t => {
        const value = data.find(d => d.topic === t.id)
          ? data.find(d => d.topic === t.id).total_citations
          : 1;
        return {
          id: t.id,
          name: t.name,
          level: +t.level,
          value,
          r: scales.r(value)
        };
      });

      links = [];
      topics.forEach(t => {
        // if parent exists in nodes
        if (nodes.find(n => n.id === t.parent)) {
          links.push({
            source: t.id,
            child: t.id,
            target: t.parent,
            parent: t.parent
          });
        }
      });

      forceLayout && forceLayout.terminate();

      forceLayout = ForceLayout({
        nodes,
        links,
        construct: false,
        width: window.innerWidth,
        height: window.innerHeight,
        minWeight: 0.9
      });
    },
    undefined,
    () => console.log("completed; changed back to null")
  );

  function layout() {
    return {
      // nodes,
      // links
    };
  }

  layout.forceLayout = function() {
    return forceLayout;
  };

  layout.nodes = function() {
    return nodes;
  };

  layout.links = function() {
    return links;
  };

  layout.country = function(c) {
    country$.next(c);
    return layout;
  };

  return layout;
}

// function HierarchicalLayoutManager(props) {}

export default OutputNetworkLayoutManager;
