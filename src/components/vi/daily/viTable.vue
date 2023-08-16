<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>PartNo</th>
                    <th>LotNo</th>
                    <th>Time</th>
                    <th>Mapping</th>
                    <th>Units</th>
                    <th>Target</th>
                    <th>Trigger</th>
                    <th>Yield</th>
                    <th>NCN</th>
                    <th>Remark</th>
                    <th>Top1</th>
                    <th>Pic</th>
                    <th>Rate</th>
                    <th>Top2</th>
                    <th>Pic</th>
                    <th>Rate</th>
                    <th>Top3</th>
                    <th>Pic</th>
                    <th>Rate</th>
                </tr>
            </thead>
            <tbody v-if="slicefilterAry.length > 0">
                <tr v-for="eachData of slicefilterAry">
                    <td>{{ eachData.LotType }}</td>
                    <td>{{ eachData.PartNo }}</td>
                    <td>{{ eachData.LotNum }}</td>
                    <td>{{ eachData.Datatime }}</td>

                    <td><img style="cursor: pointer;" :src="panelgfaUrl(eachData.LotNum, 'Panelmapping')"
                            @click="gfaClick(eachData.LotNum)" :height="50" alt="?"></td>

                    <td>{{ eachData.檢驗數量 }}</td>
                    <td>{{ (eachData.Target * 100).toFixed(1) }}%</td>
                    <td>{{ (eachData.Triger * 100).toFixed(1) }}%</td>
                    <td>{{ eachData.VIYield.substring(0, 4) }}%</td>
                    <td><a href="javascript:void(0)" @click="ncnClick(eachData.LotNum)">NCN</a></td>
                    <!-- vifetchNCN(eachData.LotNum) -->
                    <td><i class="fa-solid fa-pencil pointer" @click="modalOpen(eachData)"></i>
                        {{ eachData.Remark }}
                    </td>

                    <td>
                        <a href="javascript:void(0)" @click="defectClick(eachData.LotNum,eachData.Top1)">
                            {{ eachData.Top1 }}
                        </a>
                    </td>

                    <td><img :src="photoUrl(eachData.LotNum, 'top1')" :height="30" alt="" @click="photoClick(photoUrl(eachData.LotNum, 'top1'))"></td>
                    <td>{{ eachData.Top1Rate }}%</td>

                    <td>
                        <a href="javascript:void(0)" @click="defectClick(eachData.LotNum,eachData.Top2)">
                            {{ eachData.Top2 }}
                        </a>
                    </td>

                    <td><img :src="photoUrl(eachData.LotNum, 'top2')" :height="30" alt="" @click="photoClick(photoUrl(eachData.LotNum, 'top2'))"></td>
                    <td>{{ eachData.Top2Rate }}%</td>

                    <td>
                        <a href="javascript:void(0)" @click="defectClick(eachData.LotNum,eachData.Top3)">
                            {{ eachData.Top3 }}
                        </a>
                    </td>
                    <td><img :src="photoUrl(eachData.LotNum, 'top3')" :height="30" alt="" @click="photoClick(photoUrl(eachData.LotNum, 'top3'))"></td>
                    <td>{{ eachData.Top3Rate }}%</td>
                </tr>
                <tr>
                    <td colspan="20">
                        產出<strong>{{ filterTotaltableData.length }}</strong>批，Trigger:<strong>{{ tableInfo.tri
                        }}</strong>批，平均良率:<strong>{{ (tableInfo.avg).toFixed(1) }}%</strong>
                    </td>
                </tr>
            </tbody>
            <tbody v-else-if="slicefilterAry.length === 0 && filterTotaltableData.length !== 0">
                <tr>
                    <td colspan="20">
                        產出<strong>{{ filterTotaltableData.length }}</strong>批，平均良率:<strong>{{ (tableInfo.avg).toFixed(1)
                        }}%</strong>
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


        <div class="model-demo" v-if="showNcn">
            <button class="close-btn" @click="ncnClose()">&times;</button>
            <table>
                <thead>
                    <tr>
                        <th>NCN No.</th>
                        <th>時間</th>
                        <th>Defect</th>
                        <th>內容</th>
                        <th>附件</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="eachData of ncnData">
                        <td>
                            <a :href="ncnlinkUrl(eachData.ncn_no)" target="_blank">
                                {{ eachData.ncn_no }}
                            </a>
                        </td>
                        <td>{{ eachData.open_datetime }}</td>
                        <td>{{ eachData.Failure_mode }}</td>
                        <td>{{ eachData.Problem_des }}</td>
                        <td><a :href="attackUrl(eachData.attach)">下載</a></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="model-demo" v-if="showGFA">
            <button class="close-btn" @click="gfaClose()">&times;</button>
            <div class="gfa-set">
                <img :src="panelgfaUrl(lotSave, 'Panelmapping')" alt="" height="300" />
                <img :src="panelgfaUrl(lotSave, 'PanelSside')" alt="" height="300" />
                <img :src="panelgfaUrl(lotSave, 'PanelCsideBypanel')" alt="" height="500" />
                <img :src="panelgfaUrl(lotSave, 'PanelSsideBypanel')" alt="" height="500" />
            </div>
        </div>

        <div class="model-demo inner-set" v-if="showDefect">
            <button class="close-btn" @click="defectClose()">&times;</button>
            <p><strong>{{lotSave}} {{defectSave}}</strong></p>
            <nav>
                <ul class="defect-ul">
                    <li class="defect-li" v-for="eachprocess of processList">
                        <a :class="{ active: eachprocess === itemSelect && selectStatus }" class="defect-a"
                            href="JavaScript:void(0)" @click="defectSelectHandler(eachprocess, partRecord, defectSave)">{{
                                eachprocess }}
                        </a>
                    </li>
                </ul>
            </nav>
            
            <div v-if="selectStatus">
                <videfectHC v-for="eachseries of defectSeries" :alldata="eachseries" />
            </div>
            <div v-else>
                <NIcon :component="EaselOutline" size="300" :depth="5" />
            </div>

        </div>


        <div class="model-demo" v-if="photoStatus" @click="photoClose()">
            <img :src="saveSrc" alt="">
        </div>

    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js';
