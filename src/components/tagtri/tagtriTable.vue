<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th>料號</th>
                    <th v-if="paramsProcess === 'aoi'">層別</th>
                    <th>Target</th>
                    <th>Trigger</th>
                    <th></th>
                </tr>
            </thead>
            <tbody v-if="paramsProcess === 'aoi'">
                <tr v-for="eachData of tableData">
                    <td>{{ eachData.PartNum }}</td>
                    <td>{{ eachData.LayerName }}</td>
                    <td><input type="text" :value="eachData.Target" @input="inputEvent(eachData, $event)"></td>
                    <td><input type="text" :value="eachData.Triger" @input="inputEvent(eachData, $event)"></td>
                    <td>
                        <NIcon :component="CloseCircle" :depth="2" size="20" class="icon-color"
                            @click="deleteClick(eachData)" />
                    </td>
                </tr>
                <tr v-if="tableData.length === 0">
                    <td colspan="5">沒有資料</td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr v-for="eachData of tableData">
                    <td>{{ eachData.ShortPart }}</td>
                    <td><input type="text" v-model="eachData.Target"></td>
                    <td><input type="text" v-model="eachData.Triger"></td>
                    <td>
                        <NIcon :component="CloseCircle" :depth="2" size="20" class="icon-color"
                            @click="deleteClick(eachData)" />
                    </td>
                </tr>
                <tr v-if="tableData.length === 0">
                    <td colspan="4">沒有資料</td>
                </tr>
            </tbody>
        </table>
        <n-button @click="uploadClick" strong secondary round type="error">
            上傳
        </n-button>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import pinia from '../../stores/index.js';
import { NIcon, NButton } from 'naive-ui'
import { CloseCircle } from '@vicons/ionicons5';

import { UsetagtriStore } from '../../stores/tagtri/tagtriFetch.js';
import { watch } from 'vue';
const usetagtristore = UsetagtriStore(pinia);
const { tagtrifetchData,tagtriPostData } = usetagtristore;
const { paramsProcess,paramsPwd,vertifyStatus, tableData } = storeToRefs(usetagtristore);


const deleteClick = (eachRow) => {
    tableData.value = tableData.value.filter((row) =>
        row !== eachRow)
};

const inputEvent = (eachData, event) => {
    tableData.value.find((row) => row === eachData).Target = event.target.value;
};

watch(tableData, (newval, oldval) => {
    console.log('tableData', newval, oldval)
}, { deep: true });

const uploadClick=()=>{
    paramsProcess.value&&vertifyStatus.value
        ?tagtriPostData()
        :alert('是要傳去哪裡?!');
}

</script>

<style  scoped>
table {
    border-collapse: collapse;
    width: 50%;
    font-size: 12px;

    margin-left: 45%;
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

.icon-color {
    cursor: pointer;
    color: #FF3535
}

.icon-color:hover {
    color: #ff0b0b
}

.n-button{
    margin-top: 5px;
    margin-bottom: 5px;
    margin-left: 67%;
}
</style>