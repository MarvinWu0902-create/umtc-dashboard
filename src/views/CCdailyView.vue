<template>
    <div>
        <ccDevice/>
        <ccPick/>
        <div class="title">
            <p>CC Daily Low Yield</p>
        </div>
        <div class="sub">
            <p>下列預設為YIP當日晨會CC Trigger批號,如要查詢過往資料,下列條件選擇後,在點選查詢即可</p>
        </div>
        <ccTime/>
        <ccRadio/>
        <!-- 要補上hc 參考BumpdailyView-->
        <div :class="{ hclayout: machineData.data.length > 1 }" v-if="filterTotaltableData.length > 0 && radioItem === 'machine'">
            <!-- ^ filterTotaltableData.length {hclayout:machineData.data.length>1}-->
            <ccHC v-for="eachmac of machineData.data" :machine="eachmac" :key="machineData.part.concat(eachmac)" />
        </div>
        <div v-else-if="radioItem === 'all'">
            <ccHC />
        </div>


        <!--  -->
        <!-- <ccHC v-if="filterTotaltableData.length>0"/> -->
        <ccitemSelect/>
        <ccTable/>
        <ccbtnSelect/>
    </div>
</template>

<script setup>
import { watch, onMounted, onUnmounted, onBeforeUnmount } from 'vue';
import pinia from "@/stores/index.js";
import { storeToRefs } from 'pinia';
import { NForm, NRadioGroup, NRadio, NSpace } from 'naive-ui';

import ccDevice from '../components/cc/daily/ccDevice.vue';
import ccTime from '../components/cc/daily/ccTime.vue';
import ccPick from '../components/cc/daily/ccPick.vue';
import ccitemSelect from '../components/cc/daily/ccitemSelect.vue';
import ccHC from '../components/cc/daily/ccHC.vue';
import ccTable from '../components/cc/daily/ccTable.vue';
import ccbtnSelect from '../components/cc/daily/ccbtnSelect.vue';
import ccRadio from '../components/cc/daily/ccRadio.vue'

import {UseccStore} from '../stores/cc/daily/ccFetch.js';
import {UseccTableStore} from '../stores/cc/daily/ccTableSet.js'
import {UseHCStore} from '../stores/cc/daily/ccHCSet.js'

const useccstore=UseccStore(pinia);
const {ccfetchData}=useccstore;
const {tableData}=storeToRefs(useccstore);

const usetablestore=UseccTableStore(pinia);
const {slicefilterAry,filterTotaltableData,partRecord}=storeToRefs(usetablestore);

const usehcstore=UseHCStore(pinia);
const {radioItem,machineData}=storeToRefs(usehcstore);
onMounted(()=>{
    ccfetchData();
});
onBeforeUnmount(()=>{
    // partRecord.value='';
    tableData.value=[];
});

</script>

<style  scoped>
.title,.sub {
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

.title>p {
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
</style>