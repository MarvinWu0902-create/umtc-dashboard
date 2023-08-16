
<template>
    <div>
        <div ref="chart"></div>
    </div>
</template>

<script setup>
import { nextTick, ref, watchEffect, watch } from 'vue';
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js'
import Highcharts from 'highcharts';
import {NSlider }from 'naive-ui'

const chart = ref(null);

const props = defineProps({
    title:{
        type:String,
        require:true,
        default:'unknown'
    },
    xAxisDefect: {
        type: Array,
        require: true,
        default: () => { [] }
    },
    yAxisCount: {
        type: Array,
        require: true,
        default: () => { [] }
    },
    yAxisPercent: {
        type: Array,
        require: true,
        default: () => { [] }
    }
});

nextTick(() => {
    Highcharts.chart(chart.value, {
        chart: {
            width:500,
            type: 'column'
        },
        credits: false,
        title: {
            text: `${props.title}`
        },
        xAxis: {
            categories: props.xAxisDefect,
        },
        yAxis: [
            {
                title: {
                    text: '顆數',
                    rotation:0
                },
                labels: {
                    rotation:0
                }
            }, {max:1,
                min:0.5,
                title: {
                    text: '累積(%)',
                    rotation:0
                },
                labels: {
                    formatter: function () {
                        return (this.value * 100) + '%';
                    }

                },
                opposite: true
            }
        ],
        tooltip: {
            formatter: function () {
                return '<b>' + (this.series.userOptions.type === 'line' ? '總占比:' + (this.point.options.y * 100).toFixed(1) + '%' : '顆數:' + this.point.options.y + '顆') + '</b>'

            }
        },
        plotOptions:{
            column:{
                pointPadding:1,
                groupPadding:0.99,
                color:'#56DC56'
            },
            line:{
                marker:{
                    fillColor:'white',
                    lineColor:'rgb(85,85,85)',
                    lineWidth:2,
                    radius:4
                },
                lineWidth:3,
                color:'rgb(67,124,255)'
            }
        },
        legend:{
            enabled:false
        },
        series: [
            {
                name: 'Count',
                type: 'column',
                data: props.yAxisCount,
                // pointPlacement: 'on',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    style: {
                        fontSize: '10px'
                    },
                    align:'center',
                    inside:true,
                    verticalAlign:'middle',
                    formatter: function () {
                        return this.point.options.y +'顆'
                    }
                },
                yAxis: 0
            }, {
                name: '%',
                type: 'line',
                data: props.yAxisPercent,
                // pointPlacement: 'on',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    style: {
                        fontSize: '10px'
                    },
                    formatter: function () {
                        console.log(this);
                        return (this.point.options.y * 100).toFixed(1) + '%'
                    }
                },
                yAxis: 1
            }
        ]
    })
})



</script>

<style  scoped></style>