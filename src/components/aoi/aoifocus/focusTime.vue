<template>
    <div class="btn">
        <n-date-picker v-model:value="range" type="datetimerange" clearable />
        <n-button strong secondary type="warning" @click="clickHandler">查詢</n-button>
    </div>
</template>

<script setup>
import {ref} from 'vue';
import { NDatePicker,NButton} from 'naive-ui'

import { storeToRefs } from "pinia";
import pinia from "@/stores/index.js";
import {UseaoiFocus} from '@/stores/aoi/aoifocus/aoiFocusFetch.js'

const useaoifocus=UseaoiFocus(pinia);
const {aoifocusfetchData}=useaoifocus;
const  {aoi_params} =storeToRefs(useaoifocus);

const now=new Date();
const yesterdata=new Date(now);
yesterdata.setDate(now.getDate()-1);

now.setHours(8,0,0,0);
yesterdata.setHours(8,0,0,0);

const nowTimestamp=now.getTime();
const yesterdataTimestamp=yesterdata.getTime();

const range=ref([ yesterdataTimestamp,nowTimestamp]);////range要跟pinia上的fetch api

aoi_params.value.st = range.value[0];///aoi_params 從fetch 傳進=>預設綁定
aoi_params.value.et = range.value[1];


const clickHandler = () => {
    aoi_params.value.st = range.value[0];///點擊傳到aoi_params
    aoi_params.value.et = range.value[1];
    aoifocusfetchData();
};
</script>

<style scoped>
.btn{
    display: flex;
    justify-content:center;
    align-items: center;
    /* margin-right: 10px; */
    margin-right: -45px;
    
}
.n-date-picker{
    width: 50%;
    margin: 10px;
}
</style>