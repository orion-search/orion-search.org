import * as THREE from "three";
// import TextSprite from "@seregpie/three.text-sprite";
// import TextTexture from "@seregpie/three.text-texture";
import SpriteText from "three-spritetext";

import { clamp } from "../utils";
import Renderer2D from "./Renderer2D";
import theme from "../styles";

class DiversityIndex extends Renderer2D {
  constructor({ canvas }) {
    super({ canvas });

    this.groups = {
      labels: new THREE.Group(),
      points: new THREE.Group()
    };

    this.scene.add(this.groups.points);
    this.scene.add(this.groups.labels);

    this.initScrollListeners();
    this.animate = this.animate.bind(this);
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.render();
  }

  setData(data) {
    this.data = data;
  }

  setLayout(layout) {
    this.layout = layout;
  }

  setScales(scales) {
    this.scales = scales;
  }

  initScrollListeners() {
    this.canvas.addEventListener("wheel", e => {
      e.preventDefault();
      this.scroll(e.deltaY);
    });
  }

  scroll(yDelta = 0) {
    this.scrollTo(this.camera.top + yDelta);
  }

  scrollTo(yPos = 0) {
    const yOffset = clamp(
      yPos,
      this.bbox.min.y - this.layout.margins.top,
      this.bbox.max.y + this.layout.margins.bottom - this.height
    );
    this.camera.top = yOffset;
    this.camera.bottom = yOffset + this.height;
    this.camera.updateProjectionMatrix();
  }

