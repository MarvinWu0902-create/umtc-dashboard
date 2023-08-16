<template>
    <div>
        <h1>CC Weekly Performance</h1>
        <h2>下列預設今日起前十週各料號良率表現&各缺點堆疊圖</h2>
        <ccstackNav />
        <div class="d-flex">
            <div class="d-flex fd-column">
                <ccstackMove class="move-list" />
            </div>
            <ul>
                <li class="d-flex chart-row">
                    <!-- yield boxplot -->
                    <ccstackBoxplot :defect="defectSelect" />
                    <ccstackMapping :Week="week" :defect="defectSelect" v-for="week of weekData" :key="week" />
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import pinia from "../../stores/index.js";

import ccstackNav from '../../components/cc/stack/ccstackNav.vue';
import ccstackMove from '../../components/cc/stack/ccstackMove.vue';
import ccstackBoxplot from '../../components/cc/stack/ccstackBoxplot.vue';
import ccstackMapping from '../../components/cc/stack/ccstackMapping.vue';

import { UseccstackStore } from "../../stores/cc/stack/ccstackFetch.js";

const useccstackstore = UseccstackStore(pinia);
const { getmountData } = useccstackstore;
const { weekData, defectSelect } = storeToRefs(useccstackstore);

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