import { Vector2 } from "three";
import { tween } from "@tweenjs/tween.js";

export class Navigation {
  state = {
    rotate: {
      left: false,
      right: false,
    },
    disableOrbitControls: false,
  };
  renderer;
  camera;

  constructor({ renderer, camera }) {
    this.idleState = this.state;
    this.renderer = renderer;
    this.camera = camera;

    this.renderer.domElement.addEventListener(
      "keydown",
      this.keydownFunctions.bind(this)
    );
    this.renderer.domElement.addEventListener("keyup", (e) => {
      this.state = this.idleState;
    });
  }

  keydownFunctions(e) {
    switch (e.key) {
      case "Shift":
        // Disable controls
        this.state = {
          ...this.state,
          disableOrbitControls: true,
        };
        break;
      default:
        break;
    }
    switch (e.code) {
      case "KeyE":
        // Rotate right
        this.state = {
          ...this.state,
          rotate: {
            ...this.state.rotate,
            right: true,
          },
        };
        break;
      case "KeyQ":
        // Rotate left
        this.state = {
          ...this.state,
          rotate: {
            ...this.state.rotate,
            left: true,
          },
        };
        break;
      default:
        break;
    }
  }

  flyTo() {}
}
