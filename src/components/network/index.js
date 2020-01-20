import React, { useEffect, useLayoutEffect } from "react";
import * as PIXI from "pixi.js";

import { useSharedCanvas } from "../../SharedCanvas.context";

const Network = ({ data }) => {
  const { stage } = useSharedCanvas();
  const container = new PIXI.Container();

  useEffect(() => {
    stage.addChild(container);
  }, []);

  useEffect(() => {
    console.log("hello", container.children);

    const { vectors } = data;
    vectors.forEach(p => {
      const g = new PIXI.Graphics();
      g.beginFill(0xff00ff);
      g.drawCircle(
        p.vector[0] * window.innerWidth,
        p.vector[1] * window.innerHeight,
        (p.paper.citations + 1) * 2
      );
      g.endFill();
      container.addChild(g);
    });
  }, [stage, data]);
  return null;
};

export default Network;
