<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th>Link</th>
                    <th>PartNo</th>
                    <th>LotNo</th>
                    <th>LotType</th>
                    <th>U ball</th>
                    <th>CheckIn</th>
                    <th>CTV</th>
                    <th>CheckOut</th>
                    <th>Units</th>
                    <th>Target</th>
                    <th>Trigger</th>
                    <th>Yield</th>
                    <th>CTV</th>
                    <th>BTV</th>
                    <th>HVSB</th>
                    <th>LVSB</th>
                    <th>MB</th>
                    <th>Others</th>
                    <th>Remark</th>
                </tr>
            </thead>
            <tbody v-if="slicefilterAry.length > 0">
                <tr v-for="eachData of slicefilterAry">
                    <td> 
                        <n-button size="tiny" type="info" ghost>
                            <a  target="_blank" :href="linkhandler(eachData.partno, eachData.ULMark94V, eachData.lotno)">Link</a>
                        </n-button>
                    </td>
                    <td>{{ eachData.partno }}</td>
                    <td>{{ eachData.lotno }}</td>
                    <td>{{ eachData.lot_type }}</td>
                    <td>{{ eachData.u_ball_name }}</td>
                    <td>{{ eachData.u_ball_c }}</td>
                    <td>{{ eachData.ctv_name }}</td>
                    <td>{{ eachData.checkouttime }}</td>
                    <td>{{ eachData.units }}</td>
                    <td>{{ (eachData.Target * 100).toFixed(1) }}%</td>
                    <td>{{ (eachData.Triger * 100).toFixed(1) }}%</td>
                    <td>{{ (eachData.Yield * 100).toFixed(1) }}%</td>
                    <td><a href="#" @click="getmappingData(eachData.lotno, 'CTV')">{{ (eachData.CTV * 100).toFixed(2) }}%</a>
                    </td>
                    <td><a href="#" @click="getmappingData(eachData.lotno, 'BTV')">{{ (eachData.BTV * 100).toFixed(2) }}%</a>
                    </td>
                    <td><a href="#" @click="getmappingData(eachData.lotno, 'HVSB')">{{ (eachData.HVSB *
                        100).toFixed(2) }}%</a></td>
                    <td><a href="#" @click="getmappingData(eachData.lotno, 'LVSB')">{{ (eachData.LVSB *
                        100).toFixed(2) }}%</a></td>
                    <td><a href="#" @click="getmappingData(eachData.lotno, 'MB')">{{ (eachData.MB * 100).toFixed(2) }}%</a>
                    </td>
                    <td><a href="#" @click="getmappingData(eachData.lotno, 'Others')">{{ (eachData.Others *
                        100).toFixed(2) }}%</a></td>
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
        <div class="inner-loyout">
            <bumpmapHC :lot="lotName" :defect="binName" :xAxis="mapxAxisAry" :yAxis="mapyAxisAry" :series="seriesAry"
                v-if="seriesAry.length > 0" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia'
import { NButton } from 'naive-ui'
import pinia from '../../../stores/index.js';

import bumpmapHC from './bumpmapHC.vue';
import { UsebumpStore } from '../../../stores/bump/daily/bumpFetch.js';
import { UsebumpTableStore } from '../../../stores/bump/daily/bumpTableSet.js';

import { apiPostBumpData, apiGetBumpmappingData } from '../../../api/index.js';

const usebumpstore = UsebumpStore(pinia);
const usetablestore = UsebumpTableStore(pinia);

const { tableData, deviceData } = storeToRefs(usebumpstore);
const { filtertableData, filterTotaltableData, slicefilterAry, tableInfo } = storeToRefs(usetablestore);

const textareaValue = ref('');
const textareaLot = ref('');

const showModal = ref(false);
const showCanvas = ref(false);

const lotName = ref('');
const binName = ref('');
const mapxAxisAry = ref([]);
const mapyAxisAry = ref([]);
const seriesAry = ref([]);

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
    seriesAry.value = [];
};

const sendData = async () => {
    const postData = {
        data: textareaValue.value,
        type: 'bumpdaily',
        lot: textareaLot.value
    };
    try {
        await apiPostBumpData(postData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
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
        lotName.value = lot;
        binName.value = defect;
        const res = await apiGetBumpmappingData(lot, defect);
        console.log('res', res.data);


        const xaxisWidth = [...new Set(res.data.map((item) => Number(item.MpLtX) * 2))][0];
        mapxAxisAry.value = Array(xaxisWidth).fill(xaxisWidth).map((_, index) => index);
        const yaxisWidth = [...new Set(res.data.map((item) => Number(item.MpLtY) * 2))][0];
        mapyAxisAry.value = Array(yaxisWidth).fill(yaxisWidth).map((_, index) => index);
        ////先假設MpLtX,MpLtY不會有空的
        const haveCount = res.data
            .sort((a, b) => a.Unit_X === b.Unit_X ? a.Unit_Y - b.Unit_Y : a.Unit_X - b.Unit_X)
            .map((item) => [Number(item.Unit_X), Number(item.Unit_Y)]);
        console.log(xaxisWidth, yaxisWidth, haveCount);


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

        seriesAry.value = container;
        console.log('container', container);
    } catch (error) {
        console.log('bumpmapping error', error);
    }
}


const linkhandler = (partNumber, partName, lot) => {
    return `http://10.22.66.28:8000/InlineUball/PartLevel/${partNumber}_${partName}/LotLevel/${lot}`
};

</script>

<style  scoped>

a{
    text-decoration: none;
}
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