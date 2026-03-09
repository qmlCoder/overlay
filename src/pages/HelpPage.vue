<style lang="css" module>
span.func {
    font-weight: bold;
    color: #364fc7;
}

span.bold {
    font-weight: bold;
}

span.line {
    text-decoration: underline;
}
</style>

<template>
    <p>本程序的功能是 <span :class="$style.bold">对齐分子结构</span>，也就是 <span :class="$style.line">让原子对之间的平均距离尽可能小</span></p>
    <p>程序启动后，将含有单个分子结构的 gjf 拖进程序（目前仅支持 gjf 文件），右侧的 <span :class="$style.func">分子列表</span> 会显示当前加载的分子</p>
    <p>在 <span :class="$style.func">分子列表</span> 中选择一个分子，点击 <span :class="$style.func">分子对齐</span>，<span
            :class="$style.line">未选中的分子会向选择的分子对齐</span></p>
    <p>在 <span :class="$style.func">程序设置</span> 里打开 <span :class="$style.func">原子显示</span>，点击相应的原子，在 <span
            :class="$style.func">分子列表</span> 每个分子路径的下方会显示 <span :class="$style.bold">该分子选择的原子</span></p>
    <p>如果没有选择原子，程序会对齐 <span :class="$style.bold">所有原子</span>（此时所有分子原子数量需要保证一致）</p>
    <p>如果选择了原子，只对齐 <span :class="$style.bold">选中的原子</span>（此时每个分子选择的原子数量要保持一致）</p>
    <p>默认所有加载的分子都显示，可以关闭 <span :class="$style.func">程序设置</span> 里的 <span :class="$style.func">显示分子</span> 这样就会只显示当前选择的分子
    </p>
    <p>按F5键可以刷新程序</p>

</template>

<script setup lang="ts"></script>