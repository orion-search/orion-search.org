/**
 * @file Instantiates a PIXI application with a set of
 * default renderer settings.
 */
import * as PIXI from "pixi.js";
import styled from "@emotion/styled";
import { SmartViewport } from "../../utils/camera";

export const AbsoluteCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -100;
`;

PIXI.utils.skipHello();

// used to persist eyeball stage
/**
 * @param {Object} config
 * @param {HTMLCanvasElement} config.canvasRef
 * @param {Object} config.appConfig PIXI Application options
 *
 * @returns {Object}
 */
export const initAppFromCanvasElm = ({ canvasRef, appConfig }) => {
  const app = new PIXI.Application({
    ...appConfig,
    view: canvasRef,
    width: canvasRef.getBoundingClientRect().width,
    height: canvasRef.getBoundingClientRect().height,
    resizeTo: canvasRef
  });

  const stage = app.stage;
  // stage.sortableChildren = true;
  // const HUD = stage.addChild(new PIXI.Container());
  // HUD.zIndex = 99999;

  return {
    app,
    enablePanZoom: extents => {
      const viewport = new SmartViewport({
        screenWidth: canvasRef.getBoundingClientRect().width,
        screenHeight: canvasRef.getBoundingClientRect().height,
        worldWidth: Math.abs(extents.x0) + Math.abs(extents.x1),
        worldHeight: Math.abs(extents.y0) + Math.abs(extents.y1)
      });

      app.stage.addChild(viewport);

      viewport.fit();

      return viewport;
    },
    stage
  };
};
