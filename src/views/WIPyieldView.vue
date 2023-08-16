<template>
    <div>
        <wipTime />
        <wipTable />
    </div>
</template>

<script setup>
import { onMounted,onBeforeUnmount } from 'vue';

import pinia from "@/stores/index.js";
import { storeToRefs } from 'pinia';


import wipTime from '../components/wip/wipTime.vue';
import wipTable from '../components/wip/wipTable.vue';

import { UsewipStore } from '../stores/wip/wipFetch.js';
const usewipstore = UsewipStore(pinia);
const { wipyieldFetch } = usewipstore;
const { params, tableData,searchStatus } = storeToRefs(usewipstore);


onBeforeUnmount (() => {
    console.log('onBeforeUnmount');
    tableData.value=[];

    searchStatus.value=false;

    params.value.lot = '';
    params.value.pn = '';
    params.value.proccode = '';
    params.value.proccode8 = '';
    params.value.status = 'All';
})

</script>

<style scoped></style>