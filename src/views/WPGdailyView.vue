<template>
    <div>
        <wpgDevice/>
        <wpgPick/>
        <div class="title">
            <p>WPG Daily Low Yield</p>
        </div>
        <div class="sub">
            <p>下列預設為YIP當日晨會WPG Trigger批號,如要查詢過往資料,下列條件選擇後,在點選查詢即可</p>
        </div>
        <wpgTime/>
        <wpgitemSelect/>
        <wpgHC v-if="filterTotaltableData.length>0"/>
        <wpgTable/>
        <wpgbtnSelect/>
    </div>
</template>

<script setup>
import { watch, onMounted, onUnmounted, onBeforeUnmount } from 'vue';
import pinia from "@/stores/index.js";
import { storeToRefs } from 'pinia';

import wpgDevice from '../components/wpg/daily/wpgDevice.vue'
import wpgTime from '../components/wpg/daily/wpgTime.vue';
import wpgPick from '../components/wpg/daily/wpgPick.vue';
import wpgitemSelect from '../components/wpg/daily/wpgitemSelect.vue';
import wpgHC from '../components/wpg/daily/wpgHC.vue';
import wpgTable from '../components/wpg/daily/wpgTable.vue'
import wpgbtnSelect from '../components/wpg/daily/wpgbtnSelect.vue';

import {UsewpgStore} from '../stores/wpg/daily/wpgFetch.js';
import {UsewpgTableStore} from '../stores/wpg/daily/wpgTableSet.js'

const usewpgstore=UsewpgStore(pinia);
const {wpgfetchData}=usewpgstore;
const {tableData}=storeToRefs(usewpgstore);

const usetablestore=UsewpgTableStore(pinia);
const {slicefilterAry,filterTotaltableData,partRecord}=storeToRefs(usetablestore);


onMounted(()=>{
    wpgfetchData();
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
</style>