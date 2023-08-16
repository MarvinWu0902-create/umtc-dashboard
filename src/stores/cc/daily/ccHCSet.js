import { ref, computed, watch } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import pinia from '../../index.js';
import { UseccStore } from './ccFetch.js';
import { UseccTableStore } from './ccTableSet.js';
import Highcharts from 'highcharts';

const useccstore = UseccStore(pinia);
const { trendData,cc_params } = storeToRefs(useccstore);///全部的data 需要篩選partRecord的前100筆資料

const usetablestore = UseccTableStore(pinia);
const { partRecord } = storeToRefs(usetablestore);

export const UseHCStore = defineStore('dailyhccc', () => {

    const binAry = ref(['T15', 'T44', 'Yield']);

    const targetVal = ref('');
    const triggerVal = ref('');
    const radioItem = ref('all');

    const pntrendData = computed(() => {
        const save = trendData.value
            .filter((item) => item.partno === partRecord.value)
            .sort((a, b) => new Date(b.Time) - new Date(a.Time));

        targetVal.value = save.map((item) => item.Target)[0];
        triggerVal.value = save.map((item) => item.Triger)[0];
        return save
    });
    watch(pntrendData,(newval,oldval)=>{
        console.log('pntrendData',newval,oldval);
    })
    const machineData = computed(() => {
        return {part:partRecord.value,data:
            [...new Set(pntrendData.value
                .filter((item)=>item.Machine!==''&&Date.parse(item.Time)>=cc_params.value.st&&Date.parse(item.Time)<=cc_params.value.et)
                .map((item) => item.Machine)
                .sort((a,b)=>Number(a.substr(-1))-Number(b.substr(-1)))
                )
            ]
            };
    });
    watch(machineData,(newval,oldval)=>{
        console.log('machineData',newval,oldval)
    });



    // 
    // const xAxisAry = computed(() => {
    //     return pntrendData.value
    //         .map((item) => item.lotno)
    //         .slice(0, 100)
    //         .reverse();
    // });

    // const timeAry = computed(() => {
    //     return pntrendData.value
    //         .map((item) => new Date(item.Time))
    //         .slice(0, 100)
    //         .reverse();
    // });////選小到大前100批的時間


    // xAxisAry & timeAry 丟到  
    const seriesAry = computed(() => {
        const container = [];
        if(radioItem.value==='machine'){

            machineData.value.data.forEach((mac)=>{
                binAry.value.forEach((item) => {
                    const passObj = {};
                    if (item !== 'Yield') {
                        passObj.mac=mac;
                        passObj.type = 'column';
                        passObj.name = item;
                    } else {
                        passObj.mac=mac;
                        passObj.type = 'line';
                        passObj.name = 'CC';
                        passObj.yAxis = 1;
                        passObj.marker = {};
                        passObj.marker.enabled=true;
                        passObj.marker.lineWidth = 1;
                        passObj.marker.radius=3;
                        passObj.marker.lineColor = Highcharts.getOptions().colors[3];
                        passObj.marker.fillColor = 'white'
                    }
                    passObj.data = pntrendData.value
                        .filter((item)=>item.Machine===mac)
                        .map((obj) => Number(obj[item]) * 100)
                        .slice(0, 100)///時間大到小
                        .reverse();///再反轉成小至大
        
                    ///machine
                    passObj.machine = pntrendData.value
                        .filter((item)=>item.Machine===mac)
                        .map((obj) => obj.Machine)
                        .slice(0, 100)///時間大到小
                        .reverse();///再反轉成小至大
        
                    ///
                    container.push(passObj);
                })
            })
        }else{
            binAry.value.forEach((item) => {
                const passObj = {};
                if (item !== 'Yield') {
                    passObj.type = 'column';
                    passObj.name = item;
                } else {
                    passObj.type = 'line';
                    passObj.name = 'CC';
                    passObj.yAxis = 1;
                    passObj.marker = {};
                    passObj.marker.lineWidth = 2;
                    passObj.marker.lineColor = Highcharts.getOptions().colors[3];
                    passObj.marker.fillColor = 'white'
                }
                passObj.data = pntrendData.value
                    .map((obj) => Number(obj[item]) * 100)
                    .slice(0, 100)///時間大到小
                    .reverse();///再反轉成小至大
    
                ///machine
                passObj.machine = pntrendData.value
                    .map((obj) => obj.Machine)
                    .slice(0, 100)///時間大到小
                    .reverse();///再反轉成小至大
    
                ///
                container.push(passObj);
            })
        }

        return container
    });


    watch(seriesAry,(newval,oldval)=>{
        console.log('seriesAry',newval,oldval);
    });

    const scaleyieldMax=computed(()=>{
        return seriesAry.value
            .filter((item)=>item.name==='CC')
            .map((item)=>item.data)
            .flat()
            .sort((a,b)=>b-a)[0]
    });

    const scaledefectMax=computed(()=>{
        return seriesAry.value
            .filter((item)=>item.name!=='CC')
            .map((item)=>item.data)
            .flat()
            .sort((a,b)=>b-a)[0]
    });

    const scaleyieldMin=computed(()=>{
        return seriesAry.value
            .filter((item)=>item.name==='CC')
            .map((item)=>item.data)
            .flat()
            .sort((a,b)=>a-b)[0]
    });


    const scaledefectMin=computed(()=>{
        return seriesAry.value
            .filter((item)=>item.name!=='CC')
            .map((item)=>item.data)
            .flat()
            .sort((a,b)=>a-b)[0]
    });
    return {
        pntrendData,  seriesAry, partRecord, targetVal, triggerVal,machineData,radioItem,scaleyieldMax,scaleyieldMin,scaledefectMax,scaledefectMin
    }
})