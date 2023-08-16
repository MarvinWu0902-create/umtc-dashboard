<template>
    <div class="showCount" v-if="filterTable.length > 0">
        <!-- <div>顯示{{ ItemSelect }}項結果</div> -->
        <p>顯示</p><select v-model="ItemSelect">
            <option>5</option>
            <option>10</option>
            <option>15</option>
            <option>20</option>
        </select>
        <p>項結果</p>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import pinia from "@/stores/index.js";
import { UsefliTableSet } from '@/stores/fli/fliTableSet.js';
import { UsefliFetch } from '@/stores/fli/fliFetch.js';

const useflitableset = UsefliTableSet(pinia);
const useflifetch = UsefliFetch(pinia);

const {ItemSelect,TotalItem,PageItem,ItemStr} = storeToRefs(useflitableset);
const {filterTable} = storeToRefs(useflifetch);

// console.log(ItemResult.value,TotalItem.value,PageItem.value,ItemStr.value )
watch(TotalItem,(newval,oldval)=>{
    console.log('TotalItem',newval,oldval);
})
watch(PageItem,(newval,oldval)=>{
    console.log('PageItem',newval,oldval);
});
watch(ItemStr,(newval,oldval)=>{
    console.log('ItemStr',newval,oldval);
})
</script>

<style scoped>
.showCount{
    display: flex;
    justify-content: left;
    align-items: center;
    margin-left: 5px;
    color: blue;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    font-size: 12px;
}


</style>