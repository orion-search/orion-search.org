/**
 * Adapted and reduced (no UI) version of SelectionHelper
 * from THREE.js examples.
 *
 * Original @author HypnosNova / https://www.threejs.org.cn/gallery
 */
import { Vector2 } from "three";
import { SelectionBox } from "../SelectionBox";

export class Selection {
  camera;
  enabled = true;
  isDown = false;
  pointTopLeft = new Vector2();
  pointBottomRight = new Vector2();
  raycaster;
  selectionBox;
  startPoint = new Vector2();

  constructor({
    camera,
    onSelectionEnd = () => {},
    renderer,
    // raycaster,
    scene,
  }) {
    this.camera = camera;
    this.onSelectionEnd = onSelectionEnd;
    // this.raycaster = raycaster;
    this.scene = scene;

    this.selectionBox = new SelectionBox(this.camera, this.scene);

    renderer.domElement.addEventListener(
      "mousedown",
      function (event) {
        if (!this.enabled) return;
        this.isDown = true;
        this.onSelectStart(event);

        this.selectionBox.setStartPoint(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
          0.5
        );
      }.bind(this),
      false
    );

    renderer.domElement.addEventListener(
      "mousemove",
      function (event) {
        if (!this.enabled) return;
        if (this.isDown) {
          this.onSelectMove(event);

          this.selectionBox.setEndPoint(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1,
            0.5
          );
        }
      }.bind(this),
      false
    );

    renderer.domElement.addEventListener(
      "mouseup",
      function (event) {
        if (!this.enabled) return;
        this.isDown = false;
        this.selectionBox.setEndPoint(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
          0.5
        );

        this.onSelectOver(event);
      }.bind(this),
      false
    );
  }

  onSelectStart(event) {
    this.startPoint.x = event.clientX;
    this.startPoint.y = event.clientY;
  }

  onSelectMove(event) {
    this.pointBottomRight.x = Math.max(this.startPoint.x, event.clientX);
    this.pointBottomRight.y = Math.max(this.startPoint.y, event.clientY);
    this.pointTopLeft.x = Math.min(this.startPoint.x, event.clientX);
    this.pointTopLeft.y = Math.min(this.startPoint.y, event.clientY);

    // this.raycaster.setFromCamera(new Vector2(x, y), this.camera);

    this.onSelectionEnd(
      {
        selected: this.selectionBox.select(
          this.scene.getObjectByName("All_Particles", true)
        ),
        plane: [],
      },
      false
    );
  }

  onSelectOver() {
    this.onSelectionEnd(
      {
        selected: this.selectionBox.select(
          this.scene.getObjectByName("All_Particles", true)
        ),
        plane: [],
      },
      true
    );
  }
}
