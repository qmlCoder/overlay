<style module>
div.root {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: row;
}

div.canva {
    width: 70%;
    height: 100%;
}

div.panel {
    width: 30%;
    height: 100%;
    background-color: #e7f5ff;
}

div.select {
    background-color: turquoise;
}

div.path {
    cursor: pointer;
}

div.logs {
    display: flex;
    flex-direction: column;
}
</style>

<template>
    <el-dialog v-model="refs.show_help" title="程序说明📕">
        <HelpPage></HelpPage>
    </el-dialog>
    <div :class="$style.root">
        <div :class="$style.canva">
            <canvas id="canvas" style="width: 100%;height: 100%;"></canvas>
        </div>
        <div :class="$style.panel">
            <span style="font-size: smaller;color: blue;cursor: pointer;" @click="to_help">程序说明📕</span>
            <h4>分子列表</h4>
            <div>
                <div :class="{ [$style.select]: refs.moleidx == idx, [$style.path]: true }"
                    v-for="path, idx in refs.paths" :key="path.path" @click="set_moleID(idx)">
                    <div>{{ idx + 1 }}: {{ path.path }}</div>
                    <div><span v-for="atm in path.atms">{{ atm + 1 }}|</span></div>
                </div>
            </div>
            <h4>程序设置</h4>
            <panel-item title="键的颜色">
                <el-color-picker v-model="refs.bond_color" @active-change="set_bondColor($event as string)"
                    :predefine="colors"></el-color-picker>
            </panel-item>
            <panel-item title="键的宽度">
                <el-slider :min="0" :max="5" v-model="refs.bond_width"
                    @change="set_bondWidth($event as number)"></el-slider>
            </panel-item>
            <panel-item title="键の类型">
                <ElRadioGroup v-model="refs.bond_type" @change="set_bondType">
                    <ElRadio value="键">键</ElRadio>
                    <ElRadio value="线">线</ElRadio>
                </ElRadioGroup>
            </panel-item>
            <panel-item title="显示坐标轴">
                <el-switch v-model="refs.show_axis" @change="set_axisShow"></el-switch>
            </panel-item>
            <panel-item title="显示原子">
                <el-switch v-model="refs.show_atom" @change="set_atomShow"></el-switch>
            </panel-item>

            <panel-item title="显示标签">
                <el-switch v-model="refs.show_label" @change="set_labelShow"></el-switch>
            </panel-item>
            <panel-item title="显示分子">
                <el-switch v-model="refs.mole_show" @change="set_moleShow"></el-switch>
            </panel-item>
            <panel-item title="原子显示">
                <div>
                    <el-button size="small" @click="set_atomShowType('select')">隐藏其它原子</el-button>
                    <el-button size="small" @click="set_atomShowType('all')">显示所有原子</el-button>
                </div>
            </panel-item>
            <el-button @click="align_moles">分子对齐</el-button>
            <h4>程序日志：</h4>
            <div :class="$style.logs">
                <div v-for="log in refs.logs">{{ log }}</div>
            </div>
        </div>
    </div>
</template>



<script setup lang="ts">
import { ElSwitch, ElColorPicker, ElButton, ElMessage, ElDialog, ElRadioGroup, ElRadio, ElSlider } from "element-plus";
import { onMounted, ref } from "vue";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { Scene } from "../scene";
import { Mole } from "../cores/mole";
import PanelItem from "../compts/PanelItem.vue";
import HelpPage from "./HelpPage.vue";
import { Atom } from "../cores/atom";
import { Line } from "../cores/line";
import { Bond } from "../cores/bond";
import { Label } from "../cores/label";
// import { useRouter } from 'vue-router'
// import { WebviewWindow } from '@tauri-apps/api/window'

// const router = useRouter()

const scene = new Scene()

interface Path {
    path: string,
    atms: number[]
}


const refs = ref({
    show_atom: true,
    bond_type: "线",
    show_axis: true,
    paths: [] as Path[],
    moleidx: 0,
    bond_color: "#868e96",
    bond_width: 5,
    logs: [] as string[],
    mole_show: true,
    show_label: true,
    show_help: true,
})

const colors = ["#868e96", "#fa5252", "#e64980", "#be4bdb", "#7950f2", "#4c6ef5", "#228be6", "#15aabf", "#12b886"]

const drag_file = async () => {
    await getCurrentWebview().onDragDropEvent(event => {
        if (event.payload.type == "drop") {
            const files = event.payload.paths
            console.log(files)
            for (let i = 0; i < files.length; i++) {
                const path = files[i]
                invoke<[string[], number[][]]>("read_gjf", { path: path }).then(res => {
                    console.log(res)
                    const [syms, xyzs] = res
                    const mole = new Mole(syms, xyzs, colors[(scene.moles.children.length) % colors.length])
                    scene.moles.add(mole)
                    mole.renderOrder = scene.moles.children.length
                    refs.value.paths.push({
                        path: path,
                        atms: mole.refs.value.selects
                    })
                    mole.update_labels(scene.camera.position)
                })
            }

        }
    })
}
drag_file()

