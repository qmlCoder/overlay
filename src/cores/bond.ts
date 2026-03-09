import * as THREE from "three";
import { Mole } from "./mole";

const get_geome = () => {
  const points = [
    [0.0, 0.0],
    [0.1, 0.0],
    [0.09, 0.25],
    [0.08, 0.5],
    [0.09, 0.75],
    [0.1, 1.0],
    [0.0, 1.0],
  ].map((row) => new THREE.Vector2(...row));
  const geometry = new THREE.LatheGeometry(points);
  geometry.rotateX(Math.PI / 2);
  return geometry;
};

export class Bond extends THREE.Mesh {
  declare mole: Mole;
  declare type: string;
  declare atms: number[];
  constructor(posi: number[], posj: number[], atms: number[]) {
    // const cent = new THREE.Vector3().addVectors(atom1.position, atom2.position).multiplyScalar(0.5)
    const veci = new THREE.Vector3(...posi);
    const vecj = new THREE.Vector3(...posj);
    const vect = new THREE.Vector3().subVectors(vecj, veci);
    const geometry = get_geome();
    const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    geometry.scale(1, 1, vect.length());
    super(geometry, material);
    this.type = "Bond";
    this.receiveShadow = true;
    this.castShadow = true;
    this.position.copy(new THREE.Vector3(...posi));
    this.lookAt(new THREE.Vector3(...posj));
    this.atms = atms;
    // this.add(new THREE.AxesHelper(1))
  }
}
