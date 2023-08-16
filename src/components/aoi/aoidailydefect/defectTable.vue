<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th v-if="activeDefect === 'BU A5+A6'">Link</th>
                    <th>批號</th>
                    <!-- <th @click="columnClick('PN')">PN
                        <div class="icon-loyout">
                            <NIcon :component="ArrowUp" :size="8" :depth="saveColumn.filter((item)=>item.title==='PN').up" />
                            <NIcon :component="ArrowDown" :size="8" :depth="saveColumn.filter((item)=>item.title==='PN').down" />
                        </div>
                    </th> -->
                    <th>料號</th>
                    <th>Type</th>
                    <th>層別</th>
                    <!-- <th @click="columnClick('FB')">FB
                        <div class="icon-loyout">
                            <NIcon :component="ArrowUp" :size="8" :depth="saveColumn.filter((item)=>item.title==='FB').up" />
                            <NIcon :component="ArrowDown" :size="8" :depth="saveColumn.filter((item)=>item.title==='FB').down" />
                        </div>
                    </th> -->
                    <th>FB</th>
                    <th v-for="columnitem of renderColumn.title">{{ columnitem }}</th>
                    <th>Yield</th>
                    <th>Panel Distribution</th>
                    <th>Panel mapping</th>
                </tr>
            </thead>
            <tbody v-if="tableData.length > 0">
                <tr v-for="eachData of tableData">
                    <td v-show="activeDefect === 'BU A5+A6'">
                        <n-button size="tiny" type="info" ghost>
                        <a class="link" target="_blank" :href="A5A6Link(eachData.LotNum, eachData.LayerName)">Link</a>
                        </n-button>
                    </td>
                    <td>{{ eachData.LotNum }}</td>
                    <td>{{ eachData.PartNo }}</td>
                    <td>{{ eachData.LotType }}</td>
                    <td>{{ eachData.LayerName }}</td>
                    <td>{{ eachData.LayerName !== '-Outer' ? ((eachData.LayerName.split('L')[2] - eachData.LayerName.split('L')[1]) + 1) / 2 + 'FB' : '-Outer' }}
                    </td>
                    <td v-for="columnitem of renderColumn.column">
                        {{
                            columnitem.substring(0, 1) === 'M' || columnitem.substring(0, 1) === 'T' || columnitem.substring(0, 1) === 'C' || columnitem.substring(0, 1) === 'B'
                            ? eachData[columnitem]
                            : eachData[columnitem] === '.'///如果是空值
                                ? '0%'
                                : eachData[columnitem]===' '
                                    ?' '
                                    :(Number(eachData[columnitem]) * 100).toFixed(2) + '%'
                        }}
                    </td>
                    <td>{{ (Number(eachData.Bef_Yield) * 100).toFixed(1) }}%</td>
                    <td><img :src="PanelDistributionUrl(activeDefect.replace(/\s|\//g,'_'),eachData.LotNum,eachData.LayerName)" class="img-distribution" alt=""></td>
                    <td><img :src="PanelMappingUrl(activeDefect.replace(/\s|\//g,'_'),eachData.LotNum,eachData.LayerName)" class="img-mapping" alt=""></td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td :colspan=colLength>沒有超過Trigger資料</td>
                </tr>
            </tbody>
        </table>


        <table class="mec-table" v-if="activeDefect==='BU A3+A4+A7'&&tableData.length > 0" >
            <!-- &&tableData.findIndex((item)=>item.ProdClass==='EMIB')!==-1 -->
            <thead>
                <tr>
                    <th>LotNum</th>
                <th>PN</th>
                <th>Lot_Type</th>
                <th>LayerName</th>
                <th>FB</th>
                <th>MachineABFMEC1</th>
                <th>TimeABFMEC1</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="eachData of tableData.filter((item)=>item.ProdClass==='EMIB'&&((item.LayerName.split('L')[2] - item.LayerName.split('L')[1]) + 1) / 2===2)">
                    <td>{{ eachData.LotNum }}</td>
                    <td>{{ eachData.PartNo }}</td>
                    <td>{{ eachData.LotType }}</td>
                    <td>{{ eachData.LayerName }}</td>
                    <td>2FB</td>
                    <td>{{ eachData['MachineABFMEC1'] }}</td>
                    <td>{{ eachData['TimeABFMEC1']  }}</td>

                </tr>
            </tbody>
            <tbody v-if="tableData.filter((item)=>item.ProdClass==='EMIB'&&((item.LayerName.split('L')[2] - item.LayerName.split('L')[1]) + 1) / 2===2).length===0">
                <td colspan="7">沒有EMIB 2FB 超過Trigger資料</td>
            </tbody>

        </table>
    </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import pinia from "@/stores/index.js";
import {NButton,NIcon, NSpace, NSpin} from 'naive-ui'
import { ArrowUp, ArrowDown } from '@vicons/ionicons5';

