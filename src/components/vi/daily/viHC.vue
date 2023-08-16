<template>
    <div>
        <div ref="chart"></div>
    </div>
</template>

<script setup>
import { nextTick, ref,computed ,watch, watchEffect,onMounted,onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js'
import Highcharts from 'highcharts';

import { UseviStore } from '../../../stores/vi/daily/viFetch.js';
import { UseHCStore } from '../../../stores/vi/daily/viHCSet.js'

const usevistore = UseviStore(pinia);
const { vi_params } = storeToRefs(usevistore);

const usehcstore = UseHCStore(pinia);
const { pntrendData, xAxisAry, seriesAry, partRecord, timeAry, targetVal, triggerVal } = storeToRefs(usehcstore);


const chart = ref(null);



watchEffect(() => {
    if (xAxisAry.value.length > 0) {
        nextTick(() => {
            ///targetVal,triggerVal
            console.log('targetVal', targetVal.value);
            console.log('triggerVal', triggerVal.value);
        
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
                    text: `${partRecord.value} VI Trend Chart`
                }
                ,
                xAxis: {
                    categories: xAxisAry.value,//// xAxis array
                    plotBands: [{
                        color: 'rgba(255,81,81,0.1)',
                        from: timeAry.value.findIndex((item) => item > new Date(vi_params.value.st)),
                        to: timeAry.value.findIndex((item) => item > new Date(vi_params.value.et)) === -1
                            ? timeAry.value.length - 1
                            : timeAry.value.findIndex((item) => item > new Date(vi_params.value.et)) - 1,
                        zIndex: -1,
                    }]
                    ,
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
                yAxis: [{///第一個y軸
                    labels: {
                        format: '{value}%',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    }
                    ,
                    title: {
                        text: 'Defect Yield Loss',
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
                    max: 100,
                    
                    title: {
                        text: 'VI Yield',
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
                        return `<strong>${this.x}</strong><br><a style='color:${this.series.color}'>${this.series.name}</a>:${this.y.toFixed(1)}%`
                    }
                }
                ,
                accessibility: {
                    enabled: false
                }
                ,
                series: seriesAry.value
            })
        });
    }
});




</script>

<style  scoped></style>