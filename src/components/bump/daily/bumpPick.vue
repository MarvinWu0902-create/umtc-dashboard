<template>
    <div class="btn">
        <n-badge class="curset" :color="ColorSet(eachpart)" :style="badgeStyle" v-for="eachpart of pnAry" :key="eachpart"
            @click="btnClick(eachpart)" :value="pncountObj[eachpart]" :max="10" :show-zero="true">
            <n-avatar :class="{ active: partRecord === eachpart }" :style="avatarStyle">{{ eachpart }}</n-avatar>
        </n-badge>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js';
import { NBadge, NAvatar } from 'naive-ui'

import { UsebumpTableStore } from '../../../stores/bump/daily/bumpTableSet.js'
const usetablestore = UsebumpTableStore(pinia);
const { pnAry, partRecord, curPage, pntritarCount } = storeToRefs(usetablestore);

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
        return 'rgb(56, 219, 56)';
    } else if (colorAry.red > 0) {
        return 'rgb(255, 135, 135)';
    } else {
        return 'rgb(255, 209, 73)';
    }
};

const badgeStyle = ref({
    margin: '10px',
    width: '80px',
    height: '25px'
})
const avatarStyle = ref({
    width: '80px',
    height: '25px',
    fontSize: '14px',
    fontWeight: '700',
})




</script>

<style scoped>
.btn {
    display: flex;
    justify-content: flex-start;
    margin-top: 10px;
    margin-left: 10px;
}

.curset {
    cursor: pointer;
}

.active {
    background-color: rgb(53, 142, 219);
}
</style>