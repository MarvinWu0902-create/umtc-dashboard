<template>
    <div class="d-flex justify-content-center align-items-center ms-1">
        <n-date-picker v-model:value="range" type="datetimerange" clearable />
        <n-button strong secondary type="warning" @click="clickHandler">查詢</n-button>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js';

import { NDatePicker, NButton } from 'naive-ui';

import { UsedefectFetch } from '../../../stores/aoi/aoidailydefect/defectFetch.js';
const usedefectfetch = UsedefectFetch(pinia);
const { defectFetchData, defectFetchMacData } = usedefectfetch;
const { filterData, time_params, pageStatus } = storeToRefs(usedefectfetch);

import { UsedefectHC } from '../../../stores/aoi/aoidailydefect/defectHCSet.js';
const usedefecthc = UsedefectHC(pinia);
const { processAry, radioItem } = storeToRefs(usedefecthc);

////先用filterdata跟prcessAry抓出最大和最小時間區間


const today = new Date();
today.setHours(8, 0, 0, 0);
let todayTsp = today.getTime();

const lastday = new Date();
lastday.setHours(8, 0, 0, 0);
lastday.setDate(lastday.getDate() - 1);
let lastdayTsp = lastday.getTime();



const lastMonth = new Date();
lastMonth.setMonth(lastMonth.getMonth() - 1);
lastMonth.setHours(8, 0, 0, 0)
let lastMonthTsp = lastMonth.getTime();




// const range = ref([lastMonthTsp, todayTsp]);
const range = ref([lastdayTsp, todayTsp]);

const timeTest = computed(() => {////抓新資料時會觸發
    if (filterData.value.length === 0) {////全部篩選選項拔掉 就是filterData.value.length === 0
        console.log('是這裡嗎?')
        return [lastMonthTsp, todayTsp]
    }
    else if (radioItem.value === 'machine') {////機台頁面抓資料觸發
        const container = [];
        for (let i = 0; i < processAry.value.length; i++) {
            console.log('123', processAry.value[i]);

            if (processAry.value[i] === 'ChangeTime') {
                const dataAry = filterData.value
                    .filter((item) => item[`${processAry.value[i]}`] != null && item[`${processAry.value[i]}`] !== ' ')
                    .map((item) => {
                        return Date.parse(item[`${processAry.value[i]}`])
                    });
                container.push(...dataAry);
            } else {
                const dataAry = filterData.value
                    .filter((item) => item[`Time${processAry.value[i]}`] != null && item[`Time${processAry.value[i]}`] !== ' ')
                    .map((item) => {
                        return Date.parse(item[`Time${processAry.value[i]}`])
                    });

                container.push(...dataAry);
            }
        };
        console.log('filterdata', filterData.value);
        const finalMax = Math.max(...container);
        const finalMin = Math.min(...container);



        console.log('timeTest machine', [finalMin, finalMax]);
        return [finalMin, finalMax]
    } else {
        console.log('timeTest 預設');
        return [time_params.value.st, time_params.value.et]
        // if (time_params.value.st === '' && time_params.value.et === '') {
        //     console.log('什麼時候進來?')
        //     return range.value
        // } else {
        //     console.log('What',time_params.value.st,time_params.value.et);
        //     return [time_params.value.st,time_params.value.et]
        // }
    }
});

watch(timeTest, (newval, oldval) => {
    range.value = newval;
});

watch(radioItem, (newval, oldval) => {///互切都是一個月
    if (newval === 'oridinary') {
        // range.value=[lastdayTsp,todayTsp];
        defectFetchData(lastMonthTsp, todayTsp, null, pageStatus.value);
    }
    // else {///換成machine
    //     ////range要改
    //     // range.value=[lastMonthTsp, todayTsp];
    //     defectFetchMacData(lastMonthTsp, todayTsp, processAry.value.join());
    // }
});

const clickHandler = () => {


    ////要判斷是在哪個頁面點擊
    if (radioItem.value === 'machine') {
        // time_params.value.st = range.value[0];
        // time_params.value.et = range.value[1];
        // const res = await apiGetaoiDefectData(st, et, process);
        
        defectFetchMacData(range.value[0], range.value[1], processAry.value.join());
    } else {
        time_params.value.st = range.value[0];
        time_params.value.et = range.value[1];
    }

}

</script>

<style scoped>
.btn {
    display: flex;
    justify-content: center;
    align-items: center;
    /* margin-right: 10px; */
    margin-right: -45px;

}

.n-date-picker {
    width: 50%;
    margin: 10px;
}
</style>