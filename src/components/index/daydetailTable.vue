<template>
    <div v-if="showTable">
        <table>
            <thead>
                <tr class="title"><td colspan="17">Daily Detail Table</td></tr>
                <tr>
                    <th>PN</th>
                    <th>LotNo</th>
                    <th>LotType</th>
                    <th>投料數量</th>
                    <th>入庫數量</th>
                    <th>狀態</th>
                    <th>開始</th>
                    <th>結束</th>
                    <th>OAY</th>
                    <th>Remark</th>
                    <th>OST</th>
                    <th>Bump</th>
                    <th>CC</th>
                    <th>VI</th>
                    <th>WPG</th>
                    <th>PY</th>
                    <th>IY</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="daydetailData.length > 0">
                    <tr v-for="item in daydetailData">
                        <td>{{ item.partnum }}</td>
                        <td>{{ item.lotnum }}</td>
                        <td>{{ item.lot_type }}</td>
                        <td>{{ item.In_Qnty }}</td>
                        <td>{{ item.Out_Qnty }}</td>
                        <td>{{ item.type }}</td>
                        <td>{{ item.Beg_Prc }}</td>
                        <td>{{ item.End_Prc }}</td>
                        <td>{{ item.OAY_yield !== '.' ? (item.OAY_yield * 100).toFixed(2) + '%' : ' ' }}</td>

                        <td>
                            <i class="fa-solid fa-pencil pointer" @click="modalOpen(item)"></i>
                            {{ item.Remark }}
                        </td>

                        <td>{{ item.OST_Yield !== '.' ? (item.OST_Yield * 100).toFixed(2) + '%' : ' ' }}</td>
                        <td>{{ item.Bump_yield !== '.' ? (item.Bump_yield * 100).toFixed(2) + '%' : ' ' }}</td>
                        <td>{{ item.CC_Yield !== '.' ? (item.CC_Yield * 100).toFixed(2) + '%' : ' ' }}</td>
                        <td>{{ item.VI_Yield !== '.' ? (item.VI_Yield * 100).toFixed(2) + '%' : ' ' }}</td>
                        <td>{{ item.WPG_yield !== '.' ? (item.WPG_yield * 100).toFixed(2) + '%' : ' ' }}</td>
                        <td>{{ item.Product_yield !== '.' ? (item.Product_yield * 100).toFixed(2) + '%' : ' ' }}</td>
                        <td>{{ item.inline_yield !== '.' ? (item.inline_yield * 100).toFixed(2) + '%' : ' ' }}</td>
                    </tr>
                </template>
                <template v-else>
                    <tr>
                        <td colspan="17">今日無產出</td>
                    </tr>
                </template>
            </tbody>
        </table>

        <transition name="fade">
            <div class='modal' v-if="showModal">
                <button class="close-btn" @click="modalClose">&times;</button>

                <div class="modalcontent">
                    <!-- <div class="backup">
                    <p>備註:</p>
                </div> -->
                    <div class="textblock">
                        <textarea name="text" id="id1" v-model="textareaValue" placeholder="請輸入備註文字..."></textarea>
                        <button @click="sendData">上傳</button>
                    </div>

                    <ncnTable :lot="textareaLot" />
                    <rejectTable :lot="textareaLot" />
                    <divTable :lot="textareaLot" />

                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { storeToRefs } from "pinia";
import pinia from "@/stores/index.js";
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css'
import ncnTable from './table/ncnTable.vue'
import rejectTable from './table/rejectTable.vue'
import divTable from './table/divTable.vue'
import {apiPostOAYData}  from '@/api/index.js'


import { UseBtnStore } from "@/stores/Index/IndexBtn.js";
// import { UseIndexFetch } from '../../stores/Index/IndexFetch.js'
import { UseIndexFetch } from '@/stores/Index/IndexFetch.js'

///../stores/Index/IndexBtn.js
const usebtnstore = UseBtnStore(pinia);
const { filterData, partList } = storeToRefs(usebtnstore);///filterData變化驅動

const useindexfetch = UseIndexFetch(pinia);
const { daydetailData } = storeToRefs(useindexfetch);

const showTable = ref(false);
const showModal = ref(false);
const textareaValue = ref('');
const textareaLot = ref('');
console.log('test', textareaLot.value)

const modalOpen = (item) => {
    showModal.value = true;
    textareaLot.value = item.lotnum
}
const modalClose = () => {
    showModal.value = false;
    textareaValue.value = '';
}
const sendData = async () => {
    const postData = {
        data: textareaValue.value,
        type: 'oay',
        lot: textareaLot.value
    }
    try {//http://localhost:88
        // await axios.post('http://localhost:88/upload.php',
        //     postData
        //     ,
        //     {
        //         headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded'
        //         }
        //     }
        // );
        await apiPostOAYData(postData,{headers:{'Content-Type': 'application/x-www-form-urlencoded'}});
        alert('上傳成功!');
        daydetailData.value.find((item) => item.lotnum === postData.lot)
            .Remark = postData.data
        modalClose();
    } catch (error) {
        console.log('err', error);
    }
};

watchEffect(() => {
    if (filterData.value && filterData.value.length > 0) {
        showTable.value = true;
    }
})






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

.modal {
    width: 80%;
    height: 90%;
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

/* .backup{
    width: 10%;
}
.backup > p {
    margin-left: 30%;
} */
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
    margin-left: 12%;
}

/* 可能要改，有點醜 */


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

.title{
    background-color: #ffffff;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 18px;
    color: #000000;
    font-weight: bolder;
    line-height: 24px;
    border:1px solid #ddd;
}
</style>