import { UsedefectTable } from '../../../stores/aoi/aoidailydefect/defectTableSet.js'
const usedefecttable = UsedefectTable(pinia);
const { tableData, renderColumn, matchList } = storeToRefs(usedefecttable);

import { UsedefectFetch } from '../../../stores/aoi/aoidailydefect/defectFetch.js';
const usedefectfetch = UsedefectFetch(pinia);
const { primevalData,activeDefect, activeProcess } = storeToRefs(usedefectfetch);

watch(tableData, (newval, oldval) => {
    console.log('tableData', newval, oldval)
});

watch(renderColumn, (newval, oldval) => {
    console.log('renderColumn', newval, oldval);
});

watch(matchList, (newval, oldval) => {
    console.log('matchList', newval, oldval);
});

const colLength = computed(() => {
    return 9 + renderColumn.value.column.length
});

const A5A6Link = (lot, layer) => {

    let date = new Date();
    let year = date.getFullYear();

    let month = (date.getMonth() + 1)<10?'0'.concat(String(date.getMonth() + 1)):date.getMonth() + 1;
    let day = (date.getDate())<10?'0'.concat(String(date.getDate())):date.getDate();
    let today=year+'-'+month+'-'+day;
    
    return `http://10.22.94.222/AOI_Daily_Low_Yield_ByDefect/${today}/A5A6/${lot}_${layer}.html`
};

const PanelDistributionUrl=(defect,lot,layer)=>{
    return `http://10.22.94.222/AOI_Daily_Low_Yield_ByDefect/GFA/${defect}_${lot}_${layer}_Stack_Bar.png`
}

const PanelMappingUrl=(defect,lot,layer)=>{
    return `http://10.22.94.222/AOI_Daily_Low_Yield_ByDefect/GFA/${defect}_${lot}_${layer}_Panel_Mapping.png`
}

// const saveColumn = ref([
//     { title: 'PN', sql: 'PartNo', up: 5, down: 5, order: false },
//     { title: 'FB', sql: 'LayerName', up: 5, down: 5, order: false }
// ]);
// watch(primevalData,(newval,oldval)=>{
//     console.log('primevalData try',newval,oldval)
// });
// const columnClick = (column) => {

//     let orderData=saveColumn.value.filter((item)=>item.title===column)[0];
//     console.log('orderData',orderData);
//     orderData.order=!orderData.order;
//     console.log('orderData2',orderData);
//     if (orderData.order === true) {
//         orderData.up = 5;
//         orderData.down = 2;


//         console.log('sort',primevalData.value.sort((a, b) => {
//             console.log('a',(a[orderData.sql]!=='-Outer'?((Number(a[orderData.sql].split('L')[2])-Number(a[orderData.sql].split('L')[1]))+1)/2:100));
//             console.log('b',(b[orderData.sql]!=='-Outer'?((Number(b[orderData.sql].split('L')[2])-Number(b[orderData.sql].split('L')[1]))+1)/2:100))
//         }));
        
//         orderData.sql === 'LayerName'
//             ? primevalData.value = primevalData.value.sort((a, b) => (a[orderData.sql]!=='-Outer'?((Number(a[orderData.sql].split('L')[2])-Number(a[orderData.sql].split('L')[1]))+1)/2:100) - (b[orderData.sql]!=='-Outer'?((Number(b[orderData.sql].split('L')[2])-Number(b[orderData.sql].split('L')[1]))+1)/2:100))
//             : primevalData.value = primevalData.value.sort((a, b) => a[orderData.sql] - b[orderData.sql]);

//     } else {
//         orderData.up = 2;
//         orderData.down = 5;
//         orderData.sql === 'LayerName'
//             ? primevalData.value = primevalData.value.sort((a, b) => b[orderData.sql]!=='-Outer'?((b[orderData.sql].split('L')[2]-b[orderData.sql].split('L')[2])+1)/2:100 - b[orderData.sql]!=='-Outer'?((a[orderData.sql].split('L')[2]-a[orderData.sql].split('L')[2])+1)/2:100)
//             : primevalData.value = primevalData.value.sort((a, b) => b[orderData.sql] - a[orderData.sql]);
//     }
// };
//有空處理排序


</script>

<style  scoped>
table {
    border-collapse: collapse;
    width: 100%;
    font-size: 12px;
    margin-bottom: 10px;
}

th,
td {
    padding: 8px 0;
    text-align: center;
    border: 1px solid #ddd;
    font-weight: 700;
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

/* EMIB 2FB MEC */
.mec-table{
    width: 500px;
}
.mec-table th{
    background-color: #7c8bef;
    color: #fff;
}

.link{
    text-decoration: none;
}
.img-distribution,.img-mapping{
    width: 80px;
}
.img-distribution:hover{
    transition: .5s;
    transform: scale(6,6);
    transform-origin: center right;

}
.img-mapping:hover{
    transition: .5s;
    transform: scale(4,4);
    transform-origin: center right;

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