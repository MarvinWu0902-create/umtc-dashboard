<template>
    <div>
        <TimeBtnSearch/>
        <div class="textblock">
            <p class="title">AOI Daily Low Yield</p>
            <p class="titie_sub">下表預設為YIP當日晨會AOI Trigger批號,如要查詢過往資料,上列條件選擇後,在點選查詢即可</p>
        </div>
        <TableitemSelect/>
        <Table />
        <TablebtnSelect/>
        <!-- 要補上Focus Product -->
    </div>
</template>

<script setup>
import { ref,onMounted } from "vue";
import { storeToRefs } from "pinia";
import pinia from "../stores/index.js";

import TimeBtnSearch from '@/components/aoi/aoidaily/Table/TimeBtnSearch.vue';
import Table from '@/components/aoi/aoidaily/Table/Table.vue';
import TableitemSelect from '@/components/aoi/aoidaily/Table/TableitemSelect.vue';
import TablebtnSelect from '@/components/aoi/aoidaily/Table/TablebtnSelect.vue';

import { UseaoiFetch } from '../stores/aoi/aoidaily/aoiFetch.js';

const useaoifetch = UseaoiFetch(pinia);
const {aoifetchData}=useaoifetch;

onMounted(() => {
    aoifetchData();
});
</script>

<style scoped>

.mb-8{
    margin-bottom: 8px;
}

.mb-16{
    margin-bottom: 16px;
}

.mb-24{
    margin-bottom: 24px;
}

.textblock{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

.title{
    color: #2a2a2a;
    width: 100%;
    height: 50px;
    font-size: 32px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    text-align: center;
    margin: 5px;
}
.titie_sub{
    font-size: 16px;
    font-family: Arial, Helvetica, sans-serif;
}



</style>