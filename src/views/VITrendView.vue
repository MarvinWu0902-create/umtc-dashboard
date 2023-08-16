<template>
    <div>
        <h1>VI Trend Chart</h1>
        <viTrendFilter />
        <viTrendHC />
        <div class="d-flex" v-if="actionData.length>0">
            <viactionTable class="item" v-for="machine of machineName" :key="machine" :machine="machine" />
        </div>
    </div>
</template>

<script setup>

import viTrendFilter from '../components/vi/trend/viTrendFilter.vue';
import viTrendHC from '../components/vi/trend/viTrendHC.vue';
import viactionTable from '../components/vi/trend/viactionTable.vue';

import { UseviStore } from '../stores/vi/trend/vitrendFetch.js';

import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import pinia from '../stores/index.js';

const usevistore = UseviStore(pinia);
const { trendData, actionData, params, insertStatus, categoriesAry, plotAry, container, tableData, machineName } = storeToRefs(usevistore);

onMounted(()=>{
    plotAry.value=[];
    trendData.value=[];
    tableData.value=[];
    actionData.value=[];
    params.value.pn='';
    params.value.defect='';
    params.value.process='';
})
</script>

<style  scoped>
h1 {
    text-align: center;
    font-family: 'Segoe UI';
}

.d-flex {
    width: 950px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.item {
    margin: 10px;
}


</style>