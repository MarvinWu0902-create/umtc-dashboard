import {ref,computed,watch} from 'vue';
import {defineStore,storeToRefs}from 'pinia';
import pinia from '../../index.js';
import {UseviStore}from './viFetch.js';
import {UseTableStore} from './viTableSet.js';
import Highcharts from 'highcharts';

const usevistore=UseviStore(pinia);
const {trendData}=storeToRefs(usevistore);///全部的data 需要篩選partRecord的前100筆資料

const usetablestore=UseTableStore(pinia);
const {partRecord}=storeToRefs(usetablestore);


export const UseHCStore=defineStore('dailyhcvi',()=>{
    
    // const trendfilterData=ref([]);

    const binAry=ref(['A0','A1','A3','A5-3','A5','A6','A6-B',
    'A6-W','A1-T','A1-W','A1-P','A10','A11','B6','D0','D1',
    'D8','D2','D5-1','D5','D6','D14','G4','J0','J16','G17','VIYield']);
    const targetVal=ref('');
    const triggerVal=ref('');

    const pntrendData=computed(()=>{

        const save=trendData.value
            .filter((item)=>item.PartNo===partRecord.value)
            .sort((a,b)=>new Date(b.Datatime)-new Date(a.Datatime))

            targetVal.value=save.map((item)=>item.Target)[0];
            triggerVal.value=save.map((item)=>item.Triger)[0];
        return save
            // .map((item)=>item.checkouttime);
    });///時間由大到小

    // const targetValue=computed(()=>{
    //     return pntrendData.value.map((item)=>item.target)[0]
    // });
    // const 


    const xAxisAry=computed(()=>{
        return pntrendData.value
            .map((item)=>item.LotNum)
            .slice(0,100)
            .reverse();
    });///選時間大到小前100批->又反轉回小至大
    const timeAry=computed(()=>{
        return pntrendData.value
            .map((item)=>new Date(item.Datatime))
            .slice(0,100)
            .reverse();
    });////選小到大前100批的時間

    const seriesAry = computed(() => {
        const container = [];
        binAry.value.forEach((item) => {
            const passObj = {};
            if (item !== 'VIYield') {
                passObj.type = 'column';
                passObj.name = item;
            } else {
                passObj.type = 'line';
                passObj.name = 'VI';
                passObj.yAxis = 1;
                passObj.marker = {};
                passObj.marker.lineWidth = 2;
                passObj.marker.lineColor = Highcharts.getOptions().colors[3];
                passObj.marker.fillColor = 'white'
            }
            passObj.data = pntrendData.value
                .map((obj) => Number(obj[item]))
                .slice(0, 100)///時間大到小
                .reverse();///再反轉成小至大
            container.push(passObj);
        })
        return container
    })


    watch(xAxisAry,(newval,oldval)=>{
        console.log('xAxisAry',newval,oldval);
    })
    watch(seriesAry,(newval,oldval)=>{
        console.log('seriesAry',newval,oldval);
    })

    

    

    return {
        pntrendData,xAxisAry,seriesAry,partRecord,timeAry,targetVal,triggerVal
    }
})

