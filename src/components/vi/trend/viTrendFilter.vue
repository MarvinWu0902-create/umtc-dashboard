<template>
    <div>
        <n-form>
            <n-form-item  label="料號:">
                <n-input :maxlength=7 v-model:value="params.pn" placeholder="輸入料號" />
            </n-form-item>
            <n-form-item label="缺點:">
                <n-input v-model:value="params.defect" placeholder="輸入缺點" />
            </n-form-item>
            <n-form-item label="站點:">
                <n-input :maxlength=8 v-model:value="params.process" placeholder="輸入八碼站點" />
            </n-form-item>
            <n-form-item>
                <n-date-picker v-model:value="range" type="datetimerange" clearable />
            </n-form-item>
            <n-form-item>
                <n-button strong secondary type="warning" @click="clickHandler">查詢</n-button>
            </n-form-item>

        </n-form>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js';
import * as XLSX from 'xlsx'


import { NIcon, NDatePicker, NButton, NFormItem, NInput, NSelect, NForm, NRadioGroup, NRadio } from 'naive-ui';
import { DownloadOutline } from '@vicons/ionicons5';

import { UseviStore } from '../../../stores/vi/trend/vitrendFetch.js'

const usevistore = UseviStore(pinia);
const { getData,getAction } = usevistore;
const { params,plotAry,tableData} = storeToRefs(usevistore);


const now = new Date();
const yesterdata = new Date(now);
yesterdata.setDate(now.getDate() - 30*3);////-1

yesterdata.setDate(1);
yesterdata.setHours(0, 0, 0, 1);

const nowTimestamp = now.getTime();
const yesterdataTimestamp = yesterdata.getTime();

const range = ref([yesterdataTimestamp, nowTimestamp]);////range要跟pinia上的fetch api

params.value.st = range.value[0];
params.value.et = range.value[1];

watch(range, (newval) => {
    params.value.st = newval[0];
    params.value.et = newval[1];
});



const clickHandler=()=>{
    plotAry.value = [];
    tableData.value = [];
    getData();
    getAction();
}


</script>

<style  scoped>


.n-form {
    display: flex;
    justify-content: center;
}
.n-form-item{
    margin:0 10px;
}


</style>