<template>
    <div>
        <h1>OST Weekly Performance</h1>
        <h2>下列預設今日起前十週各料號良率表現&各缺點堆疊圖</h2>
        <oststackNav />
        <div class="d-flex">
            <div class="d-flex fd-column ">
                <oststackRadio />
                <oststackMove class="move-list" />
            </div>
            <ul>

                <li class="d-flex chart-row">

                    <!-- yield boxplot -->
                    <oststackBoxplot :defect="defectSelect" />
                    <oststackMapping :Week="week" :defect="defectSelect" v-for="week of weekData" :key="week" /> 
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import pinia from "../../stores/index.js";

import oststackNav from '../../components/ost/stack/oststackNav.vue';
import oststackMove from '../../components/ost/stack/oststackMove.vue';
import oststackRadio from '../../components/ost/stack/oststackRadio.vue';
import oststackBoxplot from '../../components/ost/stack/oststackBoxplot.vue';
import oststackMapping from '../../components/ost/stack/oststackMapping.vue';

import { UseoststackStore } from "../../stores/ost/stack/oststackFetch.js";



const useoststackstore = UseoststackStore(pinia);
const { getmountData } = useoststackstore;
const {  weekData,radioItem,defectSelect} = storeToRefs(useoststackstore);



onMounted(()=>{
    console.log('onMounted');
    getmountData(radioItem.value);
})
</script>

<style scoped>

h1,h2 {
    text-align: center;
}


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

</style>