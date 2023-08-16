<template>
    <div class="table-btm">
        <div>
            <p>{{ ItemStr }}</p>
        </div>
        <div>
            <n-button quaternary size="small" @click="lastPage">上一頁</n-button>
            <!-- pagebtn active -->
            <n-button strong secondary size="tiny" type="info" :class="{ pagebtn: true, active: curPage != eachpage }"
                v-for="eachpage of PageItem" :key="eachpage" @click="clickPage(eachpage)">{{ eachpage }}</n-button>
            <n-button quaternary size="small" @click="nextPage">下一頁</n-button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import pinia from "@/stores/index.js";
import { NButton } from "naive-ui";

import { UseccTableStore } from '../../../stores/cc/daily/ccTableSet.js';
const usetablestore = UseccTableStore(pinia);
const { curPage, PageItem, ItemStr } = storeToRefs(usetablestore)
const lastPage = () => {
    curPage.value === 1 ? curPage.value = 1 : curPage.value = curPage.value - 1;
};
const nextPage = () => {
    curPage.value === PageItem.value ? curPage.value = PageItem.value : curPage.value = curPage.value + 1;
};
const clickPage = (page) => {
    curPage.value = page;
};
</script>

<style  scoped>
p {
    color: blue;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    font-size: 12px;
}

.table-btm {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.pagebtn {
    margin-left: 2px;
    margin-right: 2px;
}

.active {
    background-color: rgb(241, 241, 241);
}
</style>