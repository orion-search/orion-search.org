import { useEffect } from "react";
import * as PIXI from "pixi.js";
import { extent, scaleLinear } from "d3";
import { largestDimension } from "../../utils";

import { useSharedCanvas } from "../../SharedCanvas.context";

const Network = ({ data }) => {
  const { stage, enablePanZoom } = useSharedCanvas();
  // const container = new PIXI.Container();

  useEffect(() => {
    // stage.addChild(container);
  }, []);

  useEffect(() => {
    const { vectors } = data;

    const x = scaleLinear()
      .domain(extent(vectors, d => d.vector_2d[0]))
      .range([0, 1]);

    const y = scaleLinear()
      .domain(extent(vectors, d => d.vector_2d[1]))
      .range([0, 1]);

    const r = scaleLinear()
      .domain(extent(vectors, d => d.paper.citations))
      .range([20, 100]);

    const SCALE_FACTOR = 8 * largestDimension();

    const viewport = enablePanZoom({
      x0: 0,
      x1: SCALE_FACTOR,
      y0: 0,
      y1: SCALE_FACTOR
    })
      .drag()
      .pinch()
      .wheel()
      .resumeInteractionListeners();

    vectors.forEach(p => {
      const g = new PIXI.Graphics();
      g.beginFill(0x000000);
      g.drawCircle(
        x(p.vector_2d[0]) * SCALE_FACTOR,
        y(p.vector_2d[1]) * SCALE_FACTOR,
        r(p.paper.citations)
      );
      g.alpha = 0.8;
      g.endFill();
      viewport.addChild(g);
    });

    return function cleanup() {
      viewport.destroy();
    };
  }, [stage, data, enablePanZoom]);
  return null;
};

export default Network;
