<template>
    <div v-if="showTable">
        <div class="download-layout">
            <n-button strong secondary type="Error" @click="exportExcel">Excel
                <NIcon size='16' :component="DownloadOutline" />
            </n-button>
        </div>
        <table>
            <thead>
                <tr>
                    <th v-for="eachThead in theadAry">{{ eachThead }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="eachAry in bodyAry">
                    <td v-for="eachItem in eachAry">{{ eachItem }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, watchEffect, watch, computed } from 'vue'
import { storeToRefs } from "pinia";
import pinia from "@/stores/index.js";
import * as XLSX from 'xlsx'


import { NButton, NIcon } from 'naive-ui';
import { DownloadOutline } from '@vicons/ionicons5';

import {UseIndexFetch} from '../../stores/Index/IndexFetch.js'
import { UseBtnStore } from "@/stores/Index/IndexBtn.js";
import { UseTableStore } from '@/stores/Index/hcTable.js';

const useindexfetch=UseIndexFetch(pinia);
const {Indexdata}=storeToRefs(useindexfetch);


const usebtnstore = UseBtnStore(pinia);
const { filterData, partList } = storeToRefs(usebtnstore);///filterData變化驅動

const showTable = ref(false)
const usetablestore = UseTableStore(pinia);
const { theadAry, bodyAry } = storeToRefs(usetablestore);


watchEffect(() => {
    if (filterData.value && filterData.value.length > 0) {
        showTable.value = true;
    }
})

watch(bodyAry, (newval, oldval) => {
    console.log('bodyAry', newval, oldval)
});

watch(theadAry, (newval, oldval) => {
    console.log('theadAry', newval, oldval)
});

// watch(excelhcData, (newval, oldval) => {
//     console.log('excelhcData', newval, oldval)
// });



// const exportExcel = () => {
//     const worksheet = XLSX.utils.aoa_to_sheet(bodyAry.value);
//     theadAry.value.forEach((column,index) => {
//         const cellAdress=XLSX.utils.encode_cell({r:0,c:index});
//         worksheet[cellAdress]={v:column}
//     });

//     const workbook = XLSX.utils.book_new();
//     let date = new Date();
//     let output = date.getFullYear() + '_'
//         + String(date.getMonth() + 1).padStart(2, '0') + '_'
//         + String(date.getDate()).padStart(2, '0') + '_'
//         + String(date.getHours()) + '_'
//         + String(date.getMinutes());

//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
//     XLSX.writeFile(workbook, `${output}_oayhc.xlsx`);
// };陣列用

const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(Indexdata.value);
    const workbook = XLSX.utils.book_new();
    let date = new Date();
    let output=date.getFullYear()+ '_' 
    +String(date.getMonth() + 1).padStart(2, '0')+'_'
    +String(date.getDate()).padStart(2, '0')+'_'
    +String(date.getHours())+'_'
    +String(date.getMinutes());

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${output}_oayhc.xlsx`);
};

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
    text-transform: uppercase;
}

.download-layout {
    display: flex;
    justify-content: flex-end;
}

.download-layout button {
    margin: 5px;
}
</style>