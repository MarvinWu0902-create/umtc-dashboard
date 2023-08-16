import {ref,computed, watch, watchEffect} from 'vue';
import {defineStore,storeToRefs} from 'pinia';
import pinia from '@/stores/index.js';
import {UseaoiFocus}from '@/stores/aoi/aoifocus/aoiFocusFetch.js';

const useaoifocus=UseaoiFocus(pinia);
const {tableData,partCount}=storeToRefs(useaoifocus);

export const UseTableSetStore=defineStore('usetablesetstore',()=>{

    const partRecord=ref('6111C01');///預設首頁
    const ItemSelect = ref(10);
    const curPage = ref(1);
    
    const filterData=computed(()=>{
        return tableData.value.filter((item)=>item.PartNo===partRecord.value)
    });

    ///filterData 找出 未達標 達標 Trigger lot Count
    const overtargetCount=computed(()=>{
        return filterData.value.filter((item)=>item.Yield-item.Target>=0).length
    });
    const overtriggerCount=computed(()=>{
        return filterData.value.filter((item)=>item.Yield-item.Target<0&&item.Yield-item.Triger>=0).length
    });
    const undertriggerCount=computed(()=>{
        return filterData.value.filter((item)=>item.Yield-item.Triger<0).length
    });
    const totalCount=computed(()=>{
        return overtargetCount.value+overtriggerCount.value+undertriggerCount.value
    });

    const ItemStr=computed(()=>{
        return `顯示第${ItemSelect.value*(curPage.value-1)+1}至${ItemSelect.value*curPage.value>filterData.value.length?filterData.value.length:ItemSelect.value*curPage.value}項結果,共${filterData.value.length}項`
    });
    watch(ItemStr,(newval,oldval)=>{
        console.log(`ItemStr`,newval,oldval);
    })

    const PageItem=computed(()=>{
        return filterData.value.length%ItemSelect.value!==0?Math.floor(filterData.value.length/ItemSelect.value)+1:Math.floor(filterData.value.length/ItemSelect.value)
    });
    watchEffect(PageItem,(newval,oldval)=>{
        console.log('PageItem',newval,oldval);
    })

    const slicefilterAry = computed(() => {
        return filterData.value.slice(ItemSelect.value * (curPage.value - 1), (ItemSelect.value * curPage.value) > filterData.value.length ? filterData.value.length : (ItemSelect.value * curPage.value));
    });

    return {
        partRecord,filterData,slicefilterAry,ItemSelect,curPage,PageItem,ItemStr,overtargetCount,overtriggerCount,undertriggerCount,totalCount
    }
})