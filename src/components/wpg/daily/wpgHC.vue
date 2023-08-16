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

import { UsewpgStore } from '../../../stores/wpg/daily/wpgFetch.js';
import { UseHCStore } from '../../../stores/wpg/daily/wpgHCSet.js';

const usewpgstore =UsewpgStore(pinia);
const { wpg_params } = storeToRefs(usewpgstore);

const usehcstore = UseHCStore(pinia);
const { pntrendData,binAry ,xAxisAry, seriesAry, partRecord, timeAry, targetVal, triggerVal } = storeToRefs(usehcstore);

const chart = ref(null);

watchEffect(() => {
    if (xAxisAry.value.length > 0) {
        nextTick(() => {
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
                    text: `${partRecord.value} WPG Trend Chart`
                }
                ,
                xAxis: {
                    categories: xAxisAry.value,//// xAxis array
                    plotBands: [{
                        color: 'rgba(255,81,81,0.1)',
                        from: timeAry.value.findIndex((item) => item > new Date(wpg_params.value.st)),
                        to: timeAry.value.findIndex((item) => item > new Date(wpg_params.value.et)) === -1
                            ? timeAry.value.length - 1
                            : timeAry.value.findIndex((item) => item > new Date(wpg_params.value.et)) - 1,
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
                    max: 100,
                    title: {
                        text: 'WPG Yield',
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
                        return `<strong>${this.x}</strong><br><a style='color:${this.series.color}'>${this.series.name}</a>:${this.y.toFixed(2)}%`
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

<style  scoped>

</style>