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

import { UsebumpStore } from '../../../stores/bump/daily/bumpFetch.js';
import { UseHCStore } from '../../../stores/bump/daily/bumpHCSet.js'

const usebumpstore = UsebumpStore(pinia);
const { bump_params,fetchStauts } = storeToRefs(usebumpstore);

const usehcstore = UseHCStore(pinia);
const { pntrendData,seriesAry, partRecord,targetVal, triggerVal, machineData,radioItem,scaleyieldMax,scaleyieldMin,scaledefectMax,scaledefectMin } = storeToRefs(usehcstore);


const props=defineProps({
    machine:{
        type:String,
        default:''
    }
});

const chart = ref(null);

watchEffect(() => {
    // if (xAxisAry.value.length > 0) {
        // console.log('partRecord',partRecord.value);
        console.log('props.machine',props.machine);
        if (
            (props.machine!==''&&radioItem.value==='machine'&&partRecord.value&&seriesAry.value)
            ||
            (props.machine===''&&radioItem.value==='all'&&fetchStauts.value&&partRecord.value&&seriesAry.value)) {
        nextTick(() => {

            console.log('props.machine',props.machine);
            const xAxisAry=radioItem.value==='machine'
                ?pntrendData.value
                    .filter((item)=>item.u_ball_name===props.machine)
                    .map((item) => item.lotno)
                    .slice(0, 100)
                    .reverse()
                :pntrendData.value
                    .map((item) => item.lotno)
                    .slice(0, 100)
                    .reverse();

            const timeAry=radioItem.value==='machine'
                ?pntrendData.value
                    .filter((item)=>item.u_ball_name===props.machine)
                    .map((item) => new Date(item.checkouttime))
                    .slice(0, 100)
                    .reverse()
                :pntrendData.value
                    .map((item) => new Date(item.checkouttime))
                    .slice(0, 100)
                    .reverse();

            Highcharts.chart(chart.value, {
                chart: {
                    type: 'areaspline',
                    zoomType: 'x',
                    resetZoomButton: {
                        position: {
                            // align: 'right', // by default
                            // verticalAlign: 'top', // by default
                            x: 0,
                            y: -40
                        }
                    }
                }
                ,
                title: {
                    text: `${radioItem.value==='machine'?props.machine:partRecord.value} Bump Trend Chart`
                }
                ,
                xAxis: {
                    categories: xAxisAry,/////xAxisAry.value,//// xAxis array

                    plotBands: [{
                        color: 'rgba(255,81,81,0.1)',
                        from: timeAry.findIndex((item) => item > new Date(bump_params.value.st)),
                        to: timeAry.findIndex((item) => item > new Date(bump_params.value.et)) === -1
                            ? timeAry.length - 1
                            : timeAry.findIndex((item) => item > new Date(bump_params.value.et)) - 1,
                        zIndex: -1,
                    }],

                    labels: {
                        // text: '123',
                        rotation: 90,
                        align: 'bottom',
                        style: {
                            fontSize: '7px'
                        }
                    }
                }
                ,
                // scaleyieldMax,scaleyieldMin,scaledefectMax,scaledefectMin
                yAxis: [{///第一個y軸
                    max:scaledefectMax.value,
                    min:scaledefectMin.value,
                    labels: {
                        format: '{value}%',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                    ,
                    title: {
                        text: 'Defect Loss',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                },
                {
                    ///targetVal,triggerVal
                    plotLines: [{
                        color: 'black',
                        width: 2,
                        value: targetVal.value*100,
                        zIndex: 4,
                        label: {
                            x: 20,
                            y: -10,
                            text: `Tag.:${(targetVal.value*100).toFixed(1)}%`,
                            rotation: 0,
                            style: {
                                color: 'black',
                                font: '10px inherit'
                            }
                        },
                        dashStyle: 'ShortDash'
                    },
                    {
                        color: 'red',
                        width: 2,
                        value: triggerVal.value*100,
                        zIndex: 4,
                        label: {
                            x: 20,
                            y: -10,
                            text: `Tri.:${(triggerVal.value*100).toFixed(1)}%`,
                            rotation: 0,
                            style: {
                                color: 'red',
                                font: '10px inherit'
                            }
                        },
                        dashStyle: 'ShortDash'
                    }
                    ],
                    max:scaleyieldMax.value,
                    min:scaleyieldMin.value,
                    title: {
                        text: 'Bump Yield',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value}%',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    opposite: true
                }
                ]
                ,
                credits: false
                ,
                plotOptions: {
                    column: {
                        pointPadding: 0.01,
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black'
                            }
                        }
                    }
                }
                ,
                tooltip: {
                    formatter: function () {
                        return `<strong>${this.x}</strong><br>
                        <a style='color:${this.series.color}'>${this.series.name}</a>:${this.y.toFixed(1)}%<br>
                        <strong>${this.series.userOptions.ctv[this.point.index]}</strong>
                        <strong>${this.series.userOptions.uball[this.point.index]}</strong>
                        `
                    }
                }
                ,
                accessibility: {
                    enabled: false
                }
                ,
                series: radioItem.value==='machine'?seriesAry.value.filter((item)=>item.mac===props.machine):seriesAry.value
            })
        });
    }
});
</script>

<style scoped>

</style>