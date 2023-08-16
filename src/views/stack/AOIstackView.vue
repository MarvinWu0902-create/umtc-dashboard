<template>
    <div>
        <h1>AOI Weekly Performance</h1>
        <h2>下列預設今日起前十週各料號良率表現&各缺點堆疊圖</h2>
        <aoistackNav />

        <div class="d-flex">
            <div class="d-flex fd-column">
                <aoistackRadio />
                <aoistackMove class="move-list" />
            </div>
            <ul>

                <li class="d-flex chart-row">

                    <!-- yield boxplot -->
                    <aoistackBoxplot :defect="defectSelect" />
                    <aoistackMapping :Week="week" :defect="defectSelect" v-for="week of weekData" :key="week" />
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import pinia from "../../stores/index.js";

import aoistackNav from '../../components/aoi/stack/aoistackNav.vue';
import aoistackRadio from '../../components/aoi/stack/aoistackRadio.vue';
import aoistackMapping from '../../components/aoi/stack/aoistackMapping.vue';
import aoistackBoxplot from '../../components/aoi/stack/aoistackBoxplot.vue';
import aoistackMove from '../../components/aoi/stack/aoistackMove.vue';


import { UseaoistackStore } from "../../stores/aoi/aoistack/aoistackFetch.js";
const useaoistackstore = UseaoistackStore(pinia);
const { getaoistackData, getmountData } = useaoistackstore;
const { yieldData, weekData, radioItem, defectAry, navpartRecord, imageLoc, defectSelect } = storeToRefs(useaoistackstore);

onMounted(() => {
    console.log('onMounted')
    getmountData(radioItem.value);
});

</script>

<style scoped>
.d-flex {
    display: flex;
}
.fd-column{
    flex-direction: column;
}


.chart-row {
    flex-wrap: wrap;
    justify-content: center;
    width: 1000px;
    margin-bottom: 10px;
}

.move-list {
    list-style: none;
}



h1,h2 {
    text-align: center;
}
</style>