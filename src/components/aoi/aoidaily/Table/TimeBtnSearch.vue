<template>
    <div class="btn">
<n-date-picker v-model:value="range" type="datetimerange" clearable />
<n-button strong secondary type="warning" @click="clickHandler">查詢</n-button>
    </div>
</template>

<script setup>
import { NDatePicker,NButton } from "naive-ui";
import { ref } from "vue";

import { storeToRefs } from "pinia";
import pinia from "@/stores/index.js";
import { UseaoiFetch } from '@/stores/aoi/aoidaily/aoiFetch.js';


const useaoifetch = UseaoiFetch(pinia);

const {aoifetchData}=useaoifetch;
const {aoi_params}=storeToRefs(useaoifetch);

const now=new Date();
const yesterdata=new Date(now);
yesterdata.setDate(now.getDate()-1);

now.setHours(8,0,0,0);
yesterdata.setHours(8,0,0,0);

const nowTimestamp=now.getTime();
const yesterdataTimestamp=yesterdata.getTime();

const range=ref([ yesterdataTimestamp,nowTimestamp]);////range要跟pinia上的fetch api

aoi_params.value.st = range.value[0];///一開始傳到aoi_params
aoi_params.value.et = range.value[1];

const clickHandler = () => {
    aoi_params.value.st = range.value[0];///點擊傳到aoi_params
    aoi_params.value.et = range.value[1];
    aoifetchData();
}




</script>

<style scoped>
.btn{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 10px;
}
.n-date-picker{
    width:30%;
    margin: 10px;
    
}
</style>