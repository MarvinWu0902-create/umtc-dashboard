<template>
    <div>
        <div ref="chart"></div>
    </div>
</template>

<script setup>

import { ref,watchEffect,nextTick, computed,onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js';
import Highcharts from 'highcharts';
import Heatmap from 'highcharts/modules/heatmap'



import { UseccstackStore } from '../../../stores/cc/stack/ccstackFetch.js';

const useccstackstore = UseccstackStore(pinia);

const { partData, param, stackData } = storeToRefs(useccstackstore);

const props = defineProps({
    Week: {
        type: String,
        require: true
    },
    defect:{
        type:String,
        require:true
    }
});

Heatmap(Highcharts);
const chart = ref(null);

watchEffect(() => {
    
    if (props.Week&&props.defect&&stackData.value.length>0) {///條件進入或是要watchEffect的值

        nextTick(() => {
            console.log('2');
            const mappingdata= stackData.value
                .filter((item)=>item.Week===props.Week)
                .map((item)=>
                [
                    Number(item.UnitX),
                    Number(item.UnitY),
                    Number(props.defect==='Yield'?item['All_rate']:item[`${props.defect}_rate`])
                    
                ]);
            

            const xAxisAry=[...new Set(stackData.value.map((item)=>Number(item.UnitX)-1))]
                .sort((a,b)=>a-b)
                .unshift(0)

            const yAxisAry=[...new Set(stackData.value.map((item)=>Number(item.UnitY)-1))]
                .sort((a,b)=>a-b)
                .unshift(0)


            Highcharts.chart(chart.value, {

                chart: {
                    width: 330,
                    height: 300,
                    type: 'heatmap',
                    // marginTop: 20,
                    // marginBottom: 20,
                    plotBorderWidth: 1
                },
                title: {
                    text: `${props.Week} Hot Zone`
                },
                xAxis: {
                    title: { text: ' ' }
                    ,
                    categories: xAxisAry
                },
                yAxis: {
                    title: {
                        text: ' '
                    },
                    categories: yAxisAry,
                    reversed: true
                },
                legend: {
                    enabled: false
                },
                colorAxis: {
                    min: 0,
                    max: 0.2,
                    stops: [
                        [0, "#80FF80"],
                        [0.1, "#A0FF80"],
                        [0.2, "#C0FF80"],
                        [0.3, "#E0FF80"],
                        [0.4, "#FFFF80"],
                        [0.5, "#FFFF40"],
                        [0.6, "#FFC840"],
                        [0.7, "#FF9640"],
                        [0.8, "#FF6440"],
                        [0.9, "#FF3240"],
                        [1, "#FF0040"]
                    ]
                },
                credits: false,
                series: [{
                    borderWidth: 1,
                    data: mappingdata,
                    dataLabels: {
                        enabled: true,
                        style: {
                            fontSize: '7px'
                        },
                        color: '#000000',
                        formatter: function () {
                            return (this.point.value * 100).toFixed(1) + '%'
                        }
                    }
                }]
            })
        })
    }
})


</script>

<style scoped>

</style>