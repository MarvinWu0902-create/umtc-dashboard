<template>
    <div>
        <div ref="chart"></div>
    </div>
</template>

<script setup>
import { nextTick, ref, watchEffect,watch } from 'vue';
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js'
import Highcharts from 'highcharts';
import Heatmap from 'highcharts/modules/heatmap'

Heatmap(Highcharts);

const chart = ref(null);
const props = defineProps({
    // lot: {
    //     type: String,
    //     require: true,
    //     default: () => { 'unknown' }
    // },
    bin: {
        type: String,
        require: true,
        default: () => { 'unknown' }
    },
    xAxis: {
        type: Array,
        require: true,
        default: () => { [] }
    },
    yAxis: {
        type: Array,
        require: true,
        default: () => { [] }
    },
    series: {
        type: Array,
        require: true,
        default: () => { [] }
    },
});


nextTick(() => {
    console.log('props.xAxis',props.xAxis);
    console.log('props.yAxis',props.yAxis);
    console.log('props.series',props.series);
    Highcharts.chart(chart.value, {
        chart: {
            width:500,
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
        },
        title: {
            text: `${props.bin} Hot Zone`
        },
        xAxis: {
            categories:props.xAxis,
            reversed: false,
            labels:{
                style:{
                    fontSize:'7px'
                }
            }
        },
        yAxis: {
            categories: props.yAxis,///props.yAxis,
            reversed: true,
            title: null,
            labels:{
                style:{
                    fontSize:'7px'
                }
            }
        },
        colorAxis: {
            // min: 0,
            // minColor: '#93FF93',
            // maxColor: '#FF9797'
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
            ],
            labels:{
                style:{
                    fontSize:'10px'
                },
                formatter:function(){
                    return this.value*100+'%'
                }
            }

        },
        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
        },
        tooltip: {
            formatter: function () {
                return '<b>X:' + this.point.options.x + '</b>,Y:<b>' +
                    this.point.options.y

            }
        },
        credits: false,
        series: [{
            name: 'Sales per employee',
            borderWidth: 1,
            data: props.series,
            dataLabels: {
                enabled: true,
                color: '#000000',
                    style:{
                        fontSize:'10px'
                    },
                formatter: function () {
                    return this.point.value!==null?(this.point.value * 100).toFixed(0) + '%':''
                }
            }
        }]
    })
})

</script>

<style scoped></style>
