/**
 * @file Instantiates a PIXI application with a set of
 * default renderer settings.
 */
import * as PIXI from "pixi.js";
import styled from "@emotion/styled";

export const AbsoluteCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
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
    stage
  };
};
