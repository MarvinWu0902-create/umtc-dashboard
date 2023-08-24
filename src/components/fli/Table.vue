<template>
    <div>
        <table class="ml-8">
            <thead>
                <tr>
                    <th>Link</th>
                    <th>Type</th>
                    <th>PN</th>
                    <th>Lot</th>
                    <th>Trigger</th>
                    <th>Yield</th>
                    <th>Top1</th>
                    <th>Rate</th>
                    <th>Top2</th>
                    <th>Rate</th>
                    <th>Top3</th>
                    <th>Rate</th>
                    <th>Remark</th>
                </tr>
            </thead>
            <tbody v-if="slicefilterAry.length > 0">
                <tr v-for="eachData of slicefilterAry">
                    <td>
                        <n-button size="tiny" type="info" ghost>
                            <a class="gfa_btn" target="_blank" :href="gfaUrl(eachData.LotNum)">Link</a>
                        </n-button>
                    </td>
                    <td>{{ eachData.LotType }}</td>
                    <td>{{ eachData.PN }}</td>
                    <td>{{ eachData.LotNum }}</td>
                    <td>{{ (eachData.Triger * 100).toFixed(1) }}%</td>
                    <td>{{ (eachData.Yield * 100).toFixed(1) }}%</td>
                    <td>
                        <a :class="{ defect: eachData.Top_1 !== ' ' }" href="#">
                            {{ eachData.Top_1 }}
                        </a>
                    </td>
                    <td>{{ eachData.Top1 !== 0 ? (eachData.Top1 * 100).toFixed(1) + '%' : ' ' }}</td>
                    <td>
                        <a :class="{ defect: eachData.Top_2 !== ' ' }" href="#">
                            {{ eachData.Top_2 }}
                        </a>
                    </td>
                    <td>{{
                        eachData.Top2 !== 0 ? (eachData.Top2 * 100).toFixed(1) + '%' : ' '  }}</td>
                    <td>
                        <a :class="{ defect: eachData.Top_3 !== ' ' }" href="#">
                            {{ eachData.Top_3 }}
                        </a>
                    </td>
                    <td>{{
                            eachData.Top3 !== 0 ? (eachData.Top3 * 100).toFixed(1) + '%' : ' '  }}</td>
                    <td>
                        <i class="fa-solid fa-pencil pointer" @click="modalOpen(eachData)"></i>
                        {{ eachData.Remark }}
                    </td>
                </tr>

                <tr>
                    <td colspan="13">
                        產出<strong>{{ filterTotaltableData.length }}</strong>批，Trigger:<strong>{{ tableInfo.tri
                        }}</strong>批，平均良率:<strong>{{ (tableInfo.avg * 100).toFixed(1) }}%</strong>
                    </td>
                </tr>

            </tbody>
            <tbody v-else-if="slicefilterAry.length === 0 && filterTotaltableData.length !== 0">
                <tr>
                    <td colspan="13">
                        產出<strong>{{ filterTotaltableData.length }}</strong>批，平均良率:<strong>{{ (tableInfo.avg *
                            100).toFixed(1) }}%</strong>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="13">沒有資料</td>
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
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { NButton } from 'naive-ui'


import pinia from "@/stores/index.js";
// import { UseaoiFetch } from '../../../../stores/aoi/aoidaily/aoiFetch.js';
import { UsefliFetch } from '@/stores/fli/fliFetch.js';///同上
import { UsefliTableSet } from '@/stores/fli/fliTableSet.js';

import '@fortawesome/fontawesome-free/css/all.css';
import { apiPostfliData } from '@/api/index.js'

const useflifetch = UsefliFetch(pinia);
// const {create_chart}=useaoifetch;///#
const { filterTable } = storeToRefs(useflifetch);

const useflitableset = UsefliTableSet(pinia);
const { filterTotaltableData,slicefilterAry,tableInfo } = storeToRefs(useflitableset);

// const usefliclassstore = UsefliClassStore(pinia);
// const { seriesDataProcess } = usefliclassstore;

const showModal = ref(false);

const textareaValue = ref('');
const textareaLot = ref('');

const modalOpen = (item) => {
    showModal.value = true;
    textareaLot.value = item.LotNum///Remark lot-layer
}
const modalClose = () => {
    showModal.value = false;
    textareaValue.value = '';
}

const sendData = async () => {
    const postData = {
        data: textareaValue.value,
        type: 'flidaily',
        lot: textareaLot.value
    };
    try {
        await apiPostfliData(postData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        alert('上傳成功!');
        filterTable.value.find((item) => item.LotNum === postData.lot)
            .Remark = postData.data;
        console.log('check',filterTable.value.find((item) => item.LotNum === postData.lot));
        
        
        modalClose();
    } catch (error) {
        console.log('err', error);
    }
};


const gfaUrl = (LotNum) => {
    return `http://10.22.94.222/FLI_Daily_Low_Yield/${LotNum}/index.html`
}




</script>

<style scoped>
.defect {
    display: block;
    text-decoration: none;
    color: #fff;
    font-weight: 700;
    background-color: rgb(83 148 240);
    border-radius: 3px;
    padding: 3px;
    width: 40px;
    margin: 0 auto;
}

;


.ml-8 {
    margin-left: 8px;
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

.pointer {
    cursor: pointer;
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

.trendCanvas {
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

.innerCanvas {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin: 30px
}

;

.innerCanvas>div {
    width: 30%;
}


.modalcontent {
    width: 80%;
    height: 90%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
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

.gfa_btn {
    text-decoration: none;
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

/* 滑鼠移過關閉按鈕時的樣式 */
.close-btn:hover {
    color: red;
}

.pointer {
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
</style>