import { Viewport } from "pixi-viewport";

export class SmartViewport extends Viewport {
  // constructor(props) {
  //   super(props);
  // }

  resumeInteractionListeners() {
    this.plugins.resume("drag");
    this.plugins.resume("pinch");
    this.plugins.resume("wheel");

    return this;
  }

  pauseInteractionListeners() {
    this.plugins.pause("drag");
    this.plugins.pause("pinch");
    this.plugins.pause("wheel");

    return this;
  }
}
