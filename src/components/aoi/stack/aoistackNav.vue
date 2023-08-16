<template>
    <div>
        <ul>
            <li v-for="part of partData" :key="part">
                <a 
                :class="{ activePart: part === navpartRecord }" 
                href="javascript:void(0);" 
                @click="clickHandler(part)">
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


import { UseaoistackStore } from '../../../stores/aoi/aoistack/aoistackFetch.js';

const useaoistackstore = UseaoistackStore(pinia);

const { getaoistackData } = useaoistackstore;
const { partData, navpartRecord, radioItem } = storeToRefs(useaoistackstore);


const clickHandler = (part) => {
    navpartRecord.value = part;
    getaoistackData(radioItem.value, part);
};

</script>

<style  scoped>
ul {
    list-style: none;
    width: 1100px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-left: 20px;
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