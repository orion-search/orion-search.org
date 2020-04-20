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

  constructor({ renderer, camera, controls }) {
    this.idleState = this.state;
    this.renderer = renderer;
    this.camera = camera;
    this.controls = controls;

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
      case "KeyF":
        this.flyTo({
          position: {
            x: -6470.934313189284,
            y: 10129.905082625233,
            z: -12712.04995590219,
          },
        });
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

  flyTo({ position }) {
    // @todo make a tween here
    // this.controls.target.set(position.x, position.y, position.z);
    // this.controls.update();
  }
}
