<template>
    <div>
        <table>
            <thead>
                <tr class="title"><td colspan="8">&#x261E;拆批紀錄</td></tr>
                <tr>
                    <th>時間</th>
                    <th>Item</th>
                    <th>批號</th>
                    <th>層別</th>
                    <th>原始批號</th>
                    <th>內容</th>
                    <th>BefQty</th>
                    <th>AftQty</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="eachData.length>0">
                <tr v-for="(eachitem,index) of eachData" :key="index">
                    <!-- index 不ok... -->
                    <td>{{ eachitem.BuildDate }}</td>
                    <td>{{ eachitem.Item}}</td>
                    <td>{{ eachitem.LotNum }}</td>
                    <td>{{ eachitem.LayerName }}</td>
                    <td>{{ eachitem.IssLotNum }}</td>
                    <td>{{ eachitem.Notes }}</td>
                    <td>{{ eachitem.BefQnty }}</td>
                    <td>{{ eachitem.AftQnty}}</td>
                </tr>
                </template>
                <template v-else>
                <tr><td colspan="8">無拆批紀錄</td></tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from "pinia";
import pinia from "@/stores/index.js";

import { UseIndexFetch } from '@/stores/Index/IndexFetch.js'

const useindexfetch = UseIndexFetch(pinia);
const {divData} = storeToRefs(useindexfetch);

const eachData=ref([]);

const props = defineProps({
    lot: {
        type: String,
        default: "",
    }
});

eachData.value=divData.value.filter((item)=>
    item.IssLotNum===props.lot
).sort((a,b)=>b.BuildDate-a.BuildDate
);

</script>

<style scoped>
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

tr:hover {
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
    font-size:14px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    color: #3726fb;

}
</style>