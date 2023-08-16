<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th>PartNo</th>
                    <th>LotNo</th>
                    <th>LotType</th>
                    <th>CheckOut</th>
                    <th>Units</th>
                    <th>Target</th>
                    <th>Trigger</th>
                    <th>Yield</th>
                    <th>2DMatrixfail</th>
                    <th>Land3Dfail</th>
                    <th>Invalidfail</th>
                    <th>Remark</th>
                </tr>
            </thead>
            <tbody v-if="slicefilterAry.length > 0">
                <tr v-for="eachData of slicefilterAry">
                    <td>{{ eachData.PartNum }}</td>
                    <td>{{ eachData.LotNum }}</td>
                    <td>{{ eachData.LotType }}</td>
                    <td>{{ eachData.ChangeTime }}</td>
                    <td>{{ eachData.totalCount }}</td>
                    <td>{{ (eachData.Target * 100).toFixed(1) }}%</td>
                    <td>{{ (eachData.Triger * 100).toFixed(1) }}%</td>
                    <td>{{ (eachData.Yield * 100).toFixed(1) }}%</td>
                    <td>{{ (eachData['2DMatrixfail'] * 100).toFixed(2) }}%</td>
                    <td>{{ (eachData['Land3Dfail'] * 100).toFixed(2) }}%</td>
                    <td>{{ (eachData['Invalidfail'] * 100).toFixed(2) }}%</td>
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
                            100).toFixed(2) }}%</strong>
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
</template>

<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js';


import { UsewpgStore } from '../../../stores/wpg/daily/wpgFetch.js';
import { UsewpgTableStore } from '../../../stores/wpg/daily/wpgTableSet.js';

import { apiPostWPGData } from '../../../api/index.js'

const usewpgstore = UsewpgStore(pinia);
const usetablestore =UsewpgTableStore(pinia);

const { tableData, deviceData } = storeToRefs(usewpgstore);
const { filtertableData, filterTotaltableData, slicefilterAry, tableInfo } = storeToRefs(usetablestore);


const textareaValue = ref('');
const textareaLot = ref('');

const showModal = ref(false);



const modalOpen = (item) => {
    showModal.value = true;
    textareaLot.value = item.LotNum///用批號去比對
};

const modalClose = () => {
    showModal.value = false;
    textareaValue.value = '';
};



const sendData = async () => {
    const postData = {
        data: textareaValue.value,
        type: 'wpgdaily',
        lot: textareaLot.value
    };
    try {
        await apiPostWPGData(postData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        alert('上傳成功!');
        tableData.value.find((item) => item.LotNum === postData.lot)///先用TableData
            .Remark = postData.data;
        modalClose();

    } catch (error) {
        console.log('wpg post err', error);
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
</style>