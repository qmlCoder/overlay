import * as THREE from "three";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { Line2 } from "three/addons/lines/Line2.js";

export class Line extends Line2 {
  declare atms: number[];
  constructor(
    posi: number[],
    posj: number[],
    atms: number[],
    color: string,
    width: number
  ) {
    const [xi, yi, zi] = posi;
    const [xj, yj, zj] = posj;
    const geometry = new LineGeometry();
    geometry.setPositions([xi, yi, zi, xj, yj, zj]);
    const material = new LineMaterial({
      color: color,
      linewidth: width,
      vertexColors: false,
      dashed: false,
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
      depthWrite: false,
    });
    super(geometry, material);
    this.atms = atms;
  }

  set_color(color: string) {
    this.material.color = new THREE.Color(color);
    this.material.needsUpdate = true;
  }

  set_width(width: number) {
    this, (this.material.linewidth = width);
    this.material.needsUpdate = true;
  }
}
