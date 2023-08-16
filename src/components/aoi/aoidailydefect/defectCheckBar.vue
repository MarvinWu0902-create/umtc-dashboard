<template>
    <div class="d-flex  flex-wrap justify-content-around  ms-3 p-3 mb-3  fw-bold">
        <div class="d-flex w-60 flex-wrap align-content-center shadow-sm p-2 my-1 me-1 bg-body rounded">
            <div class="form-check form-check-inline" v-for="(item, index) of selectOptions" :key="item.pn">
                <input class="form-check-input" type="checkbox" v-model="item.status" :value="item.pn">
                <label class="form-check-label fixed-60 fz-8"  :for="item.pn">{{
                    item.pn
                }}</label>
            </div>
            <div class="d-flex justify-content-end w-100">
                <button class="btn btn-outline-secondary btn-sm me-2 p-0 fw-bold fz-8 border-2"
                    @click="addall()">全選</button>
                <button class="btn btn-outline-secondary btn-sm p-0 fw-bold fz-8 border-2" @click="cleanall()">取消全選</button>
            </div>

        </div>
        <div class="d-flex w-20 flex-wrap justify-content-between align-content-center shadow-sm p-2 my-1 bg-body rounded">
            <div class="form-check form-check-inline" v-for="(item, index) of selectOptions2" :key="item.device">
                <input class="form-check-input check-device" type="checkbox" v-model="item.status" :value="item.device">
                <label class="form-check-label fixed-50 fz-8" :for="item.device">{{ item.device }}</label>
            </div>
        </div>
        <div class="d-flex w-20  flex-wrap justify-content-between align-content-center shadow-sm p-2 my-1 bg-body rounded">
            <div class="form-check form-check-inline" v-for="(item, index) of selectOptions3" :key="item.type">
                <input class="form-check-input check-type" type="checkbox" v-model="item.status" :value="item.type">
                <label class="form-check-label fixed-50 fz-8" :for="item.type">{{ item.type }}</label>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js';


import { UsedefectFetch } from '../../../stores/aoi/aoidailydefect/defectFetch.js';
const usedefectfetch = UsedefectFetch(pinia);
const { defectFetchMacData } = usedefectfetch;
const { selectOptions, selectOptions2, selectOptions3, checkbarAry, checkbar2Ary, checkbar3Ary } = storeToRefs(usedefectfetch);

import { UsedefectHC } from '../../../stores/aoi/aoidailydefect/defectHCSet.js';
const usedefecthc = UsedefectHC(pinia);
const { colorAry } = storeToRefs(usedefecthc);


///colorAry
///[{pn:3273012,color:sdaad}]


const addall = () => {
    // selectOptions.value = checkbarAry.value.map((item) => ({ pn: item.pn, device: item.device, status: true }));
    selectOptions2.value = checkbar2Ary.value.map((item) => ({ device: item, status: true }))
};
const cleanall = () => {
    // selectOptions.value = checkbarAry.value.map((item) => ({ pn: item.pn, device: item.device, status: false }));
    selectOptions2.value = checkbar2Ary.value.map((item) => ({ device: item, status: false }))
};

const colorText = (pn) => {
    return colorAry.value.filter((item) => item.pn === pn)[0].color
}
// :style="{ color: colorText(item.pn) }"

watch(selectOptions2, (newval, oldval) => {
    let t = newval
        .filter((item) => item.status === false)
        .map((item) => item.device);
    let container = [];
    selectOptions.value.map((item) => {
        if (t.includes(item.device)) {
            container.push({ pn: item.pn, device: item.device, status: false });
        } else {
            container.push({ pn: item.pn, device: item.device, status: true });
        }
    });
    selectOptions.value = container;

}, { deep: true });///依據device 去篩選要show的要打勾料號



////selectOptions ->[{pn:3273016,status:true},{pn:3273020,status:true},...]
////selectOptions2 ->[{device:'EMIB',status:true},{device:'client',status:true}]
////selectOptions3 ->[{type:'C3',status:true},{type:'E3',status:true}]


</script>

<style lang="scss" scoped>

.form-check-input {
    cursor: pointer;

    &:checked {
        background-color: #5291ee;
        border-color: #5291ee;
    }

    &.check-device:checked {
        background-color: #b0b9c7;
        border-color: #b0b9c7;
    }

    &.check-type:checked {
        background-color: #7fbe90;
        border-color: #7fbe90;
    }
}

.fixed-50 {
    width: 30px;
}

.fixed-60 {
    width: 50px;
}

.fz-8 {
    font-size: 8px;
}

.w-20 {
    width: 15%
}

.w-60 {
    width: 60%;
}</style>