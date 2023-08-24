import { ref, computed, watch } from "vue";
import { defineStore, storeToRefs } from "pinia";
import pinia from "@/stores/index.js";
import { UsefliFetch } from '@/stores/fli/fliFetch.js';
const useflifetch = UsefliFetch(pinia);
const { tableData,filterTable } = storeToRefs(useflifetch);


export const UsefliTableSet = defineStore('usefliset', () => {

    const partRecord = ref('');//要抓第一個

    const ItemSelect = ref(10);
    const curPage = ref(1);

    const pnAry=computed(()=>{
        return  [...new Set(tableData.value
            .map((item)=>item.PN))]
            .sort((a,b)=>b-a)
    });

    watch(pnAry,(newval,oldval)=>{
        const currentPart=partRecord.value;
        oldval.some((item)=>newval.includes(item))
        ?partRecord.value=currentPart////為當前device或是切換時間後少了一些part
        ////0.['a(v)','b']->['a(v)','b','c']
        ////1.['a(v)','b','c']->['b','c']
        ///當前device不管變多變少都選點擊的a
        :partRecord.value=newval[0]///切換device
        ///0.['a','b','c']->['d','e','f']-->['d(v)','e','f'] 切換device
    });


    const filterTable = computed(() => {
        return tableData.value.filter((item) =>item.PN===partRecord.value&&Number(item.Yield) -  Number(item.Triger) < 0);
    });


    const filterTotaltableData=computed(()=>{
        return tableData.value.filter((item)=>item.PN === partRecord.value);
    });////個別產出

    const tableInfo=computed(()=>{
        const passBox={};////{tri:1,avg:0.95}
        const triCount=filterTotaltableData.value.filter((item)=>item.Yield-item.Triger<0)
            .map((item)=>item).length;
        const avgValue=filterTotaltableData.value.map((item)=>item.Yield)
            .reduce((acc,cur)=>Number(acc)+Number(cur),0)/filterTotaltableData.value.length;
        passBox.tri=triCount;
        passBox.avg=avgValue;
        return passBox;
    });

    const pntritarCount=computed(()=>{///預設會先跑一次
        const countBox=[];
        pnAry.value.forEach((eachpart)=>{
            countBox.push({
                pn:eachpart,
                count:tableData.value.filter((item)=>item.PN===eachpart).length,
                green:tableData.value.filter((item)=>item.PN===eachpart&&Number(item.Target)-Number(item.Yield)<=0).length,
                // yellow:tableData.value.filter((item)=>item.PN===eachpart&&Number(item.Triger)-Number(item.Yield)<=0&&Number(item.Target)-Number(item.Yield)>0).length,
                red:tableData.value.filter((item)=>item.PN===eachpart&&Number(item.Triger)-Number(item.Yield)>0).length
            })
        })
        return countBox
    });



    const TotalItem = computed(() => {
        return filterTable.value.length;
    });
    const PageItem = computed(() => {
        return TotalItem.value % ItemSelect.value !== 0 ? Math.floor(TotalItem.value / ItemSelect.value) + 1 : Math.floor(TotalItem.value / ItemSelect.value)
    });

    const ItemStr = computed(() => {
        return `顯示第${ItemSelect.value * (curPage.value - 1) + 1}至${(ItemSelect.value * curPage.value) > TotalItem.value ? TotalItem.value : (ItemSelect.value * curPage.value)}項結果,共${filterTable.value.length}項`
    });


    const slicefilterAry = computed(() => {
        return filterTable.value.slice(ItemSelect.value * (curPage.value - 1), (ItemSelect.value * curPage.value) > TotalItem.value ? TotalItem.value : (ItemSelect.value * curPage.value));
    });

    return {
        ItemSelect,
        TotalItem,
        curPage,
        PageItem,
        ItemStr,
        pnAry,
        partRecord,
        filterTable,
        filterTotaltableData,
        slicefilterAry,
        tableInfo,
        pntritarCount
    }
})