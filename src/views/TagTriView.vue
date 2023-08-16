<template>
    <div>
        <formModel />
        <inputModel />
        <tagtriTable />
    </div>
</template>

<script setup>
import {onBeforeUnmount} from 'vue' 
import pinia from '../stores/index.js'
import {storeToRefs}from 'pinia';

import formModel from '../components/tagtri/formModel.vue';
import inputModel from '../components/tagtri/inputModel.vue';
import tagtriTable from '../components/tagtri/tagtriTable.vue';

import {UsetagtriStore} from '../stores/tagtri/tagtriFetch.js'

const usetagtristore = UsetagtriStore(pinia);
const { tagtrifetchData,tagtriPostData } = usetagtristore;
const { paramsProcess,paramsPwd,vertifyStatus,inputValue, tableData } = storeToRefs(usetagtristore);

onBeforeUnmount(()=>{
    paramsProcess.value=null;
    paramsPwd.value=null;
    vertifyStatus.value=false;

    inputValue.value.pn='';
    inputValue.value.layer='';
    inputValue.value.tag='';
    inputValue.value.tri='';

    tableData.value=[];
})

</script>

<style  scoped></style>