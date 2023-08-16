import { ref, computed, watch } from "vue";
import { defineStore, storeToRefs } from "pinia";
import pinia from "@/stores/index.js";
import { UsefliFetch } from '@/stores/fli/fliFetch.js';
const useflifetch = UsefliFetch(pinia);
const { filterTable } = storeToRefs(useflifetch);


export const UsefliTableSet = defineStore('usefliset', () => {


    const ItemSelect = ref(10);
    // const TotalItem = ref(0);
    const curPage = ref(1);
    const TotalItem = computed(() => {
        return filterTable.value.length;
    });
    const PageItem = computed(() => {
        return TotalItem.value % ItemSelect.value !== 0 ? Math.floor(TotalItem.value / ItemSelect.value) + 1 : Math.floor(TotalItem.value / ItemSelect.value)
    });

    // TotalItem.value = filterTable.value.length;
    // PageItem.value = TotalItem.value % ItemSelect.value !== 0 ? Math.floor(TotalItem.value / ItemSelect.value) + 1 : Math.floor(TotalItem.value / ItemSelect.value)

    const ItemStr = computed(() => {
        return `顯示第${ItemSelect.value * (curPage.value - 1) + 1}至${(ItemSelect.value * curPage.value) > TotalItem.value ? TotalItem.value : (ItemSelect.value * curPage.value)}項結果,共${filterTable.value.length}項`
    });


    const slicefilterAry = computed(() => {
        return filterTable.value.slice(ItemSelect.value * (curPage.value - 1), (ItemSelect.value * curPage.value) > TotalItem.value ? TotalItem.value : (ItemSelect.value * curPage.value));
    })

    return {
        ItemSelect, TotalItem, curPage, PageItem, ItemStr, slicefilterAry
    }
})