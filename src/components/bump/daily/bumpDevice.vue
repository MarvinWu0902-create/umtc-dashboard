<template>
    <div class="layout">
        <button 
        :class="{ active: deviceRecord === eachDevice.type }" 
        @click="btnClick(eachDevice.type)"
        v-for="eachDevice of deviceData"
        >
        {{ eachDevice.type }}({{ deviceCount[eachDevice.type] }})
    </button>
    </div>
</template>

<script setup>
import {ref, watch,computed,onUnmounted} from 'vue';
import {storeToRefs}from 'pinia'
import pinia from'../../../stores/index.js';

import {UsebumpStore } from '../../../stores/bump/daily/bumpFetch.js';
import { UsebumpTableStore}from '../../../stores/bump/daily/bumpTableSet.js'

const usebumpstore=UsebumpStore(pinia);
const {tableData,deviceData,deviceCount}=storeToRefs(usebumpstore);

const usetablestore=UsebumpTableStore(pinia);
const {deviceRecord,curPage}=storeToRefs(usetablestore);



const btnClick=(device)=>{
    deviceRecord.value=device;
    curPage.value=1;
};

onUnmounted(()=>{
    deviceRecord.value='Client';
});

</script>

<style  scoped>
.layout{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 15px;
    border-bottom: 1px solid rgba(155, 155, 155, 0.3);
}
button{

    cursor: pointer;
    border: 0;
    background-color: #fff;

    color: rgb(186, 186, 186);
    font-size: 16px;
    font-family:Arial, Helvetica, sans-serif;
    font-weight: 700;

    width: 100px;
    height: 30px;
    margin-bottom: 1px;
    
}
button:hover {
    color: #007bff;
}
.active{
    transition: color 0.3s;
    color: #007bff;
    /* background-image: linear-gradient(rgb(4, 187, 4),rgb(4, 187, 4));
    background-position:  left bottom;
    background-size: 100% 1px;
    background-repeat: no-repeat;
    transition: background-size 0.2s linear; */
    border-bottom: 1.5px solid #007bff;
}


</style>