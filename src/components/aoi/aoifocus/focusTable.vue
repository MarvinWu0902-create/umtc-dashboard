<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th>Link</th>
                    <th>Type</th>
                    <th>PN</th>
                    <th>Lot</th>
                    <th>Layer</th>
                    <th>Trigger</th>
                    <th>Target</th>
                    <th>Yield(R)</th>
                    <th>Yield</th>
                    <th>C Top1</th>
                    <th>Rate</th>
                    <th>C Top2</th>
                    <th>Rate</th>
                    <th>C Top3</th>
                    <th>Rate</th>
                    <th>S Top1</th>
                    <th>Rate</th>
                    <th>S Top2</th>
                    <th>Rate</th>
                    <th>S Top3</th>
                    <th>Rate</th>
                    <th>Remark</th>
                </tr>
            </thead>
            <tbody v-if="slicefilterAry.length>0">
                <tr v-for="eachData of slicefilterAry">
                    <td>
                        <n-button size="tiny" type="info" ghost>
                            <a class="gfa_btn" target="_blank" :href="gfaUrl(eachData.LotNum, eachData.Layer)">Link</a>
                        </n-button>
                    </td>
                    <td>{{ eachData.LotType }}</td>
                    <td>{{ eachData.PartNo }}</td>
                    <td>{{ eachData.LotNum }}</td>
                    <td>{{ eachData.Layer!='-Outer'?(((parseInt(eachData.Layer.split('L')[2])-parseInt(eachData.Layer.split('L')[1]))+1)/2)+'FB':'Outer' }}</td>
                    <td>{{ (eachData.Triger*100).toFixed(1) }}%</td>
                    <td>{{ (eachData.Target*100).toFixed(1) }}%</td>
                    <td  :style="yieldColor(eachData.Target,eachData.Triger,eachData.Yield)">{{ (eachData.Yield*100).toFixed(1) }}%</td>
                    <td  :style="yieldColor(eachData.Target,eachData.Triger,eachData.Bef_Yield)">{{ (eachData.Bef_Yield*100).toFixed(1) }}%</td>
                    <td>
                        <a :class="{ defect: eachData.C_TOP_1 !== ' ' }" href="#"
                            @click="aoifetchtrendData(eachData.C_TOP_1, eachData.PartNo, eachData.Layer, eachData.LotNum, 'ctop1')">
                            {{ eachData.C_TOP_1 }}
                        </a>
                    </td>
                    <td>{{ eachData.C_TOP1 }}</td>
                    <td>
                        <a :class="{ defect: eachData.C_TOP_2 !== ' ' }" href="#"
                            @click="aoifetchtrendData(eachData.C_TOP_2, eachData.PartNo, eachData.Layer, eachData.LotNum, 'ctop2')">
                            {{ eachData.C_TOP_2 }}
                        </a>
                    </td>
                    <td>{{ eachData.C_TOP2 }}</td>
                    <td>
                        <a :class="{ defect: eachData.C_TOP_3 !== ' ' }" href="#"
                            @click="aoifetchtrendData(eachData.C_TOP_3, eachData.PartNo, eachData.Layer, eachData.LotNum, 'ctop3')">
                            {{ eachData.C_TOP_3 }}
                        </a>
                    </td>
                    <td>{{ eachData.C_TOP3 }}</td>
                    <td>
                        <a :class="{ defect: eachData.S_TOP_1 !== ' ' }" href="#"
                            @click="aoifetchtrendData(eachData.S_TOP_1, eachData.PartNo, eachData.Layer, eachData.LotNum, 'stop1')">
                            {{ eachData.S_TOP_1 }}
                        </a>
                    </td>
                    <td>{{ eachData.S_TOP1 }}</td>
                    <td>
                        <a :class="{ defect: eachData.S_TOP_2 !== ' ' }" href="#"
                            @click="aoifetchtrendData(eachData.S_TOP_2, eachData.PartNo, eachData.Layer, eachData.LotNum, 'stop2')">
                            {{ eachData.S_TOP_2 }}
                        </a>
                    </td>
                    <td>{{ eachData.S_TOP2 }}</td>
                    <td>
                        <a :class="{ defect: eachData.S_TOP_3 !== ' ' }" href="#"
                            @click="aoifetchtrendData(eachData.S_TOP_3, eachData.PartNo, eachData.Layer, eachData.LotNum, 'stop3')">
                            {{ eachData.S_TOP_3 }}
                        </a>
                    </td>
                    <td>{{ eachData.S_TOP3 }}</td>
                    <td>
                        <i class="fa-solid fa-pencil pointer" @click="modalOpen(eachData)"></i>
                        {{ eachData.value }}
                    </td>
                </tr>
            </tbody>
            <tbody v-else><tr><td colspan="22">沒有資料</td></tr></tbody>
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

    <div class="trendCanvas" v-if="showCanvas">
        <button class="close-btn" @click="canvasClose">&times;</button>
        <div class="innerCanvas">
            <div v-for="(eachAry, index) in TotalAry" :key="index">
                <trendHC :options="eachAry" :lot="lotCheck" :layer="layerCheck"></trendHC>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import pinia from '@/stores/index.js';
import { storeToRefs } from 'pinia'
import {NButton} from 'naive-ui'

// import { UseaoiFocus } from '@/stores/aoi/aoifocus/aoiFocusFetch.js';
import trendHC from '@/components/aoi/aoidaily/Table/trendHC.vue'
import { UseTableSetStore } from '@/stores/aoi/aoifocus/aoiFocusTableSet.js';
import { apiPostaoiData, apiGetaoitrendData } from '@/api/index.js';
import { UseaoiClassStore } from '@/stores/aoi/aoidaily/trendClass.js'


