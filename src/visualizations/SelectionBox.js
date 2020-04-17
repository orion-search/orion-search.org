/**
 * @author HypnosNova / https://www.threejs.org.cn/gallery
 * This is a class to check whether objects are in a selection area in 3D space
 */

import { Frustum, Vector3 } from "three";

let SelectionBox = (function () {
  let frustum = new Frustum();
  let center = new Vector3();

  let tmpPoint = new Vector3();

  let vecNear = new Vector3();
  let vecTopLeft = new Vector3();
  let vecTopRight = new Vector3();
  let vecDownRight = new Vector3();
  let vecDownLeft = new Vector3();

  let vectemp1 = new Vector3();
  let vectemp2 = new Vector3();
  let vectemp3 = new Vector3();

  function SelectionBox(camera, scene, deep) {
    this.camera = camera;
    this.scene = scene;
    this.startPoint = new Vector3();
    this.endPoint = new Vector3();
    this.collection = { ids: [], idx: [] };
    this.deep = deep || Number.MAX_VALUE;
  }

  SelectionBox.prototype.select = function (object) {
    // this.startPoint = startPoint || this.startPoint;
    // this.endPoint = endPoint || this.endPoint;
    this.collection = { ids: [], idx: [] };

    this.updateFrustum(this.startPoint, this.endPoint);
    // this.searchChildInFrustum(frustum, this.scene);
    this.searchObjectInstancesInFrustum(frustum, object);

    return this.collection;
  };

  SelectionBox.prototype.setStartPoint = function (x, y, z) {
    this.startPoint.set(x, y, z);
  };

  SelectionBox.prototype.setEndPoint = function (x, y, z) {
    this.endPoint.set(x, y, z);
  };

  SelectionBox.prototype.updateFrustum = function (startPoint, endPoint) {
    startPoint = startPoint || this.startPoint;
    endPoint = endPoint || this.endPoint;

    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld();

    tmpPoint.copy(startPoint);
    tmpPoint.x = Math.min(startPoint.x, endPoint.x);
    tmpPoint.y = Math.max(startPoint.y, endPoint.y);
    endPoint.x = Math.max(startPoint.x, endPoint.x);
    endPoint.y = Math.min(startPoint.y, endPoint.y);

    vecNear.copy(this.camera.position);
    vecTopLeft.copy(tmpPoint);
    vecTopRight.set(endPoint.x, tmpPoint.y, 0);
    vecDownRight.copy(endPoint);
    vecDownLeft.set(tmpPoint.x, endPoint.y, 0);

    vecTopLeft.unproject(this.camera);
    vecTopRight.unproject(this.camera);
    vecDownRight.unproject(this.camera);
    vecDownLeft.unproject(this.camera);

    vectemp1.copy(vecTopLeft).sub(vecNear);
    vectemp2.copy(vecTopRight).sub(vecNear);
    vectemp3.copy(vecDownRight).sub(vecNear);
    vectemp1.normalize();
    vectemp2.normalize();
    vectemp3.normalize();

    vectemp1.multiplyScalar(this.deep);
    vectemp2.multiplyScalar(this.deep);
    vectemp3.multiplyScalar(this.deep);
    vectemp1.add(vecNear);
    vectemp2.add(vecNear);
    vectemp3.add(vecNear);

    let planes = frustum.planes;

    planes[0].setFromCoplanarPoints(vecNear, vecTopLeft, vecTopRight);
    planes[1].setFromCoplanarPoints(vecNear, vecTopRight, vecDownRight);
    planes[2].setFromCoplanarPoints(vecDownRight, vecDownLeft, vecNear);
    planes[3].setFromCoplanarPoints(vecDownLeft, vecTopLeft, vecNear);
    planes[4].setFromCoplanarPoints(vecTopRight, vecDownRight, vecDownLeft);
    planes[5].setFromCoplanarPoints(vectemp3, vectemp2, vectemp1);
    planes[5].normal.multiplyScalar(-1);
  };

  SelectionBox.prototype.searchObjectInstancesInFrustum = function (
    frustum,
    object
  ) {
    if (object.material === undefined) return;

    const positions = object.geometry.getAttribute("position");
    if (!positions) return [];
    for (let idx = 0; idx < positions.count; idx++) {
      center.copy(
        new Vector3(
          positions.array[idx * 3],
          positions.array[idx * 3 + 1],
          positions.array[idx * 3 + 2]
        )
      );

      center.applyMatrix4(object.matrixWorld);

      if (frustum.containsPoint(center)) {
        this.collection.idx.push(idx);
        // this.collection.ids.push(object.geometry.getAttribute("id").getX(idx));
        this.collection.ids.push(object.geometry.userData.ids[idx]);
      }
    }
  };

  return SelectionBox;
})();

export { SelectionBox };
