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

import { NForm, NGrid, NFormItemGi, NSelect, NInput, NButton, NSpace, NColorPicker, NDatePicker } from 'naive-ui'


import { UseTrendStore } from '../../../stores/vi/daily/viTrendSet.js';
const usetrendstore = UseTrendStore(pinia);

const { gettrendData } = usetrendstore;
const { partnumber, process, defect, defecttrendData, seriesAry, categoryAry, timeRange, actionValue, insertLoc, colorValue, plotAry } = storeToRefs(usetrendstore);

const chart = ref(null);



//上方在處理對策輸入表 


////1.找到x軸時間點插入時間點(依樣就是一條線)


const props = defineProps({
    // series: {
    //     type: Array,
    //     require: true
    // },
    defect: {
        type: String,
        require: true
    }
});


const seriesTest = computed(() => {
    return seriesAry.value.filter((item) => item.defect === props.defect)
});

const timeTest = computed(() => {
    return seriesAry.value[0].time
})


// const actionClick = () => {

//     console.log('props.series',props.series);
//     const insertLoc = props.series[0].time
//         .map((item) => Date.parse(new Date(item)))
//         .findIndex((timestamp) => timestamp >= timeRange.value[0]);

//     props.series[0].data.splice(insertLoc, 0,null);
//     props.series[0].lotnumber.splice(insertLoc, 0,' ');
//     props.series[0].time.splice(insertLoc, 0, ' ');
//     // chart.value.redraw();Vue 中不能使用這個 嘗試在外部傳進響應式props去更動
// };
console.log(' 123 plotAry', plotAry);


watchEffect(() => {
    if (defecttrendData.value.length > 0) {
        nextTick(() => {
            const h = Highcharts.chart(chart.value, {
                chart: {
                    type: 'line',
                    width: 1200,
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
                    text: `${partnumber.value} ${process.value} ${props.defect} Trend Chart`
                },
                xAxis: {
                    type: 'category',
                    categories: timeTest.value,///props.series[0].time,///categoryAry.value,
                    title: 'Time',
                    labels: {
                        rotation: 90,
                        style: {
                            fontSize: '8px'
                        }
                    }
                    ,
                    plotBands: plotAry.value
                },
                series: seriesTest.value,////props.series,
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
            });
            console.log('123 end', h);
            // 修正對策Label問題
            let plotBands = h.xAxis[0].plotLinesAndBands;
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
        })
    }
});



</script>

<style scoped>
.n-form {
    width: 600px;
}
</style>