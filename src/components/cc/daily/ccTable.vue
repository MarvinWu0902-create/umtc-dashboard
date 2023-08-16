<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th>PartNo</th>
                    <th>LotNo</th>
                    <th>LotType</th>
                    <th>Machine</th>
                    <th>CheckOut</th>
                    <th>Units</th>
                    <th>Target</th>
                    <th>Trigger</th>
                    <th>Yield</th>
                    <th>T15</th>
                    <th>T44</th>
                    <th>Remark</th>
                </tr>
            </thead>
            <tbody v-if="slicefilterAry.length > 0">
                <tr v-for="eachData of slicefilterAry">
                    <td>{{ eachData.partno }}</td>
                    <td>{{ eachData.lotno }}</td>
                    <td>{{ eachData.lot_type }}</td>
                    <td>{{ eachData.Machine }}</td>
                    <td>{{ eachData.Time }}</td>
                    <td>{{ eachData.Unit }}</td>
                    <td>{{ (eachData.Target * 100).toFixed(1) }}%</td>
                    <td>{{ (eachData.Triger * 100).toFixed(1) }}%</td>
                    <td>{{ (eachData.Yield * 100).toFixed(1) }}%</td>
                    <td><a href="#" @click="getmappingData(eachData.lotno, 'T15')">{{ (eachData.T15 * 100).toFixed(2) }}%</a>
                    </td>
                    <td><a href="#" @click="getmappingData(eachData.lotno, 'T44')">{{ (eachData.T44 * 100).toFixed(2) }}%</a>
                    </td>
                    <td>
                        <i class="fa-solid fa-pencil pointer i-hover" @click="modalOpen(eachData)"></i>
                        {{ eachData.Remark }}
                    </td>
                </tr>
                <tr>
                    <td colspan="20">
                        產出<strong>{{ filterTotaltableData.length }}</strong>批，Trigger:<strong>{{ tableInfo.tri
                        }}</strong>批，平均良率:<strong>{{ (tableInfo.avg * 100).toFixed(1) }}%</strong>
                    </td>
                </tr>
            </tbody>
            <tbody v-else-if="slicefilterAry.length === 0 && filterTotaltableData.length !== 0">
                <tr>
                    <td colspan="20">
                        產出<strong>{{ filterTotaltableData.length }}</strong>批，平均良率:<strong>{{ (tableInfo.avg *
                            100).toFixed(1) }}%</strong>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="20">沒有資料</td>
                </tr>
            </tbody>
        </table>

        <transition name="fade">
            <div class='modal' v-if="showModal">
                <button class="close-btn" @click="modalClose">&times;</button>
                <div class="modalcontent">
                    <div class="textblock">
                        <textarea name="text" id="id1" v-model="textareaValue" placeholder="請輸入備註文字..."></textarea>
                        <button @click="sendData">上傳</button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
    <div class="canvas" v-if="showCanvas">
        <button class="close-btn" @click="canvasClose">&times;</button>
        <div class="inner-loyout" v-if="mapdataBox.length > 0">

                <ccmapHC v-for="eachpartData of mapdataBox" 
                :xAxis="mapxAxisAry" 
                :yAxis="mapyAxisAry"
                :partName="eachpartData.partName" 
                :series="eachpartData.data" 
                />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js';

import ccmapHC from './ccmapHC.vue';


import { UseccStore } from '../../../stores/cc/daily/ccFetch.js';
import { UseccTableStore } from '../../../stores/cc/daily/ccTableSet.js';

import { apiPostCCData, apiGetCCmappingData } from '../../../api/index.js'

const useccstore = UseccStore(pinia);
const usetablestore = UseccTableStore(pinia);

const { tableData, deviceData } = storeToRefs(useccstore);
const { filtertableData, filterTotaltableData, slicefilterAry, tableInfo } = storeToRefs(usetablestore);


const textareaValue = ref('');
const textareaLot = ref('');

const showModal = ref(false);
const showCanvas = ref(false);

const mapxAxisAry = ref([]);
const mapyAxisAry = ref([]);
const mapdataBox = ref([]);

const modalOpen = (item) => {
    showModal.value = true;
    textareaLot.value = item.lotno///用批號去比對
};

const modalClose = () => {
    showModal.value = false;
    textareaValue.value = '';
};

const canvasClose = () => {
    showCanvas.value = false;
    mapdataBox.value = [];
};


