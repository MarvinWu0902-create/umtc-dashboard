<template>
    <div>
        <table>
            <thead>
                <tr><td colspan="3">{{machine}}</td></tr>
                <tr>
                    <th>Action</th>
                    <th>Rate</th>
                    <th>Lot</th>
                </tr>
                <!-- <tr v-for="eachRow of tableData"><th>{{eachRow.label}}</th></tr> -->
            </thead>
            <tbody>
                <tr v-for="eachRow of tableData">
                    <td>{{ eachRow.label }}</td>
                    <td>{{ eachRow.data.filter((item)=>item[`${params.process}`]===machine).length===0?'-':(eachRow.data.filter((item)=>item[`${params.process}`]===machine).map((item)=>Number(item.Rate)).reduce((a,b)=>a+b,0)/eachRow.data.filter((item)=>item[`${params.process}`]===machine).length).toFixed(2)+'%' }}</td>
                    <td>{{  (eachRow.data.filter((item)=>item[`${params.process}`]===machine).length)}}</td>
                </tr>
                <!-- SMK1VDF1 -->
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js';
import * as XLSX from 'xlsx'

import { UseviStore } from '../../../stores/vi/trend/vitrendFetch.js';


const usevistore = UseviStore(pinia);
const { trendData, actionData, params, insertStatus,categoriesAry,plotAry,container,tableData } = storeToRefs(usevistore);


// const partTable=computed(()=>{
//     tableData.value.forEach((item)=>item.data)

//     return 
// })
const prorps=defineProps({
    machine:{
        type:String
    }
})

</script>

<style scoped>
table {
    border-collapse: collapse;
}
th,
td {
    padding: 8px;
    text-align: center;
    border: 1px solid #ddd;
}
th {
    text-align: center;
    background-color: #f2f2f2;
    color: #1b32ff;
    font-weight: bold;
}
</style>