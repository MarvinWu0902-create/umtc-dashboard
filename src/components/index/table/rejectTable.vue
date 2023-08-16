<template>
    <div>
        <table>
            <thead>
                <tr class="title"><td colspan="5">&#x261E;報廢紀錄</td></tr>
                <tr>
                    <th>時間</th>
                    <th>站點</th>
                    <th>顆數</th>
                    <th>單位</th>
                    <th>原因</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="eachData.length>0">
                <tr v-for="(eachitem,index) of eachData" :key="index">
                    <!-- index 不ok... -->
                    <td>{{ eachitem.time }}</td>
                    <td>{{ eachitem.eq_group}}</td>
                    <td>{{ eachitem.sqnty }}</td>
                    <td>{{ eachitem.unit}}</td>
                    <td>{{ eachitem.result}}</td>
                </tr>
            </template>
            <template v-else>
                <tr><td colspan="5">無報廢紀錄</td></tr>
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
const {rejectData} = storeToRefs(useindexfetch);

const eachData=ref([]);

const props = defineProps({
    lot: {
        type: String,
        default: "",
    }
});

eachData.value=rejectData.value.filter((item)=>
    item.lotno===props.lot
).sort((a,b)=>a.time-b.time);

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