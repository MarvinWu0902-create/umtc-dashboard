<template>
    <div class="btn">
        <n-date-picker v-model:value="range" type="datetimerange" clearable />
        <n-button strong secondary type="warning" @click="clickHandler">查詢</n-button>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import {storeToRefs} from 'pinia'
import pinia from '../../../stores/index.js'

import { NDatePicker,NButton} from 'naive-ui'

import {UsebumpStore} from '../../../stores/bump/daily/bumpFetch.js';

const usebumpstore=UsebumpStore(pinia);
const {bumpfetchData}=usebumpstore;
const {bump_params}=storeToRefs(usebumpstore);

const now=new Date();
const yesterdata=new Date(now);
yesterdata.setDate(now.getDate()-1);////-1

now.setHours(8,0,0,0);
yesterdata.setHours(8,0,0,0);

const nowTimestamp=now.getTime();
const yesterdataTimestamp=yesterdata.getTime();

const range=ref([ yesterdataTimestamp,nowTimestamp]);////range要跟pinia上的fetch api

bump_params.value.st = range.value[0];///aoi_params 從fetch 傳進=>預設綁定
bump_params.value.et = range.value[1];

const clickHandler = () => {
    bump_params.value.st = range.value[0];
    bump_params.value.et = range.value[1];
    bumpfetchData();
};
</script>

<style  scoped>
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