<template>
    <div>
        <div ref="chart"></div>
    </div>
</template>

<script setup>
import {nextTick, ref,watchEffect,onUnmounted} from 'vue'
import Highcharts from 'highcharts'
import HighchartsMore from 'highcharts/highcharts-more'

HighchartsMore(Highcharts);

const chart=ref(null);
const props = defineProps({
    options:{
        type:Object,
        require:true,
        default:()=>({})
    },
    xAxis:{
        type:Array,
        require:true,
        default:()=>{[]}
    }
})////由foucsCanvas傳進來
// watchEffect(() => {
//     if (!chart.value && props.options) {
        nextTick(() => {
            Highcharts.chart(chart.value, {
                chart: {
                    width:350,
                    height:200,
                    zoomType: 'y',
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
                    text: `${props.options.FB}`
                },
                legend: {
                    itemStyle: {
                        fontSize: '10px'
                    }
                },
                xAxis: {
                    categories: props.xAxis,
                    labels: {
                        style: {
                            fontSize: '8px',
                            fontWeight: 'bold'
                        },
                        rotation: 0
                    }
                },
                yAxis: {
                    max: 1,
                    min: 0.95,
                    tickInterval:0.02,
                    title: {
                        text: 'Rate(%)'///要調整enabled: f == 0 | f == 5 ? true : false
                    },
                    labels: {
                        // format: `{value} kg`
                        formatter: function () {
                            return `${this.value * 100}%`
                        }
                    },
                    plotLines: [{
                        color: 'rgba(255, 117, 112, 0.7)', ///'red',
                        width: 2, ///2,
                        value: props.options.trigger,
                        zIndex: 4,
                        label: {
                            x: -10,
                            y: -20,
                            text: `Tri.${(props.options.trigger * 100).toFixed(2)}%`, ///`Target:${pn_target*100}%`,
                            rotation: 0,
                            style: {
                                color: 'rgba(255, 117, 112, 0.7)',
                                font: '10px inherit'
                            }
                        },
                        dashStyle: 'ShortDash'
                    },
                    {
                        color: 'rgb(31,150,253,0.7)', ///'red',
                        width: 2, ///2,
                        value: props.options.target,
                        zIndex: 4,
                        label: {
                            x: -10,
                            y: -20,
                            text: `Tag.${(props.options.target * 100).toFixed(2)}%`, ///`Target:${pn_target*100}%`,
                            rotation: 0,
                            style: {
                                color: 'rgb(31,150,253,0.7)',
                                font: '10px inherit'
                            }
                        },
                        dashStyle: 'ShortDash'
                    }
                    ]
                },
                series: [
                    {
                        type: 'boxplot',
                        name: 'Before',
                        zIndex: 2,
                        data: props.options.boxplotbef,
                        color: 'rgba(75, 159, 232, 1)',
                        tooltip: {
                            pointFormatter: function () {
                                const x = this.x;
                                const currentData = this.series.data.find(data => data.x === x);
                                const boxplotValues = currentData ? currentData.options : {};
                                return `Max: ${(boxplotValues.high * 100).toFixed(2)}%<br>
Q3: ${(boxplotValues.q3 * 100).toFixed(2)}%<br>
Median: ${(boxplotValues.median * 100).toFixed(2)}%<br>
Q1: ${(boxplotValues.q1 * 100).toFixed(2)}%<br>
Low: ${(boxplotValues.low * 100).toFixed(2)}%<br>`;

                            }
                        }

                    },
                    {
                        ype: 'boxplot',
                        name: 'AOS',
                        zIndex: 2,
                        data: props.options.boxplot,
                        color: 'rgba(75, 159, 232, 1)',
                        tooltip: {
                            //     // headerFormat: '<p> Test{point.key}{point.q3}</p><br/>'
                            pointFormatter: function () {
                                const x = this.x;
                                const currentData = this.series.data.find(data => data.x === x);
                                const boxplotValues = currentData ? currentData.options : {};
                                return `Max: ${(boxplotValues.high * 100).toFixed(2)}%<br>
Q3: ${(boxplotValues.q3 * 100).toFixed(2)}%<br>
Median: ${(boxplotValues.median * 100).toFixed(2)}%<br>
Q1: ${(boxplotValues.q1 * 100).toFixed(2)}%<br>
Low: ${(boxplotValues.low * 100).toFixed(2)}%<br>`;

                            }
                        }
                    },
                    {
                        name: `AOS`,
                        type: 'scatter',
                        data: props.options.point,
                        jitter: {
                            x: 0.3 // Exact fit for box plot's groupPadding and pointPadding
                        },
                        marker: {
                            radius: 3,
                            lineWidth: 1, // 圖形的外框粗細
                            lineColor: "rgba(255, 255, 255, 0.1)", // 圖形的外框填色，改為 undefined 則繼承數據列顏色
                            symbol: "circle"
                        },
                        color: 'rgba(251, 124, 56, 0.4)',
//                         tooltip: {
//                             // pointFormat:  '{userOptions}:{point}'
//                             pointFormatter: function () {
//                                 return `<p>${this.series.userOptions.name}:${(this.y * 100).toFixed(2)}%</p><br>
// <a href="http://10.22.94.222/AOI_Daily_Low_Yield/${this.series.userOptions.data[this.index][2]}${this.series.userOptions.data[this.index][3]}">${this.series.userOptions.data[this.index][2]}${this.series.userOptions.data[this.index][3]}</a><br>
// <p>${this.series.userOptions.data[this.index][4]}</p><br>
// <p>${this.series.userOptions.data[this.index][5]}</p>
// `;
//                                 //<a href="http://10.22.94.222/AOI_Daily_Low_Yield/${this.series.userOptions.data[this.index][2]}${this.series.userOptions.data[this.index][3]}">${this.series.userOptions.data[this.index][2]}${this.series.userOptions.data[this.index][3]}</a><br>
//                             }
//                         }
                    },
                    {
                        name: `Before`,
                        type: 'scatter',
                        data: props.options.pointbef,
                        jitter: {
                            x: 0.3 // Exact fit for box plot's groupPadding and pointPadding
                        },
                        marker: {
                            radius: 3,
                            lineWidth: 1, // 圖形的外框粗細
                            lineColor: "rgba(255, 255, 255, 0.1)", // 圖形的外框填色，改為 undefined 則繼承數據列顏色
                            symbol: "circle"
                        },
                        color: 'rgba(75, 159, 232, 0.4)',
//                         tooltip: {
//                             // pointFormat:  '{userOptions}:{point}'
//                             pointFormatter: function () {
//                                 return `<p>${this.series.userOptions.name}:${(this.y * 100).toFixed(2)}%</p><br>
// <a href="http://10.22.94.222/AOI_Daily_Low_Yield/${this.series.userOptions.data[this.index][2]}${this.series.userOptions.data[this.index][3]}">${this.series.userOptions.data[this.index][2]}${this.series.userOptions.data[this.index][3]}</a><br>
// <p>${this.series.userOptions.data[this.index][4]}</p><br>
// <p>${this.series.userOptions.data[this.index][5]}</p>
// `;
//                                 // return console.log(this)
//                             }
//                         }
                    },
                    {
                        name: 'Mean(AOS)',
                        type: 'line',
                        zIndex: 3,
                        marker: {
                            radius: 5,
                            fillColor: '#ffffff', // 圖形的填色，預設繼承數據列顏色
                            lineWidth: 2, // 圖形的外框粗細
                            lineColor: "#FF9A57", // 圖形的外框填色，改為 undefined 則繼承數據列顏色
                            symbol: "circle" // 決定圖形的形狀
                        },
                        tooltip: {
                            pointFormatter: function () {
                                return `${(this.y * 100).toFixed(1)}%`
                            }
                        },
                        color: 'rgb(255 189 145)',
                        data: props.options.mean
                    },
                    {
                        name: 'Mean(Bef)',
                        type: 'line',
                        zIndex: 3,
                        marker: {
                            radius: 5,
                            fillColor: '#ffffff', // 圖形的填色，預設繼承數據列顏色
                            lineWidth: 2, // 圖形的外框粗細
                            lineColor: "#3399CC", // 圖形的外框填色，改為 undefined 則繼承數據列顏色
                            symbol: "circle" // 決定圖形的形狀
                        },
                        tooltip: {
                            pointFormatter: function () {
                                return `${(this.y * 100).toFixed(1)}%`
                            }
                        },
                        color: 'rgb(51 187 255)',
                        data: props.options.meanbef
                    }
                ],
                credits: false
            })



        })
//     }
// })

// onUnmounted(()=>{
//     const test=chart.value;
//     test.destroy();
// })

</script>

<style scoped>

</style>