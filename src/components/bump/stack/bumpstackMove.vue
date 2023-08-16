<template>
    <div>
        <ul>
            <li v-for="defect of defectAry" :key="defect">
                <a :class="{active:defectSelect===defect}" href="javascript:void(0);" @click="defectClick(defect)">{{defect==='Yield'?'All':defect}}</a>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {storeToRefs}from 'pinia'
import pinia from '../../../stores/index.js';


import {UsebumpstackStore} from '../../../stores/bump/stack/bumpstackFetch.js';

const usebumpstackstore=UsebumpstackStore(pinia);

const {defectAry,defectSelect}=storeToRefs( usebumpstackstore);

const defectClick=(defect)=>{
    defectSelect.value=defect;
}
</script>

<style  scoped>
ul {
    display: flex;
    flex-direction: column;
    list-style: none;
}
ul li{
    margin-bottom: 5px;
}

a{  
    display: block;
    text-decoration: none;
    border: 2px solid #EAF0ED;
    width: 100px;
    box-sizing: border-box;
    padding: 5px 10px;
    text-align: center;
    border-radius: 20px;
    font-weight: 700;
    color: #adb5bd;
}
a:hover{
    border: 2px solid rgb(60, 216, 120);
    color:rgb(60, 216, 120);
}

.active{
    border: 2px solid rgb(60, 216, 120);
    color:rgb(60, 216, 120);
}
</style>