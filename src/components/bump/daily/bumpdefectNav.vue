<template>
    <div>
        <nav>
            <ul>
                <li v-for="item of itemList">
                    <a  :class="{ active: item === itemSelect&& selectStatus}"
                        @click="itemSelectHandler(item)"
                        href="JavaScript:void(0)">
                        {{ item }}
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import pinia from '../../../stores/index.js';

import { UseTrendStore } from '../../../stores/bump/daily/bumpTrendSet.js';
const usetrendstore = UseTrendStore(pinia);

const {gettrendData}=usetrendstore;
const { defect,selectStatus,itemSelect } = storeToRefs(usetrendstore);

import {UsebumpTableStore} from '../../../stores/bump/daily/bumpTableSet.js';
const usebumptablestore = UsebumpTableStore(pinia);

const { partRecord } = storeToRefs(usebumptablestore);




const itemList = ref(['CTV','BTV','HVSB','LVSB','MB','Others'])


const itemSelectHandler = (item) => {
    if(itemSelect.value !== item||selectStatus.value === false){

        defect.value=item;///傳給bumpTrendSet去抓資料
        itemSelect.value = item;
        selectStatus.value = true;////為有點選狀態

        gettrendData();
    }else{
        selectStatus.value = false;
    }
}
</script>

<style  scoped>
ul {
    width: 1200px;
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    margin: auto;

}

li {

    list-style: none;
    border-top: 1px solid transparent;
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
    transition: border-color 0.3s;
}

li:hover {
    border-top: 1px solid rgb(213, 213, 213);
    border-left: 1px solid rgb(213, 213, 213);
    border-right: 1px solid rgb(213, 213, 213);
    border-radius: 3px 3px 0 0
}

a {
    color: #d1d1d1;
    text-decoration: none;
    display: inline-block;
    /* height: 100%; */
    padding: 10px 10px;
}

a:hover {
    color: #007bff;
}

.active {
    color: #007bff;

    border-top: 1px solid rgb(213, 213, 213);
    border-left: 1px solid rgb(213, 213, 213);
    border-right: 1px solid rgb(213, 213, 213);
    border-radius: 3px 3px 0 0
}
</style>