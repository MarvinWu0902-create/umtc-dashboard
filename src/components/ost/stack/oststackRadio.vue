<template>
    <div>
        <div class="radio">
            <n-radio-group v-model:value="radioItem" name="radiogroup">
                <n-radio value="MP">
                    MP
                </n-radio>
                <n-radio value="BD">
                    BD
                </n-radio>
            </n-radio-group>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {storeToRefs}from 'pinia'
import pinia from '../../../stores/index.js';
import { NForm, NRadioGroup, NRadio, NSpace } from 'naive-ui';

import {UseoststackStore} from '../../../stores/ost/stack/oststackFetch.js';

const useoststackstore=UseoststackStore(pinia);

const {getaoistackData,changeRadioData}=useoststackstore;
const {radioItem,defectSelect}=storeToRefs(useoststackstore);


watch(radioItem,(newval,oldval)=>{
    // if(newval==='Core'){
    //     defectAry.value=['Yield','O2','O3','O4','O7','S5'];
    // }else{
    //     defectAry.value=['Yield', 'O2', 'O7', 'O51', 'O52', 'A3+A4', 'A5+A6', 'A51+A61', 'S1+S2', 'S3+S5+S6', 'O1+O4'];
    // };
    defectSelect.value='Yield';
    // getpnData(newval);
    // console.log('ttttt',navpartRecord.value);
    // getaoistackData(newval,navpartRecord.value);////,navpartRecord.value
    changeRadioData(newval);
});


</script>

<style  scoped>
.radio{
    margin-left: 40px;
}
</style>