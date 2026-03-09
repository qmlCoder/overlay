import * as THREE from "three";

import { elements } from "../elems";
import { ref } from "vue";
import type { Ref } from "vue";
import { Label } from "./label";
import { Atom } from "./atom";
import { Line } from "./line";
import { Bond } from "./bond";

export class Mole extends THREE.Group {
  declare syms: string[];
  declare xyzs: number[][];
  declare atoms: THREE.Group;
  declare bonds: THREE.Group;
  declare lines: THREE.Group;
  declare bond_color: string;
  declare bond_width: number;
  declare bond_type: string;
  declare labels: THREE.Group;
  // declare selects: number[]; // 选择的原子
  declare refs: Ref<{
    selects: number[];
  }>;
  constructor(syms: string[], xyzs: number[][], bond_color: string) {
    super();
    this.bond_color = bond_color;
    this.bond_width = 5;
    this.bond_type = "线";
    this.syms = syms;
    this.xyzs = xyzs;
    this.atoms = new THREE.Group();
    this.bonds = new THREE.Group();
    this.lines = new THREE.Group();
    this.labels = new THREE.Group();

    this.add(this.atoms);
    this.add(this.bonds);
    this.add(this.lines);
    this.add(this.labels);
    this.build_atoms();
    this.build_bonds();
    // this.selects = [];
    this.refs = ref({
      selects: [],
    });
  }

  build_atoms() {
    const natm = this.xyzs.length;
    // 添加原子
    for (let i = 0; i < natm; i++) {
      const sym = this.syms[i];
      const xyz = this.xyzs[i];
      const atom = new Atom(sym, xyz, i);
      this.atoms.add(atom);
      const elem = elements.get_byS(sym);
      const label = new Label(this, `${i + 1}`, xyz, elem.radius, i);
      this.labels.add(label);
    }
  }

  get_atoms() {
    return this.atoms.children as Atom[];
  }

  build_bonds() {
    const natm = this.xyzs.length;
    this.bonds.clear();
    this.lines.clear();
    for (let i = 0; i < natm - 1; i++) {
      let [xi, yi, zi] = this.xyzs[i];
      let symi = this.syms[i];
      let elmi = elements.get_byS(symi);
      for (let j = i + 1; j < natm; j++) {
        let [xj, yj, zj] = this.xyzs[j];
        let symj = this.syms[j];
        let elmj = elements.get_byS(symj);
        let dist = Math.sqrt((xi - xj) ** 2 + (yi - yj) ** 2 + (zi - zj) ** 2);
        if (dist > (elmi.radius + elmj.radius) * 1.1) continue;
        const bond = new Bond([xi, yi, zi], [xj, yj, zj], [i, j]);
        const line = new Line(
          [xi, yi, zi],
          [xj, yj, zj],
          [i, j],
          this.bond_color,
          this.bond_width
        );
        this.lines.add(line);
        this.bonds.add(bond);
        bond.visible = false;
      }
    }
  }

  set_bondColor(color: string) {
    this.bond_color = color;
    const lines = this.lines.children as Line[];
    for (const line of lines) {
      line.set_color(color);
    }
  }

  set_bondWidth(width: number) {
    this.bond_width = width;
    const lines = this.lines.children as Line[];
    for (const line of lines) {
      line.set_width(width);
    }
  }

  set_bondType(type: string) {
    this.bond_type = type;
    const bonds = this.bonds.children as Bond[];
    const lines = this.lines.children as Line[];
    for (const bond of bonds) {
      bond.visible = type == "键";
    }
    for (const line of lines) {
      line.visible = type == "线";
    }
  }

  set_atomXyzs(xyzs: number[][]) {
    this.xyzs = xyzs;
    const atoms = this.atoms.children as THREE.Mesh[];
    for (let i = 0; i < atoms.length; i++) {
      let [x, y, z] = xyzs[i];
      atoms[i].position.set(x, y, z);
    }
    this.build_bonds();
  }

  set_selects(atm: number) {
    const selects = this.refs.value.selects;
    if (selects.includes(atm)) {
      selects.splice(selects.indexOf(atm), 1);
    } else {
      selects.push(atm);
    }
    const atoms = this.atoms.children as THREE.Mesh[];
    for (let i = 0; i < atoms.length; i++) {
      const material = atoms[i].material as THREE.MeshPhysicalMaterial;
      if (selects.includes(i)) {
        material.emissiveIntensity = 1;
      } else {
        material.emissiveIntensity = 0;
      }
    }
  }

  clear_selects() {
    this.refs.value.selects = [];
    const atoms = this.atoms.children as THREE.Mesh[];
    for (let i = 0; i < atoms.length; i++) {
      const material = atoms[i].material as THREE.MeshPhysicalMaterial;
      material.emissiveIntensity = 0;
    }
  }

  get_idxs(): number[] {
    return this.xyzs.map((_xyz, idx) => idx);
  }

  update_labels(cam_pos: THREE.Vector3) {
    const labels = this.labels.children as Label[];
    for (const label of labels) {
      label.update(cam_pos);
    }
  }
}
