import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { Mole } from "./cores/mole";
import { Atom } from "./cores/atom";
import type { Ref } from "vue";
import { ref } from "vue";

export class Scene extends THREE.Scene {
  declare canvasDom: HTMLCanvasElement;
  declare renderer: THREE.WebGLRenderer;
  declare camera: THREE.PerspectiveCamera;
  declare control: TrackballControls;
  declare moles: THREE.Group;
  declare axes: THREE.AxesHelper;
  declare raycaster: THREE.Raycaster;
  declare refs: Ref<{ moleID: number }>;

  constructor() {
    super();
    this.moles = new THREE.Group();
    this.add(this.moles);
    window.addEventListener("resize", this.on_resize.bind(this));
  }

  init_scene(canvasDom: HTMLCanvasElement) {
    this.canvasDom = canvasDom;
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvasDom,
    });
    this.renderer.setSize(canvasDom.clientWidth, canvasDom.clientHeight);
    this.renderer.setClearColor(0xffffff);
    this.renderer.setPixelRatio(window.devicePixelRatio * 2);
    const aspect = canvasDom.clientWidth / canvasDom.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(5, 5, 5);
    this.control = new TrackballControls(this.camera, this.canvasDom);
    const scene_light = new THREE.AmbientLight(0xffffff);
    this.add(scene_light);

    const directional_light = new THREE.DirectionalLight(0xffffff, 1);
    directional_light.position.set(5, 5, 5);
    this.add(directional_light);

    this.axes = new THREE.AxesHelper(5);
    this.add(this.axes);
    console.log("场景初始化成功");
    this.raycaster = new THREE.Raycaster(); //射线
    this.canvasDom.addEventListener("click", this.on_click.bind(this));
    this.canvasDom.addEventListener("dblclick", this.on_dblclick.bind(this));
    this.refs = ref({ moleID: 0 });
    this.control.addEventListener("change", () => {
      const moles = this.moles.children as Mole[];
      for (const mole of moles) {
        mole.update_labels(this.camera.position);
      }
    });
  }

  on_click(event: MouseEvent) {
    console.log(this.refs.value.moleID);
    if (this.moles.children.length === 0) {
      return;
    }
    const mole = this.moles.children[this.refs.value.moleID] as Mole;
    interface ClickAtom {
      object: Atom;
    } // 定义选中物体的接口
    console.log(event);
    const rect = this.canvasDom.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    const mouse = new THREE.Vector2(x, y);
    this.raycaster.setFromCamera(mouse, this.camera);
    let objects = [];
    objects.push(...mole.atoms.children);
    // console.log("objects", objects);
    const atoms = this.raycaster.intersectObjects(
      objects
    ) as unknown as ClickAtom[];
    // console.log("atoms", atoms);
    const idxs = atoms.map((atom) => atom.object.idx);
    if (idxs.length > 0) {
      mole.set_selects(idxs[0]);
      // console.log("设置选择原子", idxs);
    }
  }

  on_dblclick() {
    const moles = this.moles.children as Mole[];
    for (const mole of moles) {
      mole.clear_selects();
    }
  }

  animate() {
    this.renderer.render(this, this.camera);
    this.control.update();
    requestAnimationFrame(this.animate.bind(this));
  }

  set_atomShow(show: boolean) {
    const moles = this.moles.children as Mole[];
    for (const mole of moles) {
      mole.atoms.visible = show;
    }
  }

  set_bondShow(show: boolean) {
    const moles = this.moles.children as Mole[];
    for (const mole of moles) {
      mole.bonds.visible = show;
    }
  }

  on_resize() {
    this.canvasDom.style.width = "100%";
    this.canvasDom.style.height = "100%";
    this.canvasDom.width = this.canvasDom.clientWidth;
    this.canvasDom.height = this.canvasDom.clientHeight;
    const aspect = this.canvasDom.clientWidth / this.canvasDom.clientHeight;
    console.log(aspect);
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.canvasDom.clientWidth,
      this.canvasDom.clientHeight
    );
    this.renderer.setPixelRatio(window.devicePixelRatio * 2);
  }
}
