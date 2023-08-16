<template>
    <div>
        <div class="p-3" v-show="radioItem === 'oridinary'">
            <p class="text-start text-dark  mb-0 p-2 border">
                <span class="fs-5">使用說明:</span><br>
                1.篩選時間為AOI產出時間<br>
                2.篩選時間區間不得超過當日前一個月
            </p>
        </div>
        <div class="p-3" v-show="radioItem === 'machine'">
            <p class="text-start text-dark  mb-0 p-2 border">
                <span class="fs-5">使用說明:</span><br>
                1.篩選時間為當前選擇的缺點項目監控站點入料時間。<br>
                2.查詢後會根據<span class="text-danger fw-bold">該缺點項目所有監控站點</span>，找出<span class="text-danger fw-bold">最遠</span>與<span class="text-danger fw-bold">最近時間點</span>並自動設為篩選時間。<br>
                3.切換缺點項目或是其他篩選條件原理同上。
            </p>
        </div>
        <defectTime />
        <!-- v-show="radioItem === 'machine'"  -->
        
        <defectNav />
        <defectRadio />
        <defectCheckBar />
        <!-- v-if="radioItem==='machine'" -->
        <!-- <defectCheckBar  v-if="radioItem==='machine'"/> -->
        <div class="w-100 d-flex flex-wrap justify-content-start  my-3">
            <div class="mx-5 position-relative" v-for="item of selectOptions.filter((item) => item.status === true)">
                <div class="circle mb-1" :style="{ backgroundColor: colorText(item.pn), border: '1px solid black' }">
                </div>
                <p class="m-0 fz-8 fw-bold tt">{{ item.pn }}</p>
            </div>
        </div>


        <div v-if="defectStatus === 'Slanting' && processStatus !== 'Slanting' && filterData.length > 0">
            <div class="container d-flex flex-column flex-wrap justify-content-center" v-if="radioItem === 'machine'">
                <div class="d-flex flex-wrap justify-content-center m-3 px-2  shadow" v-for="defect of defectAry">
                    <defectHC v-for="machine of machineAry" :defect="defect" :machine="machine" :key="defect + machine" />

                    <div class="w-100 d-flex justify-content-end">
                        <defectAnova class="w-30" :anovaData="anovaAry" :defect="defect" />
                    </div>

                </div>
                <!-- O51 #1 ,O51 #2...,O52 #1,O52 #2... -->
            </div>

            <div v-else>
                <defectHC v-for="defect of defectAry" :defect="defect" :max="anovaAry" :key="defect" />
                <!-- O51 SAPECU1,O52 SAPECU1 -->
            </div>
        </div>
        <!-- 原本 BU O51/O52  SAPECU1 (畫defect張)-->

        <div v-else-if="defectStatus !== 'Slanting' && processStatus === 'Slanting' && filterData.length > 0">
            <div class="container d-flex flex-column flex-wrap justify-content-center" v-if="radioItem === 'machine'">
                <div class="d-flex flex-wrap justify-content-center m-3 shadow" v-for="process of processAry">
                    <!--[PTHCUM1,PTHFCU1]-->

                    <defectHC v-for="machine of getfilterMachine(process)" :process="process" :machine="machine"
                        :max="anovaAry" :key="process + machine" />
                    <div class="w-100 d-flex justify-content-end">
                        <defectAnova class="w-30" :anovaData="anovaAry" :process="process" :key="process"
                            v-show="machineAry.filter((item) => item.process === process)[0].data.length > 1 && selectOptions.length !== 0" />
                    </div>
                </div>
            </div>
            <!-- A3+A4+A7 PTHCUM1#1,A3+A4+A7 PTHCUM1#2,A3+A4+A7 PTHFCU1#1,A3+A4+A7 PTHFCU1#2 -->
            <div v-else>
                <defectHC v-for="process of processAry" :process="process" :max="anovaAry" :key="process" />
            </div>
            <!-- BU A3+A4+A7  PTHCUM1/PTHFCU1 (畫process張)-->
        </div>


        <div v-else-if="defectStatus === 'Slanting' && processStatus === 'Slanting' && filterData.length > 0">
            <div class="container d-flex flex-column flex-wrap justify-content-center" v-if="radioItem === 'machine'">

                <div class="d-flex flex-column justify-content-center bg-white mb-3" v-for="process of processAry">
                    <div class="d-flex flex-wrap justify-content-center m-3 px-2 shadow" v-for="defect of defectAry">
                        <defectHC v-for="machine of getfilterMachine(process)" :process="process" :defect="defect"
                            :max="anovaAry" :machine="machine" :key="process + defect + machine" />
                        <div class="w-100 d-flex justify-content-end">
                            <defectAnova class="w-30" :anovaData="anovaAry" :process="process" :defect="defect"
                                :key="process + defect"
                                v-show="machineAry.filter((item) => item.process === process)[0].data.length > 1 && selectOptions.length !== 0" />
                        </div>
                    </div>

                </div>



                <!-- O51 ecu#1,O51ecu#2,O52ecu#1,O52ecu#2 ...O52 cum#1... -->
            </div>

            <div v-else>
                <div v-for="process of processAry">
                    <defectHC v-for="defect of defectAry" :process="process" :defect="defect" :max="anovaAry"
                        :key="defect + process" />
                </div>
            </div>

        </div>


        <!-- O51 ecu,O51 cum,O52 ecu,O52cum -->
        <!-- 後來 BU O51/O52  SAPECU1/PTHCUM1 (畫defect張)-->


        <div v-else-if="filterData.length > 0">

            <div class="container d-flex flex-wrap justify-content-around mx-2 shadow" v-if="radioItem === 'machine'">
                <defectHC v-for="machine of machineAry" :machine="machine" :max="anovaAry" :key="machine" />
                <div class="w-100 d-flex justify-content-end">
                    <defectAnova class="w-30" :anovaData="anovaAry"
                        v-show="machineAry.length > 1 && selectOptions.length !== 0" />
                </div>
            </div>


            <!-- S1+S2 LTHADF1 依據站點畫機台數圖 -->
            <div v-else>
                <defectHC :max="anovaAry" />
            </div>
            <!-- S1+S2 LTHADF1 單純一張圖 -->
        </div>


        <defectTable v-show="radioItem !== 'machine'" />
        <!-- { Defect: 'BU O51/O52', Process: 'SAPECU1' },
            { Defect: 'BU A3+A4+A7', Process: 'PTHCUM1/PTHFCU1'},
        -->

    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import pinia from "@/stores/index.js";
