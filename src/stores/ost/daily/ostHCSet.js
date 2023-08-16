import {ref,computed,watch} from 'vue';
import {defineStore,storeToRefs}from 'pinia';
import pinia from '../../index.js';
import {UseostStore}from './ostFetch.js';
import {UseTableStore} from './ostTableSet.js';
import Highcharts from 'highcharts';

const useoststore=UseostStore(pinia);
const {trendData}=storeToRefs(useoststore);///全部的data 需要篩選partRecord的前100筆資料

const usetablestore=UseTableStore(pinia);
const {partRecord}=storeToRefs(usetablestore);


export const UseHCStore=defineStore('dailyhcost',()=>{
    
    // const trendfilterData=ref([]);

    const binAry=ref(['Bin07','Bin08','Bin10','Bin21','Bin22',
    'Bin23','Bin31_aoi','Bin31_aos','Bin31_clear',
    'Bin32','Bin33','Bin91','Bin92','Bin99','Yield']);
    const targetVal=ref('');
    const triggerVal=ref('');

    const pntrendData=computed(()=>{

        const save=trendData.value
            .filter((item)=>item.partno===partRecord.value)
            .sort((a,b)=>new Date(b.checkouttime)-new Date(a.checkouttime))

            targetVal.value=save.map((item)=>item.target)[0];
            triggerVal.value=save.map((item)=>item.triger)[0];
        return save
            // .map((item)=>item.checkouttime);
    });///時間由大到小

    // const targetValue=computed(()=>{
    //     return pntrendData.value.map((item)=>item.target)[0]
    // });
    // const 


    const xAxisAry=computed(()=>{
        return pntrendData.value
            .map((item)=>item.lotno)
            .slice(0,100)
            .reverse();
    });///選時間大到小前100批->又反轉回小至大
    const timeAry=computed(()=>{
        return pntrendData.value
            .map((item)=>new Date(item.checkouttime))
            .slice(0,100)
            .reverse();
    });////選小到大前100批的時間

    const seriesAry = computed(() => {
        const container = [];
        binAry.value.forEach((item) => {
            const passObj = {};
            if (item !== 'Yield') {
                passObj.type = 'column';
                switch (item) {
                    case 'Bin31_aoi':
                        passObj.name='AOI Short';
                        break;
                    case 'Bin31_aos':
                        passObj.name='AOS Short';
                        break;
                    case 'Bin31_clear':
                        passObj.name='LtL Short';
                        break;
                    default:
                        passObj.name = item;
                        break;
                }
            } else {
                passObj.type='line';
                passObj.name='OST';
                passObj.yAxis=1;
                passObj.marker={};
                passObj.marker.lineWidth=2;
                passObj.marker.lineColor=Highcharts.getOptions().colors[3];
                passObj.marker.fillColor='white'
            }
            passObj.data=pntrendData.value
                .map((obj) => Number(obj[item])*100)
                .slice(0, 100)///時間大到小
                .reverse();///再反轉成小至大
            container.push(passObj);

        });
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

