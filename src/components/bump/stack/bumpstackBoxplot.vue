<template>
    <div>
        <div ref="chart"></div>
    </div>
</template>

<script setup>
import { ref, watchEffect, nextTick, computed, watch } from 'vue';
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js';
import Highcharts from 'highcharts';
import boxplot from 'highcharts/highcharts-more'


import { UsebumpstackStore } from '../../../stores/bump/stack/bumpstackFetch.js';
const usebumpstackstore = UsebumpstackStore(pinia);
const { yieldData, weekData, navpartRecord } = storeToRefs(usebumpstackstore);


const props = defineProps({
    defect: {
        type: String,
        require: true
    }
});

boxplot(Highcharts);
const chart = ref(null);

watchEffect(() => {
    if (props.defect && yieldData.value.length > 0) {///條件進入或是要watchEffect的值

        nextTick(() => {
            console.log('1', props.defect);
            const defect_point = [];
            const defect_mean = [];
            const defect_total = [];
            weekData.value.forEach((week, weekIndex) => {


                const scatter_obj = yieldData.value.filter((item) => item.Week === week);///每一週的資料

                const boxplot_ary = scatter_obj.map((item) => props.defect === 'Yield'
                    ? Number(item[`${props.defect}`])
                    : item[`${props.defect}`] === '.' ? 0 : Number(item[`${props.defect}`]));

                const mean_value = boxplot_ary.length == 0 ? null : boxplot_ary.reduce((acc, cur) =>
                    parseFloat(acc) + parseFloat(cur)) / boxplot_ary.length;

                const scatter_data = scatter_obj.map((item) =>
                    [
                        weekIndex,
                        Number(item[`${props.defect}`]),
                        item.lotno,
                        // item.LayerName,
                        item.lot_type,
                        item.Yield,
                        item.checkouttime
                    ]);

                defect_point.push(boxplot_ary);
                defect_mean.push(mean_value);
                defect_total.push(...scatter_data);
            });

            const boxplotData = defect_point.map((item) => {

                const dataObject = {};
                let sorted = item.sort((a, b) => a - b);

                dataObject.low = sorted[0];
                dataObject.q1 = sorted[Math.round(item.length * 0.25)],
                    dataObject.median = sorted[Math.round(item.length * 0.5)],
                    dataObject.q3 = sorted[Math.round(item.length * 0.75)],
                    dataObject.high = sorted[sorted.length - 1]

                return dataObject
            });

            Highcharts.chart(chart.value, {
                chart: {
                    zoomType: 'xy',
                    width: 800,
                    height: 300,
                },
                title: {
                    text: `${navpartRecord.value} ${props.defect}`
                    // ${param.value.partRecord}
                },
                xAxis: {
                    categories: weekData.value
                },
                yAxis: {
                    max: props.defect === 'Yield' ? 1 : null,
                    title: {
                        text: 'Rate(%)',
                        enabled: true,
                    },
                    labels: {
                        // format: `{value} kg`
                        formatter: function () {
                            return `${this.value * 100}%`;
                        }
                    }
                },
                credits: false,
                series: [
                    {
                        type: 'boxplot',
                        name: 'Summary',
                        data: boxplotData,
                        color: 'rgba(62, 61, 61, 0.8)',
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
                        name: `${props.defect}`,
                        type: 'scatter',
                        data: defect_total,
                        jitter: {
                            x: 0.24 // Exact fit for box plot's groupPadding and pointPadding
                        },
                        marker: {
                            radius: 3,
                            lineWidth: 1, // 圖形的外框粗細
                            lineColor: "rgba(62, 61, 61, 0.5)", // 圖形的外框填色，改為 undefined 則繼承數據列顏色
                        },
                        color: 'rgba(0, 125, 255, 0.5)',
                        tooltip: {
                            // pointFormat:  '{userOptions}:{point}'
                            pointFormatter: function () {
                                return `<p>${this.series.userOptions.name}:${(this.y * 100).toFixed(2)}%</p><br>
                        <p>${this.series.userOptions.data[this.index][2]}</p><br>
                        <p>${this.series.userOptions.data[this.index][3]}</p><br>
                        <p>${(this.series.userOptions.data[this.index][4] * 100).toFixed(2)}%</p><br>
                        <p>${this.series.userOptions.data[this.index][5]}</p>`;
                                // return console.log(this)
                            }
                        }
                    },
                    {
                        name: 'Mean',
                        type: 'line',
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
                        color: '#FF9A57',

                        data: defect_mean
                    }

                ]
            }
            );
        })
    }
})
</script>

<style  scoped>

</style>