import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap';

import defectNav from '../components/aoi/aoidailydefect/defectNav.vue';
import defectHC from '../components/aoi/aoidailydefect/defectHC.vue';
import defectTable from '../components/aoi/aoidailydefect/defectTable.vue';
import defectRadio from '../components/aoi/aoidailydefect/defectRadio.vue';
import defectTime from '../components/aoi/aoidailydefect/defectTime.vue';
import defectCheckBar from '../components/aoi/aoidailydefect/defectCheckBar.vue'
import defectAnova from '../components/aoi/aoidailydefect/defectAnova.vue';

import { UsedefectFetch } from '../stores/aoi/aoidailydefect/defectFetch.js';
const usedefectfetch = UsedefectFetch(pinia);
const { defectFetchData } = usedefectfetch;
const { filterData, selectOptions } = storeToRefs(usedefectfetch);

import { UsedefectHC } from '../stores/aoi/aoidailydefect/defectHCSet.js';
const usedefecthc = UsedefectHC(pinia);
const { defectStatus, processStatus, defectAry, processAry, defectProcess, radioItem, machineAry, anovaAry, colorAry } = storeToRefs(usedefecthc);


const getfilterMachine = (process) => {
    return machineAry.value.filter((item) => item.process === process)[0].data;
};
const colorText = (pn) => {
    if (colorAry.value.filter((item) => item.pn === pn).length === 0) {
        return '#000';
    } else {
        return colorAry.value.filter((item) => item.pn === pn)[0].color;
    }
}

onMounted(() => {
    defectFetchData();
})

</script>



<style scoped>
.container {
    /* position: relative; */
    max-width: 1200px;
    padding: 0 10px;
    margin: 0 auto;
}

.circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}


.w-30 {
    width: 30%;
}

.w-10 {
    width: 30px;
}

.fz-8 {
    font-size: 8px;
}

.tt {
    position: absolute;
    top: -4px;
    left: 15px;
}
</style>