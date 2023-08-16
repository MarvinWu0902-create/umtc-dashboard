<template>
    <div v-if="showTable">
<table>
<thead>
    <tr class="title"><td colspan="12">Daily Summary Table</td></tr>
<tr>
    <th>PN</th>
    <th>Lots</th>
    <th>投料數量</th>
    <th>入庫數量</th>
    <th>OST</th>
    <th>Bump</th>
    <th>CC</th>
    <th>VI</th>
    <th>WPG</th>
    <th>Product</th>
    <th>Inline</th>
    <th>OAY</th>
</tr>
</thead>
<tbody>
    <template v-if="daysumData.length>0">
<tr v-for="item in daysumData">
    <td>{{ item.partnum }}</td>
    <td>{{ item.Lots }}</td>
    <td>{{ item.In_Qnty }}</td>
    <td>{{ item.Out_Qnty }}</td>
    <td>{{ (item.OST_Yield_avg*100).toFixed(2) }}%</td>
    <td>{{ (item.Bump_yield_avg*100).toFixed(2)}}%</td>
    <td>{{ (item.CC_Yield_avg*100).toFixed(2) }}%</td>
    <td>{{ (item.VI_Yield_avg*100).toFixed(2) }}%</td>
    <td>{{ (item.WPG_Yield_avg*100).toFixed(2) }}%</td>
    <td>{{ (item.Product_yield_avg*100).toFixed(2)}}%</td>
    <td>{{ (item.Inline_Yield_avg*100).toFixed(2) }}%</td>
    <td>{{ (item.OAY_yield_avg*100).toFixed(2)}}%</td>
</tr>
    </template>
    <template v-else>
<tr><td colspan="12">今日無產出</td></tr>
    </template>
</tbody>

</table>
    </div>
</template>

<script setup>
import {ref,watchEffect} from 'vue'
import { storeToRefs } from "pinia";
import pinia from "../../stores/index.js";

import { UseBtnStore } from "../../stores/Index/IndexBtn.js";
import {UseIndexFetch} from '../../stores/Index/IndexFetch.js'


const usebtnstore = UseBtnStore(pinia);
const { filterData, partList } = storeToRefs(usebtnstore);///filterData變化驅動

const useindexfetch=UseIndexFetch(pinia);
const {daysumData}=storeToRefs(useindexfetch);

const showTable=ref(false);

watchEffect(()=>{
    if (filterData.value && filterData.value.length > 0) {
        showTable.value = true;
    }
})






</script>

<style  scoped>

table {
    border-collapse: collapse;
    width: 100%;
    font-size: 12px;
}

th,
td {
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid #ddd;
}

tr:hover{
    transition: 0.5s;
    background-color: antiquewhite;
}

th {
    text-align: center;
    background-color: #f2f2f2;
    color: #333;
    font-weight: bold;
}

.title{
    background-color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 18px;
    color: #000000;
    font-weight: bolder;
    line-height: 24px;
    border:1px solid #ddd;
}
</style>