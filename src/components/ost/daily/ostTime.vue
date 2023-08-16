<template>
    <div class="btn">
        <n-date-picker v-model:value="range" type="datetimerange" clearable />
        <n-button strong secondary type="warning" @click="clickHandler">查詢</n-button>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import {storeToRefs}from 'pinia'
import pinia from'../../../stores/index.js';

import { NDatePicker,NButton} from 'naive-ui'

import {UseostStore}from '../../../stores/ost/daily/ostFetch.js'

const useoststore=UseostStore(pinia);
const {ostfetchData}=useoststore;
const {ost_params}=storeToRefs(useoststore);

const now=new Date();
const yesterdata=new Date(now);
yesterdata.setDate(now.getDate()-1);////-1

now.setHours(8,0,0,0);
yesterdata.setHours(8,0,0,0);

const nowTimestamp=now.getTime();
const yesterdataTimestamp=yesterdata.getTime();

const range=ref([ yesterdataTimestamp,nowTimestamp]);////range要跟pinia上的fetch api

ost_params.value.st = range.value[0];///aoi_params 從fetch 傳進=>預設綁定
ost_params.value.et = range.value[1];

const clickHandler = () => {
    ost_params.value.st = range.value[0];
    ost_params.value.et = range.value[1];
    ostfetchData();
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