const sendData = async () => {
    const postData = {
        data: textareaValue.value,
        type: 'ccdaily',
        lot: textareaLot.value
    };
    try {
        await apiPostCCData(postData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        alert('上傳成功!');

        tableData.value.find((item) => item.lotno === postData.lot)///先用TableData
            .Remark = postData.data;
        modalClose();

    } catch (error) {
        console.log('err', error);
    }
};

const getmappingData = async (lot, defect) => {

    try {
        showCanvas.value = true;
        const res = await apiGetCCmappingData(lot, defect);
        console.log('resmapping', res.data);

        const partName = ['All PartNumber'].concat([...new Set(res.data.map((item) => item.partnumber))]);
        const yaxisWidth = res.data.map((item) => Number(item.MpLtX))[0];//#
        const xaxisWidth = res.data.map((item) => Number(item.MpLtY))[0];//#
        ////x y 顛倒
        mapxAxisAry.value = Array(xaxisWidth).fill(xaxisWidth).map((_, index) => index);
        mapyAxisAry.value = Array(yaxisWidth).fill(yaxisWidth).map((_, index) => index);

        ///mapdataBox
        let mappingdataAry = [];
        if(res.data.length>0){
            partName.forEach((part) => {
            let eachpartObj = {};
            const haveCount = part !== 'All PartNumber'
                ? res.data.filter((item) => item.partnumber === part)
                    .sort((a, b) => a.unit_x === b.unit_x ? a.unit_y - b.unit_y : a.unit_x - b.unit_x)
                    .map((item) => [Number(item.unit_x), Number(item.unit_y)])
                : res.data
                    .sort((a, b) => a.unit_x === b.unit_x ? a.unit_y - b.unit_y : a.unit_x - b.unit_x)
                    .map((item) => [Number(item.unit_x), Number(item.unit_y)]);


            let container = [];
            let count = 0;

            for (let x = 1; x <= xaxisWidth; x++) {
                for (let y = 1; y <= yaxisWidth; y++) {
                    if (count === haveCount.length) {
                        container.push([x, y, 0]);
                    } else {
                        let innerCount = 0;
                        if ((x === haveCount[count][0] && y === haveCount[count][1])) {
                            for (let c = 0; c < haveCount.length; c++) {
                                if (x === haveCount[c][0] && y === haveCount[c][1]) {
                                    innerCount++;
                                    count++;
                                };
                            };
                            container.push([x, y, innerCount]);
                        } else {
                            container.push([x, y, 0]);
                        }
                    }
                };
            };

            eachpartObj.partName = part;
            eachpartObj.data = container;
            mappingdataAry.push(eachpartObj);
        });

        mapdataBox.value = mappingdataAry;
        console.log('mapdataBox.value',mapdataBox.value);
        };


    } catch (error) {
        console.log('ccmapping error', error);
    }
}




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
    background-color: #f2f2f2;
    color: #333;
    font-weight: bold;
}

.i-hover {
    cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
    transition-delay: 0.2s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.modal {
    width: 40%;
    height: 40%;
    /*單純Remark */
    display: flex;
    justify-content: center;
    align-items: center;

    border: 1px solid rgb(168, 168, 168);
    border-radius: 15px;
    box-shadow: 2px 2px 3px 1px rgb(210, 210, 210);
    background-color: rgb(255, 255, 255);

    position: fixed;
    top: 50%;
    left: 55%;
    transform: translate(-50%, -50%);
    z-index: 999;

    transition: all 1s ease;
    overflow-y: auto;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.5em;
    background-color: transparent;
    border: none;
    cursor: pointer;
}

.close-btn:hover {
    color: red;
}

.modalcontent {
    width: 80%;
    height: 90%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.textblock {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
}


#id1 {
    width: 80%;
    height: 50%;
    margin-left: 12%;
}

.textblock>button {
    width: 50px;
    height: 30px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    background-color: #ddd;
    border-radius: 5px;
    border: 0px;
    margin-left: 5%;
}

.textblock>button:hover {
    color: #ffffff;
    background-color: rgb(204, 204, 204);
}

.canvas {
    width: 90%;
    height: 90%;
    /*單純Remark */
    display: flex;
    flex-wrap: wrap;
    /* justify-content: center; */
    /* align-items: center;  */

    border: 1px solid rgb(168, 168, 168);
    border-radius: 15px;
    box-shadow: 2px 2px 3px 1px rgb(210, 210, 210);
    background-color: rgb(255, 255, 255);

    position: fixed;
    top: 100px;
    top: 50%;
    left: 53%;
    transform: translate(-50%, -50%);
    z-index: 999;

    transition: all 1s ease;
    overflow-y: auto;
}

.inner-loyout {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: auto;
}



</style>