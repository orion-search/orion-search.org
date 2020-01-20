import React, { useEffect, useLayoutEffect } from "react";
import * as PIXI from "pixi.js";
import { useSharedCanvas } from "../../SharedCanvas.context";

const Network = () => {
  const { stage } = useSharedCanvas();
  useEffect(() => {
    const container = new PIXI.Container();
    stage.addChild(container);
    const g = new PIXI.Graphics();
    g.beginFill(0xff00ff);
    g.drawCircle(0, 20, 50);
    g.position.x = 400;
    g.endFill();
    g.zIndex = 1000;
    container.addChild(g);
    console.log("hello", container.children);
  }, [stage]);
  return null;
};

export default Network;
