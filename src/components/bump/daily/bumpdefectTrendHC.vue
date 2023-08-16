<template>
    <div>
        <div ref="chart"></div>
    </div>
</template>

<script setup>
import { nextTick, ref, watchEffect, watch, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js'
import Highcharts from 'highcharts';

import {UseTrendStore} from '../../../stores/bump/daily/bumpTrendSet.js' ;
const usetrendstore =UseTrendStore(pinia);
const {seriesAry,timeAry,defecttrendData,itemSelect}=storeToRefs(usetrendstore);

import {UsebumpTableStore} from '../../../stores/bump/daily/bumpTableSet.js';
const usebumptablestore = UsebumpTableStore(pinia);

const { partRecord } = storeToRefs(usebumptablestore);

const chart = ref(null);

watchEffect(() => {
    if (defecttrendData.value.length > 0) {

        nextTick(() => {
            Highcharts.chart(chart.value, {
                chart: {
                    type: 'line',
                    width: 1100,
                    // type: 'areaspline',
                    zoomType: 'xy',
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
                    text:`${partRecord.value} ${itemSelect.value} Trend Chart`
                },
                xAxis: {
                    type: 'category',
                    categories: timeAry.value,///props.series[0].time,///categoryAry.value,
                    title: 'Time',
                    labels: {
                        rotation: 90,
                        style: {
                            fontSize: '8px'
                        }
                    }
                },
                series: seriesAry.value,////props.series,
                yAxis: {
                    title: 'Value',
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
                credits: false
            })
        })
    }
});
</script>

<style  scoped>

</style>