  drawLabels() {
    // for (var i = this.groups.labels.children.length - 1; i >= 0; i--) {
    //   this.groups.labels.remove(this.groups.labels.children[i]);
    // }

    // let hudCanvas = document.createElement("canvas");
    // hudCanvas.width = 256;
    // hudCanvas.height = 256;

    // let imgEl = document.createElement("img");

    // let geometry = new THREE.BoxBufferGeometry(256, 256, 1);

    // let hudBitmap = hudCanvas.getContext("2d");

    // hudBitmap.font = "Normal 30px Matter";

    // hudBitmap.fillStyle = theme.colors.black;
    // hudBitmap.fillRect(0, 0, hudCanvas.width, hudCanvas.height);

    // hudBitmap.strokeStyle = "red";
    // hudBitmap.fillStyle = "#ff0000";

    // hudBitmap.strokeRect(2, 0, 256, 30);
    // hudBitmap.fillStyle = "#ffffff";
    // hudBitmap.fillText("Explore", 0, 30);

    // hudCanvas.toBlob(blob => {
    //   imgEl.src = URL.createObjectURL(blob);
    //   // let hudTexture = new THREE.Texture(hudCanvas);
    //   let hudTexture = new THREE.Texture(imgEl);
    //   hudTexture.flipY = false;
    //   hudTexture.wrapS = THREE.RepeatWrapping;
    //   hudTexture.repeat.x = -1;
    //   hudTexture.needsUpdate = true;

    //   let material = new THREE.MeshBasicMaterial({
    //     map: hudTexture
    //   });
    //   material.transparent = true;

    //   const labelMeshes = [];

    //   let mesh = new THREE.Mesh(geometry, material);

    //   // make top-left the anchor point
    //   mesh.geometry.translate(hudCanvas.width / 2, hudCanvas.height / 2, 0);
    //   mesh.position.x = 0;
    //   mesh.position.y = 0;

    //   this.groups.labels.add(mesh);
    // });

    var myText = new SpriteText({
      text: "JE::PPPDFAFDSA",
      color: "red",
      fontSize: 90
    });
    // myText.renderOrder = 1;
    // myText.center = new THREE.Vector2(0, 0);
    // myText.position.x = 100;
    // myText.position.y = 100;

    const MultilineText = new SpriteText("This is\nsome multi-line\ntext", 70);
    MultilineText.color = "blue";
    MultilineText.scale.set(100, 100, 1);
    MultilineText.position.y = -15;
    MultilineText.center = new THREE.Vector2(0, 0);
    // MultilineText.position.set(100, 100, 0);

    // this.groups.labels.add(myText);
    this.groups.labels.add(MultilineText);
    // this.groups.labels.add(new THREE.AmbientLight(0xbbbbbb));

    // this.scales.category.domain().forEach((category, i) => {
    //   hudBitmap.fillStyle = theme.colors.wwhite;
    //   hudBitmap.fillRect(0, 0, hudCanvas.width, hudCanvas.height);
    //   hudBitmap.fillStyle = "#ff0000";
    //   hudBitmap.fillText(`${category}`, 0, 30);
    //   hudCanvas.toBlob(blob => {
    //     let imgEl = document.createElement("img");
    //     imgEl.src = URL.createObjectURL(blob);
    //     // let hudTexture = new THREE.Texture(hudCanvas);
    //     let hudTexture = new THREE.Texture(imgEl);
    //     hudTexture.flipY = false;
    //     hudTexture.wrapS = THREE.RepeatWrapping;
    //     hudTexture.repeat.x = -1;
    //     hudTexture.needsUpdate = true;

    //     let material = new THREE.MeshBasicMaterial({
    //       map: hudTexture
    //     });
    //     material.transparent = true;

    //     let mesh = new THREE.Mesh(geometry, material);

    //     // make top-left the anchor point
    //     mesh.geometry.translate(hudCanvas.width / 2, hudCanvas.height / 2, 0);
    //     mesh.position.x = 0;
    //     mesh.position.y = 0;

    //     this.groups.labels.add(mesh);
    //   }, "image/jpeg");
    //   // let hudTexture = new THREE.Texture(hudCanvas);
    //   // hudTexture.flipY = false;
    //   // hudTexture.wrapS = THREE.RepeatWrapping;
    //   // hudTexture.repeat.x = -1;
    //   // hudTexture.needsUpdate = true;
    //   // let material = new THREE.MeshBasicMaterial({
    //   //   map: hudTexture
    //   // });
    //   // let hudTexture = new THREE.Texture(hudCanvas);
    //   // hudTexture.flipY = false;
    //   // hudTexture.wrapS = THREE.RepeatWrapping;
    //   // hudTexture.repeat.x = -1;
    //   // hudTexture.needsUpdate = true;
    //   // console.log(category, i);
    //   // var geometry = new THREE.BoxBufferGeometry(256, 256, 1);
    //   // var material = new THREE.MeshBasicMaterial({
    //   //   map: hudTexture
    //   // });
    //   // material.transparent = false;
    //   // var m = new THREE.Mesh(geometry, material);
    //   // m.geometry.translate(hudCanvas.width / 2, hudCanvas.height / 2, 0);
    //   // // mesh.position.x = 0;
    //   // // mesh.position.y = i * 10;
    //   // m.geometry.translate(0, i * 100, 0);
    //   // this.groups.labels.add(m);
    // });

    console.log(this.groups.labels);

    // this.bbox = {
    //   max: new THREE.Box3().setFromObject(this.scene).max,
    //   min: new THREE.Box3().setFromObject(this.scene).min
    // };
  }

  draw() {
    for (var i = this.groups.points.children.length - 1; i >= 0; i--) {
      this.groups.points.remove(this.groups.points.children[i]);
    }

    let pointsGeometry = new THREE.Geometry();

    let colors = [];

    this.data
      .filter(d => this.scales.filterFunc(d))
      .forEach(d => {
        pointsGeometry.vertices.push(
          new THREE.Vector3(
            this.scales.x(this.scales.xFunc(d)),
            this.scales.category(this.scales.groupFunc(d)) +
              this.scales.y(this.scales.yFunc(d)),
            0
          )
        );
        colors.push(new THREE.Color(0xffffff));
      });
    pointsGeometry.colors = colors;

    let pointsMaterial = new THREE.PointsMaterial({
      size: 2,
      sizeAttenuation: false,
      vertexColors: THREE.VertexColors
    });

    this.groups.points.add(new THREE.Points(pointsGeometry, pointsMaterial));
    this.groups.points.position.x = this.width * 0.2;
    // this.scene.add(this.groups.points);

    this.bbox = {
      max: new THREE.Box3().setFromObject(this.scene).max,
      min: new THREE.Box3().setFromObject(this.scene).min
    };
  }
}

export default DiversityIndex;
