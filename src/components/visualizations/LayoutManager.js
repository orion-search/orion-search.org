// A layout manager that initializes force layout web workers, runs them
// and communicates their position.

// import { extent } from "d3";
import ForceLayout from "../../force-layout-links";
import ForceLayoutLinks from "../../force-layout-links";

class Layout {
  constructor() {}
}

function LayoutManager() {
  let data;
  let nodes;
  let topics;

  function layout() {}

  layout.data = function(d) {
    if (!arguments.length) return data;
    data = d;
    return layout;
  };

  layout.nodes = function() {
    return nodes;
  };

  layout.size = function() {};

  layout.r = function() {};

  return layout;
}

// country, topic, output, topics
export function OutputNetworkLayoutManager({ output, topics }) {
  let country = "United Kingdom";
  let data = output.filter(d => d.country === country);

  // construct graph
  let nodes = topics.map(t => ({
    id: t.id,
    name: t.name,
    level: +t.level,
    value: data.find(d => d.topic === t.id)
      ? data.find(d => d.topic === t.id).total_citations
      : 1
  }));

  // let links = topics.map(t => ({
  //   source: t.id,
  //   target: t.parent
  // }));
  let links = [];
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
  console.log(nodes, links);

  let forceLayout = ForceLayout({
    nodes,
    links,
    construct: false,
    width: window.innerWidth,
    height: window.innerHeight,
    minWeight: 0.9
  });
  forceLayout.tick(1000);
  // forceLayout.start();

  function layout() {
    return {
      nodes
    };
  }

  layout.forceLayout = function() {
    return forceLayout;
  };

  layout.nodes = function() {
    // console.log("HELLOO", nodes);
    return nodes;
  };

  // layout.data = function() {};

  // layout.country = function() {};

  return layout;
}

function HierarchicalLayoutManager(props) {}

export default OutputNetworkLayoutManager;
