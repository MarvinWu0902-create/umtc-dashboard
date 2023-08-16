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
import { UsefliFetch } from '@/stores/fli/fliFetch.js';


const useflifetch = UsefliFetch(pinia);

const {flifetchData}=useflifetch;
const {fli_params}=storeToRefs(useflifetch);

const now=new Date();
const yesterdata=new Date(now);
yesterdata.setDate(now.getDate()-1);

now.setHours(8,0,0,0);
yesterdata.setHours(8,0,0,0);

const nowTimestamp=now.getTime();
const yesterdataTimestamp=yesterdata.getTime();

const range=ref([ yesterdataTimestamp,nowTimestamp]);////range要跟pinia上的fetch api

fli_params.value.st = range.value[0];///一開始傳到aoi_params
fli_params.value.et = range.value[1];

const clickHandler = () => {
    fli_params.value.st = range.value[0];///點擊傳到aoi_params
    fli_params.value.et = range.value[1];
    flifetchData();
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