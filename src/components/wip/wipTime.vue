<template>
    <div class="btn">
        <!-- <input type="text" v-model=""> -->
        <n-form :disabled="switchCase">
            <n-form-item label="料號:" path="pn">
                <n-input v-model:value="params.pn" placeholder="輸入料號" />
            </n-form-item>
            <n-form-item label="批號:" path="lot">
                <n-input v-model:value="params.lot" placeholder="輸入批號" />
            </n-form-item>
            <n-form-item label="站點:" path="proccode">
                <n-input v-model:value="params.proccode" placeholder="輸入六碼站點" />
            </n-form-item>
            <n-form-item label="站點:" path="proccode">
                <n-input v-model:value="params.proccode8" placeholder="輸入八碼站點" />
            </n-form-item>
            <n-form-item label="狀態:">
                <n-select v-model:value="params.status" :options="options" />
            </n-form-item>
        </n-form>

        <n-form-item path="radioGroupValue">
            <n-radio-group v-model:value="radioItem" name="radiogroup">
                <n-radio value="filter">
                    篩選條件
                </n-radio>
                <n-radio value="wip">
                    目前WIP
                </n-radio>
            </n-radio-group>
        </n-form-item>

        <n-date-picker v-model:value="range" type="datetimerange" clearable />
        <n-button strong secondary type="warning" @click="clickHandler">查詢</n-button>
    </div>
    <div class="download-layout">
        <n-button  strong secondary type="Error" @click="exportExcel">Excel<NIcon size='16' :component="DownloadOutline"/></n-button>
        <!--  DownloadOutline -->
       
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import * as XLSX from 'xlsx'

import pinia from '../../stores/index.js';

import { NIcon,NDatePicker, NButton, NFormItem, NInput, NSelect, NForm, NRadioGroup, NRadio } from 'naive-ui';
import { DownloadOutline } from '@vicons/ionicons5';

import { UsewipStore } from '../../stores/wip/wipFetch.js';


const usewipstore = UsewipStore(pinia);
const { wipyieldFetch } = usewipstore;
const { params,radioItem, searchStatus, tableData } = storeToRefs(usewipstore);

const now = new Date();
const yesterdata = new Date(now);
yesterdata.setDate(now.getDate() - 30);////-1

// now.setHours(0, 0, 0, 0);
// yesterdata.setHours(0, 0, 0, 0);
yesterdata.setDate(1);
yesterdata.setHours(0, 0, 0, 1);

const nowTimestamp = now.getTime();
const yesterdataTimestamp = yesterdata.getTime();

const range = ref([yesterdataTimestamp, nowTimestamp]);////range要跟pinia上的fetch api

params.value.st = range.value[0];///aoi_params 從fetch 傳進=>預設綁定
params.value.et = range.value[1];

watch(range, (newval) => {
    params.value.st = newval[0];
    params.value.et = newval[1];
});


// const radioItem = ref('filter');///改由wipFetch傳進
const options = ref([
    { label: 'All', value: 'All' },
    { label: 'CheckIn', value: 'CheckIn' },
    { label: 'CheckOut', value: 'CheckOut' },
    { label: 'MoveIn', value: 'MoveIn' },
    { label: 'MoveOut', value: 'MoveOut' },
]);



const switchCase = computed(() => {
    if (radioItem.value === 'wip') {
        params.value.lot = '';
        params.value.pn = '';
        params.value.proccode = '';
        params.value.proccode8 = '';
        params.value.status = 'All';
        return true;
    } else {
        return false;
    }
});

const execelData = computed(() => {
    return tableData.value.map((item) => {
        return { ...item, ChangeTime: item.ChangeTime.date.substring(0, 19) }
    })
});

const clickHandler = () => {
    tableData.value = [];
    wipyieldFetch();
};

const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(execelData.value);
    const workbook = XLSX.utils.book_new();
    let date = new Date();
    let output=date.getFullYear()+ '_' 
    +String(date.getMonth() + 1).padStart(2, '0')+'_'
    +String(date.getDate()).padStart(2, '0')+'_'
    +String(date.getHours())+'_'
    +String(date.getMinutes());

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${output}_wip.xlsx`);
};

</script>

<style  scoped>
.btn {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-right: -45px;

}

.n-date-picker {
    width: 30%;
    margin-left: -40px;
}

.n-form {
    margin: 10px;
    display: flex;
    width: 50%;
}

.n-form-item {
    margin-left: 10px;
    width: 150px;
}
.btn button {
    margin: 3px;
}

.download-layout{
    display: flex;
    justify-content: flex-end;
}
.download-layout button {
    margin: 5px;
}
</style>