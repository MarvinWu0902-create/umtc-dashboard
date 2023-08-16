<template>
    <div class="loayout">
        <focusHC 
            :options="eachfbAry" 
            :xAxis="xaxisAry" 
            v-for="eachfbAry of canvasData" 
            :key="eachfbAry.PN+eachfbAry.FB"
            ref="focusHCRefs"
            />
    </div>
</template>

<script setup>
import {ref, watch,onBeforeUpdate} from 'vue'
import pinia from '@/stores/index.js'
import {defineStore,storeToRefs} from 'pinia'
import {SetAosStore} from '@/stores/aoi/aoifocus/aoiFocusaosTrend.js'
import Highcharts from 'highcharts'

import focusHC from './focusHC.vue'


const setaosstore=SetAosStore(pinia);
const {xaxisAry,canvasData}=storeToRefs(setaosstore);

watch(canvasData,(newval,oldval)=>{
    console.log('canvasData',newval,oldval);
})
const focusHCRefs=ref([]);///->Highchart陣列實例

// watch(canvasData,(newval,oldval)=>{
//     console.log('canvasData',newval,oldval);
//     console.log('Highcharts.charts f',Highcharts.charts);
//     Highcharts.charts.forEach((chart)=>{
//         if(chart){
//             chart.destroy();
//         }
//     })
//     Highcharts.charts.length=0;
//     console.log('Highcharts.charts',Highcharts.charts);
//     console.log('focusHCRefs.value',focusHCRefs.value);

// })


// watch(canvasData,(newval,oldval)=>{
//     // if(focusHCRefs.value.length>0){
//         // const refs=focusHCRefs.value
//         // for(const key of refs){
//         //     const instance=refs[key];
//         //     instance.destroy();
//         // }
//         // focusHCRefs.value={};
//         // console.log('focusHCRefs.value',focusHCRefs.value)
//         // focusHCRefs.value.forEach(el => {
//         //     console.log('el',el.componentInstance);
//         //     console.log('hi',Highcharts.chart);
//         //     console.log('hi2',Highcharts.charts);
//         //     const testh=Highcharts.charts.find(chart=>chart.renderTo===el);
//         //     console.log('testh',testh);
//         console.log('1');
//         console.log('focusHCRefs.value',focusHCRefs.value);
//         console.log('Highcharts.charts',Highcharts.charts);
//         Highcharts.charts.forEach(ch=>{
//                 ch.destroy();
//             })
//             console.log('Highcharts.charts 2',Highcharts.charts);
//         // });
//         focusHCRefs.value={};
//         console.log('focusHCRefs.value 2',focusHCRefs.value);


//     // }
// });




</script>

<style scoped>
.loayout{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content:space-between
}
</style>