const set_atomShow = () => {
    scene.set_atomShow(refs.value.show_atom)
}

const set_atomShowType = (type: string) => {
    const idx = refs.value.moleidx
    const mole = scene.moles.children[idx] as Mole
    const atoms = mole.atoms.children as Atom[]
    const lines = mole.lines.children as Line[]
    const bonds = mole.bonds.children as Bond[]
    const labels = mole.labels.children as Label[]
    if (type == "all") {
        for (const atom of atoms) {
            atom.visible = true
        }
        for (const label of labels) {
            label.visible = true
        }
        for (const line of lines) {
            line.visible = refs.value.bond_type == "线"
        }
        for (const bond of bonds) {
            bond.visible = refs.value.bond_type == "键"
        }
    } else if (type == "select") {
        const selects = mole.refs.value.selects
        for (let i = 0; i < atoms.length; i++) {
            if (selects.includes(i)) {
                atoms[i].visible = true
            } else {
                atoms[i].visible = false
            }
        }
        for (let i = 0; i < labels.length; i++) {
            if (selects.includes(i)) {
                labels[i].visible = true
            } else {
                labels[i].visible = false
            }
        }
        if (refs.value.bond_type == "线") {
            for (const line of lines) {
                const [i, j] = line.atms
                if (selects.includes(i) && selects.includes(j)) {
                    line.visible = true
                } else {
                    line.visible = false
                }
            }
        }
        if (refs.value.bond_type == "键") {
            for (const bond of bonds) {
                const [i, j] = bond.atms
                if (selects.includes(i) && selects.includes(j)) {
                    bond.visible = true
                } else {
                    bond.visible = false
                }
            }
        }


    }
}


const set_labelShow = () => {
    const moles = scene.moles.children as Mole[]
    for (const mole of moles) {
        mole.labels.visible = refs.value.show_label
    }
}

const set_moleShow = () => {
    const moles = scene.moles.children as Mole[]
    for (let i = 0; i < moles.length; i++) {
        if (i == refs.value.moleidx) { continue }
        moles[i].visible = refs.value.mole_show
    }
}


const set_axisShow = () => {
    scene.axes.visible = refs.value.show_axis
}
const set_bondColor = (color: string) => {
    const idx = refs.value.moleidx
    const mole = scene.moles.children[idx] as Mole
    mole.set_bondColor(color)
    console.log("设置键的颜色", color)
}

const set_bondWidth = (width: number) => {
    const idx = refs.value.moleidx
    const mole = scene.moles.children[idx] as Mole
    mole.set_bondWidth(width)
    console.log("设置键的宽度", width)
}

const set_bondType = () => {
    const idx = refs.value.moleidx
    const mole = scene.moles.children[idx] as Mole
    mole.set_bondType(refs.value.bond_type)
}

const align_moles = () => {
    const moles = scene.moles.children as Mole[]
    if (moles.length < 2) {
        return
    }
    const get_idxs = (mole: Mole) => {
        if (mole.refs.value.selects.length == 0) {
            return mole.get_idxs()
        } else {
            return mole.refs.value.selects
        }
    }
    const mole1 = moles[refs.value.moleidx]
    const para_mole1 = {
        xyzs: mole1.xyzs,
        idxs: get_idxs(mole1),
    }
    for (let i = 0; i < moles.length; i++) {
        if (i == refs.value.moleidx) { continue }
        const mole2 = moles[i]
        const para_mole2 = {
            xyzs: mole2.xyzs,
            idxs: get_idxs(mole2),
        }
        if (para_mole1.idxs.length != para_mole2.idxs.length) {
            ElMessage({
                message: "两个分子原子数量不一致",
                type: "error",
            })
            continue
        }
        invoke<[number[][], number]>("align", { mole1: para_mole1, mole2: para_mole2 }).then(res => {
            console.log(res)
            const [xyzs, err] = res
            moles[i].set_atomXyzs(xyzs)
            moles[i].update_labels(scene.camera.position)
            refs.value.logs.push(`${i + 1} -> ${refs.value.moleidx + 1},平均原子距离:${err.toFixed(4)}`)
            ElMessage({
                message: `${i + 1} -> ${refs.value.moleidx + 1} 分子对齐完成`,
                type: "success",
            })
        })
    }


}

const set_moleID = (idx: number) => {
    refs.value.moleidx = idx
    scene.refs.value.moleID = idx
    const moles = scene.moles.children as Mole[]
    for (let i = 0; i < moles.length; i++) {
        moles[i].visible = refs.value.mole_show
    }
    moles[idx].visible = true
    refs.value.bond_color = moles[idx].bond_color
    refs.value.bond_width = moles[idx].bond_width
    refs.value.bond_type = moles[idx].bond_type
}

onMounted(() => {
    scene.init_scene(document.getElementById("canvas") as HTMLCanvasElement)
    scene.animate()
})

const to_help = () => {
    // 创建一个新的窗口显示帮助页面
    console.log("打开新窗口")
    refs.value.show_help = true
    window.open('https://www.xiaofei911.top/mkdocs/wmview/')
    // router.push({
    //     name: 'HelpPage',
    // })
}

</script>