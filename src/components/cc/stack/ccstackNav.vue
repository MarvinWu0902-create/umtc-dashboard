<template>
    <div>
        <ul>
            <li v-for="part of partData" :key="part">
                <a 
                :class="{ activePart: part === navpartRecord }" 
                href="javascript:void(0);" 
                @click="clickHandler(part)"
                >
                {{ part}}
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js';

import { UseccstackStore } from '../../../stores/cc/stack/ccstackFetch.js';

const useccstackstore = UseccstackStore(pinia);
const { getccstackData } = useccstackstore;
const { partData, navpartRecord } = storeToRefs(useccstackstore);

const clickHandler = (part) => {
    navpartRecord.value = part;
    getccstackData(part);
};


</script>

<style  scoped>
ul {
    list-style: none;
    width: 1100px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
}

ul li {
    margin: 3px 3px;
}

a {
    box-sizing: border-box;
    width: 70px;
    display: block;
    padding: 3px 0;
    text-align: center;
    text-decoration: none;
    font-weight: 700;
    color: #adb5bd;
    border: 2px solid #EAF0ED;
    border-radius: 3px;
}
.activePart {
    color: #024792;
    border: 2px solid #024792;
};


</style>