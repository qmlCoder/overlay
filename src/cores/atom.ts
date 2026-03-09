import * as THREE from "three";
import { Label } from "./label";
import { elements } from "../elems";

export class Atom extends THREE.Mesh {
  declare idx: number;
  declare label: Label;
  constructor(sym: string, xyz: number[], idx: number) {
    const elem = elements.get_byS(sym);
    let geometry = new THREE.SphereGeometry(elem.radius * 0.5);
    let material = new THREE.MeshPhysicalMaterial({
      color: elem.color,
      emissive: "#66d9e8",
      emissiveIntensity: 0,
    });
    super(geometry, material);
    let [x, y, z] = xyz;
    this.position.set(x, y, z);
    this.idx = idx;
  }
}
