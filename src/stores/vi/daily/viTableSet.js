import {ref,computed,watch} from 'vue';
import {defineStore,storeToRefs}from 'pinia'
import pinia from '../../index.js';
import {UseviStore}from './viFetch.js'

const usevistore=UseviStore(pinia);
const {tableData,deviceData}=storeToRefs(usevistore);


export const UseTableStore=defineStore('dailyvitable',()=>{

///tableData 是 時間區間產出資料
///，不分Device/料號
const partRecord=ref('');//要抓第一個
const deviceRecord=ref('Client');//預設Client

const ItemSelect = ref(10);
const curPage = ref(1);


const pnAry=computed(()=>{
    return [...new Set(tableData.value
        .filter((item)=>item.ProdClass===deviceRecord.value)
        .map((item)=>item.PartNo))]
        .sort((a,b)=>b-a)
});///預設/點擊 device&篩選時間 產出的pnAry
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

    const filtertableData = computed(() => {
        return tableData.value/////時間區間產出的批
            .filter((item) => item.ProdClass === deviceRecord.value
                && item.PartNo === partRecord.value
                &&item.Triger-(Number(item.VIYield)/100)>0)
    });////產出且被Tri的批

    const filterTotaltableData=computed(()=>{
        return tableData.value.filter((item)=>item.ProdClass === deviceRecord.value&&item.PartNo === partRecord.value);
    });////個別產出
    const tableInfo=computed(()=>{
        const passBox={};////{tri:1,avg:0.95}
        const triCount=filterTotaltableData.value.filter((item)=>(item.VIYield/100)-item.Triger<0)
            .map((item)=>Number(item)).length;
        const avgValue=filterTotaltableData.value.map((item)=>item.VIYield)
            .reduce((acc,cur)=>Number(acc)+Number(cur),0)/filterTotaltableData.value.length;
        passBox.tri=triCount;
        passBox.avg=avgValue;
        return passBox;
    });
    watch(partRecord,(newval,oldval)=>{
        console.log('partRecord',newval,oldval)
    });
    watch(deviceRecord,(newval,oldval)=>{
        console.log('deviceRecord',newval,oldval)
    });
watch(filtertableData,(newval,oldval)=>{
    console.log('filtertableData',newval,oldval)
});


const pntritarCount=computed(()=>{///預設會先跑一次
    const countBox=[];
    pnAry.value.forEach((eachpart)=>{
        countBox.push({
            pn:eachpart,
            count:tableData.value.filter((item)=>item.PartNo===eachpart).length,
            green:tableData.value.filter((item)=>item.PartNo===eachpart&&Number(item.Target)-(Number(item.VIYield)/100)<=0).length,
            yellow:tableData.value.filter((item)=>item.PartNo===eachpart&&Number(item.Triger)-(Number(item.VIYield)/100)<=0&&Number(item.Target)-(Number(item.VIYield)/100)>0).length,
            red:tableData.value.filter((item)=>item.PartNo===eachpart&&Number(item.Triger)-(Number(item.VIYield)/100)>0).length
        })
    })
    return countBox
});

const ItemStr=computed(()=>{
    return `顯示第${ItemSelect.value*(curPage.value-1)+1}至${ItemSelect.value*curPage.value>filtertableData.value.length?filtertableData.value.length:ItemSelect.value*curPage.value}項結果,共${filtertableData.value.length}項`
});
const PageItem=computed(()=>{
    return filtertableData.value.length%ItemSelect.value!==0?Math.floor(filtertableData.value.length/ItemSelect.value)+1:Math.floor(filtertableData.value.length/ItemSelect.value)
});

const slicefilterAry = computed(() => {
    return filtertableData.value
        .slice(ItemSelect.value * (curPage.value - 1), (ItemSelect.value * curPage.value) > filtertableData.value.length ? filtertableData.value.length : (ItemSelect.value * curPage.value));
});



    ///做出Table 要用當前點擊的Device/料號 去篩出要渲染的Table
    return {
        deviceRecord,partRecord,pnAry,pntritarCount,filtertableData,filterTotaltableData,tableInfo,curPage,ItemStr,ItemSelect,PageItem,slicefilterAry
    }
})

