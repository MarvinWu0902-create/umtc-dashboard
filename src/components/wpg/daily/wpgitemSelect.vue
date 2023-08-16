<template>
    <div class="showCount" >
        <!-- <div>顯示{{ ItemSelect }}項結果</div> -->
        <div class="showRow">
            <p>顯示</p><select v-model="ItemSelect">
                <option>5</option>
                <option>10</option>
                <option>15</option>
                <option>20</option>
            </select>
            <p>項結果</p>
        </div>
    </div>
</template>

<script setup>
import {storeToRefs}from 'pinia';
import pinia from '../../../stores/index.js' ;
import {UsewpgTableStore} from '../../../stores/wpg/daily/wpgTableSet.js';


const usetablestore=UsewpgTableStore(pinia);
const {filtertableData,ItemSelect}=storeToRefs(usetablestore);
</script>

<style  scoped>
.showRow{
    display: flex;
    align-items: center;
}
.showCount{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 5px;
    color: blue;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    font-size: 12px;
}
</style>