<template>
    <div>
        <h1>Bump Weekly Performance</h1>
        <h2>下列預設今日起前十週各料號良率表現&各缺點堆疊圖</h2>
        <bumpstackNav />
        <div class="d-flex">
            <div class="d-flex fd-column">
                <bumpstackMove class="move-list" />
            </div>
            <ul>
                <li class="d-flex chart-row">
                    <!-- yield boxplot -->
                    <bumpstackBoxplot :defect="defectSelect" />
                    <bumpstackMapping :Week="week" :defect="defectSelect" v-for="week of weekData" :key="week" />
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import pinia from "../../stores/index.js";

import bumpstackNav from '../../components/bump/stack/bumpstackNav.vue';
import bumpstackMove from '../../components/bump/stack/bumpstackMove.vue';
import bumpstackBoxplot from '../../components/bump/stack/bumpstackBoxplot.vue';
import bumpstackMapping from '../../components/bump/stack/bumpstackMapping.vue';

import { UsebumpstackStore } from "../../stores/bump/stack/bumpstackFetch.js";

const usebumpstackstore = UsebumpstackStore(pinia);
const { getmountData } = usebumpstackstore;
const { weekData, defectSelect } = storeToRefs(usebumpstackstore);

onMounted(() => {
    console.log('onMounted');
    getmountData();
});


</script>

<style  scoped>
h1 {
    text-align: center;
}

h2 {
    text-align: center;
}

.d-flex {
    display: flex;
}

.fd-column {
    flex-direction: column;
}

.move-list {
    list-style: none;
}

.chart-row {
    flex-wrap: wrap;
    justify-content: center;
    width: 1000px;
    margin-bottom: 10px;
}

</style>