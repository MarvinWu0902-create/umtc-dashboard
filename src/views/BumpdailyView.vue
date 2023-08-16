<template>
    <div>
        <bumpDevice />
        <bumpPick />
        <div class="title">
            <h1>Bump Daily Low Yield</h1>
        </div>
        <div class="sub">
            <p>下列預設為YIP當日晨會Bump Trigger批號,如要查詢過往資料,下列條件選擇後,在點選查詢即可</p>
        </div>
        <bumpTime />

        <div class="radio">
            <n-radio-group v-model:value="radioItem" name="radiogroup">
                <n-radio value="all">
                    全部
                </n-radio>
                <n-radio value="machine">
                    機台別
                </n-radio>
            </n-radio-group>
        </div>


        <div :class="{ hclayout: machineData.data.length > 1 }" v-if="filterTotaltableData.length > 0 && radioItem === 'machine'">
            <!-- ^ filterTotaltableData.length {hclayout:machineData.data.length>1}-->
            <bumpHC v-for="eachmac of machineData.data" :machine="eachmac" :key="machineData.part.concat(eachmac)" />
        </div>
        <div v-else-if="radioItem === 'all'">
            <bumpHC />
        </div>

        <!-- v-for machineData  if filterTotaltableData.length-->
        <bumpitemSelect />
        <bumpTable />
        <bumpbtnSelect />
        <bumpdefectNav />
        <div class="trend" v-if="selectStatus">
            <bumpdefectTrendHC />
        </div>

    </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import pinia from "@/stores/index.js";
import { storeToRefs } from 'pinia';
import { NForm, NRadioGroup, NRadio, NSpace } from 'naive-ui';


import bumpDevice from '../components/bump/daily/bumpDevice.vue'
import bumpTime from '../components/bump/daily/bumpTime.vue';
import bumpPick from '../components/bump/daily/bumpPick.vue';
import bumpitemSelect from '../components/bump/daily/bumpitemSelect.vue';
import bumpHC from '../components/bump/daily/bumpHC.vue';
import bumpTable from '../components/bump/daily/bumpTable.vue';
import bumpbtnSelect from '../components/bump/daily/bumpbtnSelect.vue';
import bumpdefectNav from '../components/bump/daily/bumpdefectNav.vue';
import bumpdefectTrendHC from '../components/bump/daily/bumpdefectTrendHC.vue';

import { UsebumpStore } from '../stores/bump/daily/bumpFetch.js';
import { UsebumpTableStore } from '../stores/bump/daily/bumpTableSet.js';
import { UseHCStore } from '../stores/bump/daily/bumpHCSet.js';
import { UseTrendStore } from '../stores/bump/daily/bumpTrendSet.js'

const usebumpstore = UsebumpStore(pinia);
const { bumpfetchData } = usebumpstore;
const { tableData } = storeToRefs(usebumpstore);

const usetablestore = UsebumpTableStore(pinia);
const { slicefilterAry, filterTotaltableData, partRecord } = storeToRefs(usetablestore);

const usehcstore = UseHCStore(pinia);
const { machineData, radioItem } = storeToRefs(usehcstore);


const usetrendstore=UseTrendStore(pinia);
const { selectStatus } = storeToRefs(usetrendstore);

watch(machineData, (newval, oldval) => {
    console.log('machineData', newval, oldval)
});




onMounted(() => {
    bumpfetchData();
});
onBeforeUnmount(() => {
    // partRecord.value='';
    tableData.value = [];
});

</script>

<style  scoped>


.title,
.sub {
    width: 100%;
    /* margin-top: -50px;
    height: 90px; */
    display: flex;
    justify-content: center;
    font-size: 36px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    color: #2a2a2a;
}

.title>h1 {
    font-size: 36px;
    margin: 0;
}


.sub {
    color: black;
    font-size: 18px;
}

.hclayout {
    width: 1200px;
    display: flex;
    /* justify-content: center; */
    flex-wrap: wrap;
    margin: 0 auto;
}

.radio {
    margin-left: 20px;
}

.trend {
    display: flex;
    justify-content: center;
    
}


</style>