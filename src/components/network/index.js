import React, { useEffect, useLayoutEffect } from "react";
import * as PIXI from "pixi.js";
import { extent, scaleLinear } from "d3";

import { useSharedCanvas } from "../../SharedCanvas.context";

const Network = ({ data }) => {
  const { stage } = useSharedCanvas();
  const container = new PIXI.Container();

  useEffect(() => {
    stage.addChild(container);
  }, []);

  useEffect(() => {
    const { vectors } = data;
    console.log(extent(vectors, d => d.vector[0]));
    const x = scaleLinear()
      .domain(extent(vectors, d => d.vector[0]))
      .range([0, 1]);

    const y = scaleLinear()
      .domain(extent(vectors, d => d.vector[1]))
      .range([0, 1]);

    const r = scaleLinear()
      .domain(extent(vectors, d => d.paper.citations))
      .range([2, 30]);

    vectors.forEach(p => {
      const g = new PIXI.Graphics();
      g.beginFill(0x000000);
      g.drawCircle(
        x(p.vector[0]) * window.innerWidth,
        y(p.vector[1]) * window.innerHeight,
        r(p.paper.citations)
      );
      g.alpha = 0.3;
      g.endFill();
      container.addChild(g);
    });
  }, [stage, data]);
  return null;
};

export default Network;
