<template>
    <div class="d-flex my-3">
        <button type="button" class="btn btn-secondary text-light fw-bold ms-3 px-1 py-0" 
            v-for="eachpart of pnAry" :key="eachpart" :class="{ active: partRecord === eachpart }"
            @click="btnClick(eachpart)">
            {{ eachpart }}
            <span :style="ColorSet(eachpart)" class="badge">
                {{ pncountObj[eachpart] }}
            </span>
        </button>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia'
import pinia from '../../stores/index.js';

import { UsefliTableSet } from '../../stores/fli/fliTableSet.js'
const useflitableset = UsefliTableSet(pinia);
const {pnAry,partRecord,curPage,pntritarCount}=storeToRefs(useflitableset);


const btnClick = (PN) => {
    partRecord.value = PN;
    curPage.value = 1;
};

const pncountObj = computed(() => {
    const result = pntritarCount.value.reduce((obj, item) => { obj[item.pn] = item.count; return obj }, {});
    return result
});

const ColorSet = (pn) => {
    const colorAry = pntritarCount.value.filter((Ary) => Ary.pn === pn)[0];
    if (colorAry.green > 0 && colorAry.yellow === 0 && colorAry.red === 0) {
        return 'background:rgb(56, 219, 56)';
    } else if (colorAry.red > 0) {
        return 'background:rgb(255, 135, 135)';
    } else {
        return 'background:rgb(255, 209, 73)';
    }
};

</script>

<style lang="scss" scoped>

.curset{
    cursor: pointer;
}

.active {
    box-shadow: 2px 2px 3px 1px rgb(205, 205, 205);
    background-color: rgb(53, 142, 219)!important;
}

.btn{
    border: 0;
    background-color:rgba(204, 204, 204, 1);
    &:hover{
        background-color: rgb(53, 142, 219);
    }
    .badge{
        top: -2px;
    }
}
</style>