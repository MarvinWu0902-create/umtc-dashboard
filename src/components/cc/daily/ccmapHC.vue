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
import Heatmap from 'highcharts/modules/heatmap'

Heatmap(Highcharts);
const chart = ref(null);

const props = defineProps({
    xAxis: {
        type: Array,
        require: true
    },
    yAxis: {
        type: Array,
        require: true
    },
    series: {
        type: Array,
        require: true
    },
    partName:{
        type:String,
        require: true
    }
});





nextTick(() => {

    Highcharts.chart(chart.value, {
        chart: {
            width: 300,
            height: 300,
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
        },
        title: {
            text: `${props.partName}`
        },
        xAxis: {
            title: { text: ' ' }
            ,
            categories: props.xAxis,
            reversed: true
        },
        yAxis: {
            title: {
                text: ' '
            },
            categories: props.yAxis,
        },
        colorAxis: {
            min: 0,
            minColor: '#80FF80',
            maxColor: '#FF0040',
        },
        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 100
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
                color: '#000000'
            }
        }]
    })
});
</script>

<style  scoped></style>