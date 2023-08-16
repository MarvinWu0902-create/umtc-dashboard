import { ref, computed, watch } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import pinia from '../../index.js';
import { UsebumpStore } from './bumpFetch.js';
import { UsebumpTableStore } from './bumpTableSet.js';
import Highcharts from 'highcharts';

const usebumpstore = UsebumpStore(pinia);
const { trendData,bump_params } = storeToRefs(usebumpstore);///全部的data 需要篩選partRecord的前100筆資料

const usetablestore = UsebumpTableStore(pinia);
const { partRecord } = storeToRefs(usetablestore);

export const UseHCStore = defineStore('dailyhcbump', () => {
    const binAry = ref(['CTV', 'BTV', 'HVSB', 'LVSB', 'MB', 'Others', 'Yield']);

    const targetVal = ref('');
    const triggerVal = ref('');
    const radioItem = ref('all');

    // const scaleyieldMax=ref(0);
    // const scaleyieldMin=ref(0);

    // const scaledefectMax=ref(0);
    // const scaledefectMin=ref(0);


    const pntrendData = computed(() => {
        const save = trendData.value
            .filter((item) => item.partno === partRecord.value)
            .sort((a, b) => new Date(b.checkouttime) - new Date(a.checkouttime));

        targetVal.value = save.map((item) => item.Target)[0];
        triggerVal.value = save.map((item) => item.Triger)[0];
        return save
    });



    const machineData = computed(() => {
        return {part:partRecord.value,data:
            [...new Set(pntrendData.value
                .filter((item)=>item.u_ball_name!==''&&Date.parse(item.checkouttime)>=bump_params.value.st&&Date.parse(item.checkouttime)<=bump_params.value.et)
                .map((item) => item.u_ball_name)
                .sort((a,b)=>Number(a.substr(-3))-Number(b.substr(-3)))
                )
            ]
            };
    });
    ////這樣是抓這個料號全部機台別

    // const xAxisAry = computed(() => {
    //     return pntrendData.value
    //         .map((item) => item.lotno)
    //         .slice(0, 100)
    //         .reverse();
    // });
    // const timeAry = computed(() => {
    //     return pntrendData.value
    //         .map((item) => new Date(item.checkouttime))
    //         .slice(0, 100)
    //         .reverse();
    // });////選小到大前100批的時間


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
                        passObj.name = 'Bump';
                        passObj.yAxis = 1;
                        passObj.marker = {};
                        passObj.marker.enabled=true;
                        passObj.marker.lineWidth = 1;
                        passObj.marker.radius=3;
                        passObj.marker.lineColor = Highcharts.getOptions().colors[3];
                        passObj.marker.fillColor = 'white'
                    }
                    passObj.data = pntrendData.value
                        .filter((item)=>item.u_ball_name===mac)
                        .map((obj) => Number(obj[item]) * 100)
                        .slice(0, 100)///時間大到小
                        .reverse();///再反轉成小至大
        
                    ///machine
                    passObj.ctv = pntrendData.value
                        .filter((item)=>item.u_ball_name===mac)
                        .map((obj) => obj.ctv_name)
                        .slice(0, 100)///時間大到小
                        .reverse();///再反轉成小至大
        
                    passObj.uball = pntrendData.value
                        .filter((item)=>item.u_ball_name===mac)
                        .map((obj) => obj.u_ball_name)
                        .slice(0, 100)///時間大到小
                        .reverse();///再反轉成小至大
    
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
                        passObj.name = 'Bump';
                        passObj.yAxis = 1;
                        passObj.marker = {};
                        passObj.marker.enabled=true;
                        passObj.marker.lineWidth = 1;
                        passObj.marker.radius=3;
                        passObj.marker.lineColor = Highcharts.getOptions().colors[3];
                        passObj.marker.fillColor = 'white'
                    }
                    passObj.data = pntrendData.value
                        .map((obj) => Number(obj[item]) * 100)
                        .slice(0, 100)///時間大到小
                        .reverse();///再反轉成小至大
        
                    ///machine
                    passObj.ctv = pntrendData.value
                        .map((obj) => obj.ctv_name)
                        .slice(0, 100)///時間大到小
                        .reverse();///再反轉成小至大
        
                    passObj.uball = pntrendData.value
                        .map((obj) => obj.u_ball_name)
                        .slice(0, 100)///時間大到小
                        .reverse();///再反轉成小至大
    
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
            .filter((item)=>item.name==='Bump')
            .map((item)=>item.data)
            .flat()
            .sort((a,b)=>b-a)[0]
    });

    const scaledefectMax=computed(()=>{
        return seriesAry.value
            .filter((item)=>item.name!=='Bump')
            .map((item)=>item.data)
            .flat()
            .sort((a,b)=>b-a)[0]
    });


    const scaleyieldMin=computed(()=>{
        return seriesAry.value
            .filter((item)=>item.name==='Bump')
            .map((item)=>item.data)
            .flat()
            .sort((a,b)=>a-b)[0]
    });


    const scaledefectMin=computed(()=>{
        return seriesAry.value
            .filter((item)=>item.name!=='Bump')
            .map((item)=>item.data)
            .flat()
            .sort((a,b)=>a-b)[0]
    });
// Max 有點問題


    return {
        pntrendData, seriesAry, partRecord,  targetVal, triggerVal,machineData,radioItem,scaleyieldMax,scaleyieldMin,scaledefectMax,scaledefectMin
    }
})