import videfectHC from './videfectHC.vue';
import { NIcon } from 'naive-ui'

import {
    EaselOutline
} from "@vicons/ionicons5";


import { UseviStore } from '../../../stores/vi/daily/viFetch.js';
import { UseTableStore } from '../../../stores/vi/daily/viTableSet.js';
import { UseDefectStore } from '../../../stores/vi/daily/viDefectSet.js';


const usevistore = UseviStore(pinia);
const usetablestore = UseTableStore(pinia);
const usedefectstore = UseDefectStore(pinia);

const { vifetchNCN } = usevistore;
const { ncnData, tableData, deviceData, trendData } = storeToRefs(usevistore);
const { filtertableData, filterTotaltableData, slicefilterAry, tableInfo, partRecord } = storeToRefs(usetablestore);

const { getDefectData } = usedefectstore;
const { defectSeries } = storeToRefs(usedefectstore);

import { apiPostVIData } from '../../../api/index.js'

const textareaValue = ref('');
const textareaLot = ref('');

const showModal = ref(false);
const showNcn = ref(false);

const showGFA = ref(false);
const lotSave = ref('');

const showDefect = ref(false);
const defectSave = ref('');

const processList = ref(["SMK1MEC1", "SMK1ANL1", "SMK1VDF1", "SMK1SEP1", "SMK1DUV1", "EPG1PRE1", "EPG1ENP1", "PSP1UBL1", "TST1MPW1", "PSP2CCM1", "PSP2DSS1"]);
const itemSelect = ref('');
const selectStatus = ref(false);

watch(partRecord, (newval, oldval) => {////料號更動時，trnedchart不見
    selectStatus.value = false
});