// const useaoifocus = UseaoiFocus(pinia);
// const { tableData } = storeToRefs(useaoifocus);

const usetablesetstore = UseTableSetStore(pinia);
const { slicefilterAry } = storeToRefs(usetablesetstore);

const useaoiclassstore = UseaoiClassStore(pinia);
const { seriesDataProcess } = useaoiclassstore;

const showModal = ref(false);
const showCanvas = ref(false);

const textareaValue = ref('');
const textareaLot = ref('');

const lotCheck = ref('');
const layerCheck = ref('');

const modalOpen = (item) => {
    showModal.value = true;
    textareaLot.value = item.Remark///Remark lot-layer
};
const modalClose = () => {
    showModal.value = false;
    textareaValue.value = '';
};

const canvasClose = () => {
    showCanvas.value = false;
    TotalAry.value = [];
};

const sendData = async () => {
    const postData = {
        data: textareaValue.value,
        type: 'aoidaily',
        lot: textareaLot.value
    };
    try {
        await apiPostaoiData(postData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        alert('上傳成功!');
        slicefilterAry.value.find((item) => item.Remark === postData.lot)
            .value = postData.data
        modalClose();
    } catch (error) {
        console.log('err', error);
    }
};

const aoifetchtrendData = async (defect, pn, layer, lot, cstop) => {
    try {
        lotCheck.value = lot;//#
        layerCheck.value = layer;
        showCanvas.value = true;
        const chartConfig = await apiGetaoitrendData(defect, pn, layer);///layer 判斷Bu or Core
        
        create_chart(lot, layer, cstop, defect, chartConfig.data.data, chartConfig.data.process);
    } catch (error) {
        console.log('err', error);
    }
};
let times = 3;///PTHELS 次數
const TotalAry = ref([])///放各Process資料

const create_chart = (lot, layer, cstop, defect, data, process) => {
    console.log(lot, layer, cstop, defect, data, process);
    // const TotalAry=[];///放各Process資料

    for (let c = 0; c < process.length; c++) {
        const ProcessAry = [];

        if (process[c] === 'PTHELS') {
            for (let t = 0; t < times; t++) { ////串成PTHELS1,PTHELS2,PTHELS3 
                let mac_type = [...new Set(data.map((item, index) =>
                    eval(`item.Machine${process[c]}${t + 1}`)))]
                    .filter((item, index) => item != " ");
                console.log('mac_type', mac_type);

                if (mac_type === ' ') {
                    continue;
                };////會有執行到PTHELS3但其實裡面什麼都沒有

                for (let m = 0; m < mac_type.length; m++) { ///#1,#2,#3
                    let process_mac_data = data.filter((item, index) => eval(`item.Machine${process[c]}${t + 1}==='${mac_type[m]}'`)) ///item.MachinePTHELS2==='Y1 內層水平化銅電鍍線_001'
                        .map((item, index) => [Date.parse(eval(`item.Time${process[c]}${t + 1}`)), eval(`Number(item.${defect})`), item.LotNum, item.LayerName, item.LotType]);
                    ProcessAry.push(seriesDataProcess(`${process[c]}${t + 1}`, mac_type[m], process_mac_data));
                };
                console.log('ProcessAry', t, ProcessAry);
                // TotalAry.value.push(ProcessAry);
            }///for times
            TotalAry.value.push(ProcessAry);
            console.log('TotalAry', TotalAry.value);
        } else {///不是Core PTHElS
            let mac_type = [...new Set(data.map((item, index) =>
                eval(`item.Machine${process[c]}1`)))]
                .filter((item, index) => item != " ");

            for (let m = 0; m < mac_type.length; m++) { ///#1,#2,#3...
                let process_mac_data = data.filter((item, index) => eval(`item.Machine${process[c]}1==='${mac_type[m]}'`)) ///一樣機台的取出
                    .map((item, index) => [Date.parse(eval(`item.Time${process[c]}1`)), eval(`Number(item.${defect})`), item.LotNum, item.LayerName, item.LotType]);
                ProcessAry.push(seriesDataProcess(process[c], mac_type[m], process_mac_data));

            };
            console.log('ProcessAry', ProcessAry);
            if (ProcessAry.length > 0) {
                TotalAry.value.push(ProcessAry);
            };////有些料號站點沒東西 ex.PLGSTN
            // TotalAry.value.push(ProcessAry);
            console.log('TotalAry', TotalAry.value);
        }
    }
};

const yieldColor=(target,trigger,rate)=>{
    const Color=rate-target>0?{backgroundColor:'#38db38'}:rate-target<0&&rate-trigger>0?{backgroundColor:'#ffd149'}:{backgroundColor:'#ff8787'};
        Color.borderRight='1px solid #e1e1e1';
        Color.borderLeft='1px solid #e1e1e1';
    return Color
};
const gfaUrl = (lot, layer) => {
    return `http://10.22.94.222/AOI_Daily_Low_Yield/${lot}_${layer}/index.html`
}
</script>

<style  scoped>
.defect {
    text-decoration: none;
    color: #fff;
    font-weight: 700;
    background-color:rgb(83 148 240);
    border-radius: 3px;
    padding: 3px;
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
.gfa_btn{
    text-decoration: none;
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

.innerCanvas>div {
    width: 50%;
}
</style>