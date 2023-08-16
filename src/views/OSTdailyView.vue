<template>
    <div>
        <ostDevice/>
        <ostPick/>
        <div class="title">
            <p>OST Daily Low Yield</p>
        </div>
        <div class="sub">
        <p>下列預設為YIP當日晨會OST Trigger批號,如要查詢過往資料,下列條件選擇後,在點選查詢即可</p>
        </div>
        <ostTime/>
        <ostHC v-if="filterTotaltableData.length>0"/>
        <!-- v-if="slicefilterAry.length>0" -->
        <ostitemSelect/>
        <ostTable/>
        <ostbtnSelect/>
    </div>
</template>

<script setup>
import {watch,onMounted,onUnmounted, onBeforeUnmount} from 'vue';
import pinia from "@/stores/index.js";
import {storeToRefs}from 'pinia'


import ostTime from '../components/ost/daily/ostTime.vue';
import ostTable from '../components/ost/daily/ostTable.vue';
import ostDevice from '../components/ost/daily/ostDevice.vue';
import ostPick from '../components/ost/daily/ostPick.vue';
import ostitemSelect from '../components/ost/daily/ostitemSelect.vue';
import ostbtnSelect from '../components/ost/daily/ostbtnSelect.vue';
import ostHC from '../components/ost/daily/ostHC.vue';

import {UseostStore} from '../stores/ost/daily/ostFetch.js';
import {UseTableStore} from '../stores/ost/daily/ostTableSet.js';


//slicefilterAry
const useoststore=UseostStore(pinia);
const {ostfetchData}=useoststore;
const {tableData}=storeToRefs(useoststore);


const usetablestore=UseTableStore(pinia);
const {slicefilterAry,filterTotaltableData,partRecord}=storeToRefs(usetablestore);



onMounted(()=>{
    ostfetchData();
})
onBeforeUnmount(()=>{
    // partRecord.value='';
    tableData.value=[];
});

</script>

<style  scoped>
.title,.sub {
    width: 100%;
    /* margin-top: -50px;
    height: 90px; */
    display: flex;
    justify-content: center;
    font-size: 36px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    color: #2a2a2a;
}

.title>p {
    margin: 0;
}


.sub {
    color: black;
    font-size: 18px;
}
</style>