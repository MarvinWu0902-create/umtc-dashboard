<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th v-for="eachColumn of saveColumn" :key="eachColumn.title" @click="columnClick(eachColumn)">
                        {{ eachColumn.title }}
                        <div class="icon-loyout">
                            <NIcon :component="ArrowUp" :depth="eachColumn.up" />
                            <NIcon :component="ArrowDown" :depth="eachColumn.down" />
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody v-if="tableData.length > 0">
                <tr v-for="eachRow of tableData" :key="eachRow.lotnum">
                    <td>{{ eachRow.PN }}</td>
                    <td>{{ eachRow.lotnum }}</td>
                    <td>{{ eachRow.LayerName }}</td>
                    <td>{{ eachRow.ProcName }}</td>
                    <td>{{ eachRow.ProcEight }}</td>
                    <td>{{ eachRow.AftStatus }}</td>
                    <td>{{ eachRow.Qnty }}</td>
                    <td>{{ eachRow.Count }}</td>
                    <td>{{ (eachRow.Qnty / eachRow.Count * 100).toFixed(1) }}%</td>
                    <td>{{ (eachRow.ChangeTime.date).substring(0, 19) }}</td>
                </tr>
            </tbody>
            <tbody v-else-if="searchStatus === true">
                <tr>
                    <td colspan="10"><n-space>
                            <n-spin size="5" stroke="gray">
                                <template #description>
                                    查詢中
                                </template>
                            </n-spin></n-space></td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="10">無資料</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import pinia from '../../stores/index.js';
import { NIcon, NSpace, NSpin } from 'naive-ui'
import { ArrowUp, ArrowDown } from '@vicons/ionicons5';

import { UsewipStore } from '../../stores/wip/wipFetch.js';


const usewipstore = UsewipStore(pinia);
const { searchStatus, tableData } = storeToRefs(usewipstore);

watch(searchStatus, (newval, oldval) => {
    console.log('searchStatus', newval, oldval);
})

const saveColumn = ref([
    { title: '料號', sql: 'PN', up: 5, down: 5, order: false },
    { title: '批號', sql: 'lotnum', up: 5, down: 5, order: false },
    { title: '層別', sql: 'LayerName', up: 5, down: 5, order: false },
    { title: '站點(6碼)', sql: 'ProcName', up: 5, down: 5, order: false },
    { title: '站點(8碼)', sql: 'ProcEight', up: 5, down: 5, order: false },
    { title: '狀態', sql: 'AftStatus', up: 5, down: 5, order: false },
    { title: '目前顆數', sql: 'Qnty', up: 5, down: 5, order: false },
    { title: '總顆數', sql: 'Count', up: 5, down: 5, order: false },
    { title: '良率', sql: 'Yield', up: 5, down: 5, order: false },
    { title: '時間', sql: 'ChangeTime', up: 5, down: 5, order: false },
]);




const columnClick = (column) => {
    column.order = !column.order;
    if (column.order === true) {
        column.up = 5;
        column.down = 2;

        column.sql === 'ChangeTime'
            ? tableData.value = tableData.value.sort((a, b) => new Date(a[column.sql].date).getTime() - new Date(b[column.sql].date).getTime())
            : tableData.value = tableData.value.sort((a, b) => a[column.sql] - b[column.sql]);

    } else {
        column.up = 2;
        column.down = 5;
        column.sql === 'ChangeTime'
            ? tableData.value = tableData.value.sort((a, b) => new Date(b[column.sql].date).getTime() - new Date(a[column.sql].date).getTime())
            : tableData.value = tableData.value.sort((a, b) => b[column.sql] - a[column.sql]);
    }
};



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

tr:hover {
    transition: 0.5s;
    background-color: antiquewhite;
}

th {
    text-align: center;
    background-color: #5ab5ff91;
    color: #333333;
    font-weight: bold;
    cursor: pointer;
}

.icon-loyout {
    display: flex;
    flex-wrap: wrap;
    display: inline;
}

.n-icon {
    width: 10px;
}

.n-space {
    justify-content: center !important;
}
</style>