const modalOpen = (item) => {
    showModal.value = true;
    textareaLot.value = item.LotNum///用批號去比對
};
const modalClose = () => {
    showModal.value = false;
    textareaValue.value = '';
};

const ncnClose = () => {
    showNcn.value = false;
    document.body.style.overflow = 'auto';
}

const gfaClose = () => {
    showGFA.value = false;
    document.body.style.overflow = 'auto';
}

const defectClose = () => {
    showDefect.value = false;
    selectStatus.value = false;///try
    document.body.style.overflow = 'auto';
}



const sendData = async () => {
    const postData = {
        data: textareaValue.value,
        type: 'vidaily',
        lot: textareaLot.value
    };
    try {
        await apiPostVIData(postData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        alert('上傳成功!');

        tableData.value.find((item) => item.LotNum === postData.lot)///先用TableData
            .Remark = postData.data;
        modalClose();

    } catch (error) {
        console.log('err', error);
    }
};


const defectSelectHandler = (eachprocess, pn, defect) => {
    if (itemSelect.value !== eachprocess || selectStatus.value === false) {

        itemSelect.value = eachprocess;
        selectStatus.value = true;
        getDefectData(eachprocess, pn, defect);

    } else {
        selectStatus.value = false;////v-if 畫布消失
    }
};

// 處理照片點擊
const saveSrc = ref('');
const photoStatus = ref(false);
const photoClick = (img) => {
    photoStatus.value = true;
    saveSrc.value = img;
    document.body.style.overflow = 'hidden';
};
const photoClose=()=>{
    photoStatus.value=false;
    saveSrc.value = '';
    document.body.style.overflow = 'auto';
}
//

const panelgfaUrl = (lot, maptype) => {
    return `http://10.22.94.222/VI/lotbase/${lot}/${maptype}.jpg`
};
const photoUrl = (lot, top) => {
    return `http://10.22.94.222/VI/lotbase/${lot}/${top}.jpg`
};
const ncnlinkUrl = (ncnno) => {
    return `https://utcymncn01.unimicron.com/Carrier_YMncn/MRB_ReportNCN.aspx?ncn_no=${ncnno}&status=NCN`;
}
const ncnClick = (lot) => {
    vifetchNCN(lot);
    showNcn.value = true;
    document.body.style.overflow = 'hidden';///不太ok
};
const gfaClick = (lot) => {
    lotSave.value = lot;
    showGFA.value = true;
    document.body.style.overflow = 'hidden';///不太ok
}

const defectClick = (lot,defect) => {

    lotSave.value=lot;////點擊時存批號

    defectSave.value = defect;
    showDefect.value = true;
    document.body.style.overflow = 'hidden';///不太ok
};


const attackUrl = (check) => {
    return `https://utcymncn01.unimicron.com/Carrier_YMncn/Attachs/${check}`
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


.model-demo {
    /* 以上一層Table作為基準 */
    position: fixed;
    top: 50px;
    left: 100px;
    right: 50px;
    bottom: 50px;

    background-color: rgb(255, 255, 255);
    z-index: 1;

    display: flex;
    justify-content: center;
    /* align-items: center; */
    margin: auto;

    border: 1px solid rgb(182, 182, 182);
    box-shadow: 1px 1px 1px 0px rgb(210, 210, 210);

    overflow-y: auto;

}

.model-demo>table {
    width: 90%;
    height: 80%;
    margin: 20px 0;
}
.model-demo>nav{
    width: 100%;
    margin-top: 30px;
}
.model-demo>p{
    margin: 0;
    position: absolute;
    top:10px;
    left:10px
}
.inner-set {
    display: flex;
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

.gfa-set {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 20px;
}




.defect-ul {
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    margin: auto;
}

.defect-li {
    list-style: none;
}

.defect-a {
    color: #d1d1d1;
    text-decoration: none;
    display: inline-block;
    /* height: 100%; */
    padding: 0 10px;
}

.defect-a:hover {
    color: #007bff;
}

.active {
    color: #007bff;
}

</style>