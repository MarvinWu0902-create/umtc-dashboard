<template>
  <div>
    <div class="top-area">
      <div class="left-group">
        <IndexpartBtn />
        <Indexhc />
      </div>
      <IndexhcBtn class="right-group"/>
    </div>
    <br>
    <hcTable />
    <br>
    <daysumTable />
    <br>
    <daydetailTable />
    <br>

  </div>
</template>
<!-- {{ filterData }} -->
<script setup>
import { ref, onMounted,onUnmounted, watch,computed } from "vue";
import { storeToRefs } from "pinia";
import pinia from "@/stores/index.js";
import {NSpace,NSwitch} from 'naive-ui'

import { UseIndexFetch } from "@/stores/Index/IndexFetch.js";

import { UseBtnStore } from "@/stores/Index/IndexBtn.js";
// import { UseHcStore } from '../stores/Index/hcshare.js';
// import Highcharts from "highcharts";

import IndexhcBtn from '@/components/index/IndexhcBtn.vue'
import IndexpartBtn from '@/components/index/IndexpartBtn.vue'
import Indexhc from '@/components/index/Indexhc.vue'
import hcTable from '@/components/index/hcTable.vue'
import daysumTable from '@/components/index/daysumTable.vue'
import daydetailTable from '@/components/index/daydetailTable.vue'


const usefetstore = UseIndexFetch(pinia);

const usebtnstore = UseBtnStore(pinia);

const { IndexfetchData} = usefetstore;
const { filterClick,btnClick,activeBtn} = usebtnstore;

const { errmsg, Index_params} = storeToRefs(usefetstore);

const { filterData,partBtn,partList} = storeToRefs(usebtnstore);///filterData 要去Indexhc 處理






onMounted(()=>{
  IndexfetchData();
})


// onUnmounted(() => {
//     if (chartContainer.value) {
//       chartContainer.value.destroy();
//     }
//   });
</script>

<style>
.top-area{
  width: 100%;
  display: flex;
}

.left-group{
  width: 85%;
}
.right-group{
  width:15%;
  display: flex;
  flex-wrap: wrap;
  /* justify-content: center; */
  justify-content: flex-start;
  align-content: flex-start;
  
}
</style>
