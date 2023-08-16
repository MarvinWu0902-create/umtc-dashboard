<template>
    <div class="hc">
        <div ref="chart"></div>
    </div>
</template>

<script setup>
import { nextTick, ref, watch, watchEffect } from 'vue';
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js'
import Highcharts from 'highcharts';

import { UseviStore } from '../../../stores/vi/trend/vitrendFetch.js';


const usevistore = UseviStore(pinia);
const { trendData, actionData, params, insertStatus, categoriesAry, plotAry, container } = storeToRefs(usevistore);

const chart = ref(null);



///點擊後再進去
watchEffect(() => {
    console.log('step');
    if (insertStatus.value === true && container.value.length > 0) {
        nextTick(() => {

            console.log('categoriesAry.value', categoriesAry.value);
            console.log('container.value', container.value);


            const test = Highcharts.chart(chart.value, {
                chart: {
                    type: 'line',
                    width: 1000,
                    height: 400,
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
                    text: `${params.value.process} ${params.value.defect} Trend Chart`
                },
                xAxis: {
                    type: 'category',
                    categories: categoriesAry.value,///categoryAry.value,
                    title: 'Time',
                    labels: {
                        rotation: 90,
                        style: {
                            fontSize: '8px'
                        }
                    },
                    plotBands: plotAry.value
                },
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
                        return `${this.x}<br><a style='color:${this.series.color}'>${this.series.name}</a>:${this.y.toFixed(2)}%<br><strong>${this.series.userOptions.lot[this.point.index]}</strong>`
                    }
                },
                credits: false,
                series: container.value

            })

            let plotBands = test.xAxis[0].plotLinesAndBands;
            let recordWidthc = 0;
            let recordDown = 15;
            let recordUp = -15;
            console.log('123 plot', plotBands);
            plotBands.sort((a, b) => a.options.time - b.options.time)
                .forEach((plotBand, index) => {
                    let widthObj = plotBand.label.getBBox();

                    let labelLoc = widthObj.x + widthObj.width;

                    if (widthObj.x >= widthObj.width / 2) {////初始位置座標大於Label長度一半(才可移至左邊不超出)

                        if (widthObj.x - widthObj.width / 2 < recordWidthc) {////如果移至左邊上一個Label重疊 

                            plotBand.label.translate(-(widthObj.width / 2), recordDown);
                            recordDown += 15;

                        } else {///如果移至左邊不與上一個Label重疊

                            plotBand.label.translate(-(widthObj.width / 2), 0);
                            recordWidthc = labelLoc - widthObj.width / 2;///移動後的Lable右側座標
                            recordDown = 15;

                        }
                    } else {///初始位置座標小於Label長度一半，會超出，直接移x->0

                        if (index === 0) {///第一個
                            plotBand.label.translate(-(widthObj.x), 0);
                            recordWidthc = widthObj.width;///移動後的Lable右側座標(左側為0)
                        } else {////不是第一個
                            plotBand.label.translate(0, recordUp);///原本座標上移15
                            recordUp = recordUp - 15;
                        }
                    }
                });





        });

        insertStatus.value = false;
    }
});
</script>

<style scoped>
.hc {
    display: flex;
    justify-content: center;
}
</style>