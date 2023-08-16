<template>
    <div>
        <table>
            <thead>
                <tr class="title"><td colspan="5">&#x261E;NCN紀錄</td></tr>
                <tr>
                    <th>NCN no.</th>
                    <th>時間</th>
                    <th>Defect</th>
                    <th>內容</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="eachData.length>0">
                <tr v-for="eachitem of eachData" :key="eachitem.ncn_no">
                    <td>{{ eachitem.ncn_no }}</td>
                    <td>{{ eachitem.open_datetime}}</td>
                    <td>{{ eachitem.Failure_mode }}</td>
                    <td>{{ eachitem.Problem_des }}</td>
                </tr>
            </template>
            <template v-else>
                <tr><td colspan="5">無NCN紀錄</td></tr>
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
const {ncnData} = storeToRefs(useindexfetch);

const eachData=ref([]);

const props = defineProps({
    lot: {
        type: String,
        default: "",
    }
});

eachData.value=ncnData.value.filter((item)=>
    item.lot_no===props.lot
).sort((a,b)=>b.open_datetime-a.open_datetime);

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