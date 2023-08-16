<template>
    <div>
        <div ref="chart"></div>
    </div>
</template>

<script setup>
import { nextTick, ref, watchEffect } from 'vue';
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js'
import Highcharts from 'highcharts';

import {UseDefectStore} from '../../../stores/vi/daily/viDefectSet.js';
const usedefectstore=UseDefectStore(pinia);

const {getDefectData}=usedefectstore;
const {defectRawdata,defectSeries}=storeToRefs(usedefectstore);

const chart = ref(null);

const props = defineProps({
    alldata: {
        type: Object,
        require: true
    }
    // ,
    // defect:{
    //     type:String,
    //     require:true
    // }
});


watchEffect(() => {
    if (defectSeries.value.length > 0) {
        nextTick(() => {
            Highcharts.chart(chart.value,{
                chart:{
                    type: 'line',
                    width: 1000,
                    height:300,
                    zoomType: 'x',
                    resetZoomButton: {
                        position: {
                            // align: 'right', // by default
                            // verticalAlign: 'top', // by default
                            x: 0,
                            y: -40
                        }
                    }
                },
                title: {
                    text: `${props.alldata.name} Trend Chart`
                },
                xAxis:{
                    type:'category',
                    categories:props.alldata.time,///categoryAry.value,
                    title:'Time',
                    labels:{
                        rotation:90,
                        style:{
                            fontSize:'8px'
                        }
                    }
                },
                yAxis:{
                    title:'Value',
                    labels: {
                        format: '{value}%',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                },
                tooltip: {
                    formatter: function () {
                        return `<strong>${this.x}</strong><br><a style='color:${this.series.color}'>${this.series.name}</a>:${this.y.toFixed(2)}%<br><strong>${this.series.userOptions.lotnumber[this.point.index]}</strong>`
                    }
                },
                credits:false,
                series:[props.alldata]
            })
        })
    }
});
</script>

<style scoped>

</style>