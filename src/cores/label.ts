import * as THREE from "three";
import { Mole } from "./mole";

export class Label extends THREE.Sprite {
  text: string;
  cent: number[];
  dist: number;
  mole: Mole;
  context: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  declare idx: number;

  constructor(
    mole: Mole,
    text: string,
    cent: number[],
    dist: number,
    idx: number
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 500;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    const fontSize = Math.min(150, 500 / text.length);
    context.font = `bold ${fontSize}px 	Courier New`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "black";

    // 创建一个纹理
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    // 创建一个Sprite对象
    super(new THREE.SpriteMaterial({ map: texture }));
    this.mole = mole;
    this.cent = cent; // 标签绑定的原子
    this.dist = dist;
    this.canvas = canvas;
    this.context = context;
    this.text = "";
    this.set_txt(text);
    this.idx = idx;
  }

  /**
   * 设置标签的文本内容
   * @param text 标签文本
   */
  set_txt(text: string) {
    if (text == this.text) return;
    // console.log('设置标签文本', text)
    if (text.length > 10) {
      console.warn("标签文本过长", text);
    }
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let length = text.length;
    if (!isNaN(parseFloat(text))) {
      if (parseFloat(text) > 0) {
        length += 1;
      }
    }
    const fontSize = Math.min(150, 500 / length);
    this.context.font = `bold ${fontSize}px 	Courier New`;
    this.context.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
    (this.material.map as THREE.Texture).needsUpdate = true;
    this.text = text;
  }

  update(cam_pos: THREE.Vector3) {
    const atoms = this.mole.get_atoms();
    const amt_pos = atoms[this.idx].position;
    const txt_dir = new THREE.Vector3()
      .subVectors(cam_pos, amt_pos)
      .normalize()
      .multiplyScalar(this.dist); //摄像机到原子的向量
    const txt_pos = new THREE.Vector3().addVectors(amt_pos, txt_dir);
    this.position.copy(txt_pos);
  }
}
