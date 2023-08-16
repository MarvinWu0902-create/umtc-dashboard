<template>
    <div class="btn">
        <n-badge class="curset" :color="ColorSet(eachpart)" :style="badgeStyle" v-for="eachpart of pnAry" :key="eachpart"
            @click="btnClick(eachpart)" :value="pncountObj[eachpart]" :max="10" :show-zero="true">
            <n-avatar :class="{ active: partRecord === eachpart }" :style="avatarStyle">{{ eachpart }}</n-avatar>
        </n-badge>
    </div>
</template>
<!-- 
:color="pncountObj[eachpart] === 0
            ? 'rgb(175 175 175)'////灰色
            : pncountObj[eachpart] !== 0 && pntirObj[eachpart] === 0 && pntarObj[eachpart] === 0///沒有tri又有產出
                ? 'rgb(56, 219, 56)'///綠色
                /////pntarObj
                : pntirObj[eachpart] === 0 && pntarObj[eachpart] > 0
                    ? 'rgb(255, 209, 73)'
                    : 'rgb(255, 135, 135)'" -->


<script setup>
import {ref, watch,computed} from 'vue';
import {storeToRefs}from 'pinia'
import pinia from '../../../stores/index.js';
import {NBadge,NAvatar}from 'naive-ui'

import { UseTableStore}from '../../../stores/ost/daily/ostTableSet.js'
const usetablestore=UseTableStore(pinia);
const {pnAry,partRecord,curPage,pntritarCount}=storeToRefs(usetablestore);


const btnClick=(PN)=>{
    partRecord.value=PN;
    curPage.value=1;
   
};
const pncountObj = computed(() => {
    const result = pntritarCount.value.reduce((obj, item) => {obj[item.pn] = item.count;return obj},{});
    return result
});

const ColorSet=(pn)=>{
    const colorAry=pntritarCount.value.filter((Ary)=>Ary.pn===pn)[0];
    if(colorAry.green>0&&colorAry.yellow===0&&colorAry.red===0){
        return 'rgb(56, 219, 56)';
    }else if(colorAry.red>0){
        return 'rgb(255, 135, 135)';
    }else {
        return 'rgb(255, 209, 73)';
    }
};

watch(pncountObj,(newval,oldval)=>{
    console.log('pncountObj',newval,oldval)
});
watch(pntritarCount,(newval,oldval)=>{
    console.log('pntritarCount',newval,oldval)
});

const badgeStyle=ref({
    margin:'10px',
    width:'80px',
    height:'25px'
})
const avatarStyle=ref({
    width:'80px',
    height:'25px',
    fontSize:'14px',
    fontWeight:'700',
})


console.log('pntritarCount',pntritarCount.value)
</script>

<style  scoped>
.btn {
    display: flex;
    justify-content: flex-start;
    margin-top: 10px;
    margin-left: 10px;
}
.curset{
    cursor: pointer;
}

.active{
    background-color: rgb(53, 142, 219);
}
</style>