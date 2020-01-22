import React, { useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import { TOPIC_HIERARCHY } from "../queries";

const Topics = () => {
  const { error, loading, data } = useQuery(TOPIC_HIERARCHY);

  useEffect(() => {
    // console.log("topics", data);
  }, [error, loading, data]);
  return null;
};

export default Topics;

function generateTopicNetwork(hierarchy) {
  return hierarchy.flatMap(function(d) {
    if (d.parent === null) return [];
    if (d.child === null) return [];
    return d.child.map(c => ({ source: d.topic, target: c })) || [];
  });
}
