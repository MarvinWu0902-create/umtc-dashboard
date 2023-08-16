<template>
    <div class="d-flex">
        <n-form label-placement="left">
            <n-grid :cols="4" :x-gap="10" :y-gap="10">
                <n-form-item-gi :span="23" label="對策:">
                    <n-input v-model:value="actionValue" />
                </n-form-item-gi>
                <n-form-item-gi :span="23" label="時間:">
                    <n-date-picker v-model:value="timeRange" type="datetime" clearable />
                </n-form-item-gi>
                <n-form-item-gi :span="23" label="對策線顏色:">

                    <n-color-picker v-model:value="colorValue" size="small" :swatches="[
                        '#FFFFFF',
                        '#18A058',
                        '#2080F0',
                        '#F0A020',
                        'rgba(208, 48, 80, 1)'
                    ]" />

                </n-form-item-gi>

                <!-- <n-form-item-gi :span="10" label="偏移X:">
                    <n-input-number v-model:value="labelX" clearable />
                </n-form-item-gi>
                <n-form-item-gi :span="10" label="偏移Y:">
                    <n-input-number v-model:value="labelY" clearable />
                </n-form-item-gi> -->

                <n-form-item-gi>
                    <n-button attr-type="button" @click="actionClick">
                        新增
                    </n-button>
                </n-form-item-gi>

            </n-grid>
        </n-form>
        <n-form>
            <n-transfer v-model:value="actionmodelValue" :options="acitonOption" />
            <n-button attr-type="button" @click="updateClick">
                更新
            </n-button>
        </n-form>
    </div>
</template>

<script setup>
import { nextTick, ref, watchEffect, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js'

import { NForm, NGrid, NFormItemGi, NSelect, NInput, NButton, NSpace, NColorPicker, NDatePicker, NTransfer, NInputNumber } from 'naive-ui'

import { UseTrendStore } from '../../../stores/vi/daily/viTrendSet.js';

const usetrendstore = UseTrendStore(pinia);

const { gettrendData, postactionData, postupdateactionData } = usetrendstore;
const { partnumber, process, defect, selectStatus, defecttrendData, seriesAry, timeRange, actionValue, colorValue, insertLoc, insertStatus, plotAry, acitonOption, actionmodelValue, templotAry, itemSelect, actionGet, labelX, labelY } = storeToRefs(usetrendstore);




const actionClick = () => {
    insertStatus.value = true;
    selectStatus.value = false;///畫布消失(待重新渲染)

    setTimeout(() => {

        const actionData = {
            process: itemSelect.value.process,
            time: timeRange.value,
            color: colorValue.value,
            text: actionValue.value
        }
        postactionData(actionData);
        ////上拋DB

        // {process: 'SMK1VDF1', text: '對策3', color: 'rgba(240, 160, 32, 1)', time: '1685548800000'}
        actionGet.value.push(actionData);
        ///測試一下


        plotAry.value.push({
            color: colorValue.value,
            from: insertLoc.value,
            to: insertLoc.value,
            zIndex: 2,
            label: { y: -10, x: 0, text: actionValue.value, align: 'right', style: { fontSize: '14px', fontWeight: 'bold', color: colorValue.value } },
            time: timeRange.value
        })

        templotAry.value.push({
            color: colorValue.value,
            from: insertLoc.value,
            to: insertLoc.value,
            zIndex: 2,
            label: { y: -10, x: 0, text: actionValue.value, align: 'right', style: { fontSize: '14px', fontWeight: 'bold', color: colorValue.value } },
            time: timeRange.value
        });///暫存用
        ////
        
        acitonOption.value = plotAry.value.map((item) => ({ label: item.label.text, value: item.label.text }));
        actionmodelValue.value = plotAry.value.map((item) => item.label.text)

        ///test
        actionValue.value = '';
        ////

        selectStatus.value = true///畫布出現(重新渲染)

    }, 1);
};

const updateClick = () => {
    insertStatus.value = false;///測試一下
    selectStatus.value = false;//畫布消失
    setTimeout(() => {

        // templotAry.value.length===0///如果有新增後再更新，會有問題
        //     ?plotAry.value = plotAry.value.filter((item) => actionmodelValue.value.includes(item.label.text))
        //     :plotAry.value = templotAry.value.filter((item) => actionmodelValue.value.includes(item.label.text));
        plotAry.value = plotAry.value.filter((item) => actionmodelValue.value.includes(item.label.text));

        if (plotAry.value.length === 0) {
            const data = [{ process: itemSelect.value.process }];
            postupdateactionData(data);
        } else {
            const data = plotAry.value.map((item) => (
                {
                    process: itemSelect.value.process,
                    color: item.color,
                    time: item.time,
                    text: item.label.text,
                }));
            postupdateactionData(data);
        };

        ////^plotAry 如果被更新到空陣列的話，要調整

        actionGet.value = actionGet.value.filter((item) => actionmodelValue.value.includes(item.text));
        acitonOption.value = actionGet.value.map((item) => ({ label: item.text, value: item.text }));



        selectStatus.value = true;///畫布出現
    }, 1)

};




</script>

<style  scoped>
.n-form {
    width: 500px;
    padding: 10px;
    margin: 10px;
    border: 1px solid rgba(221, 221, 221, 0.8);
    border-radius: 10px;
}

.n-form .n-button {
    margin: 0 50px;
}


.d-flex {
    display: flex;
    justify-content: space-around;
}
</style>