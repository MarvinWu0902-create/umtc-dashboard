<template>
    <div class="showCount" v-if="filterData.length > 0">
        <!-- <div>顯示{{ ItemSelect }}項結果</div> -->
        <div class="showRow">
            <p>顯示</p><select v-model="ItemSelect">
                <option>5</option>
                <option>10</option>
                <option>15</option>
                <option>20</option>
            </select>
            <p>項結果</p>
        </div>


        <div class="lightball">
            <span :style="lightRed"></span><a>&nbsp;Trigger: {{ undertriggerCount }} 批({{(undertriggerCount/totalCount*100).toFixed(0)}}%)&nbsp;</a>
            <span :style="lightYellow"></span><a>&nbsp;未達標: {{ overtriggerCount }} 批({{(overtriggerCount/totalCount*100).toFixed(0)}}%)&nbsp;</a>
            <span :style="lightGreen"></span><a>&nbsp;達標: {{ overtargetCount }} 批({{(overtargetCount/totalCount*100).toFixed(0)}}%)&nbsp;</a>
            <a>，共 {{totalCount}} 批</a>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import pinia from "@/stores/index.js";

import {UseTableSetStore} from '@/stores/aoi/aoifocus/aoiFocusTableSet.js'
const usetablesetstore=UseTableSetStore(pinia);
const {slicefilterAry,filterData,ItemSelect,overtargetCount,overtriggerCount,undertriggerCount,totalCount}=storeToRefs(usetablesetstore);


const lightRed=ref({
    background:'#ff8787',
    border: '1px solid #ababab',
    borderRadius: '50% 50% 50% 50%',
    width: '15px',
    height: '15px'
});
const lightYellow=ref({
    background:'#ffd149',
    border: '1px solid #ababab',
    borderRadius: '50% 50% 50% 50%',
    width: '15px',
    height: '15px'
});
const lightGreen=ref({
    background:'#38db38',
    border: '1px solid #ababab',
    borderRadius: '50% 50% 50% 50%',
    width: '15px',
    height: '15px'
});


</script>

<style  scoped>
.showRow{
    display: flex;
    align-items: center;
}
.showCount{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 5px;
    color: blue;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    font-size: 12px;
}
.lightball{
    display: flex;
    justify-content: flex-end;
    margin-right: 5px;
    align-items: center;
    width: 50%;
}
a{
    color: rgb(123, 123, 123);font-size: 14px;
}
/* background: #ff8787;border: 1px solid #ababab;border-radius: 50% 50% 50% 50%;width: 15px;height: 15px; */
</style>