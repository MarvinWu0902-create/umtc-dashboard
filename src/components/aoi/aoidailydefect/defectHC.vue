<template>
    <div class="position-relative border border-1">
        <div ref="chart"></div>
        <p v-show="radioItem === 'machine'" class="position-absolute top-0 start-50 p-translate fw-bold text-primary fs-8">
            Avg:{{ (avgValue * 100).toFixed(2) + '%' }}
        </p>
    </div>
</template>

<script setup>
import { nextTick, ref, watch, computed, watchEffect } from 'vue';
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js'
import Highcharts from 'highcharts';
import AnnotationsModule from 'highcharts/modules/annotations';
AnnotationsModule(Highcharts);

import { UsedefectFetch } from '../../../stores/aoi/aoidailydefect/defectFetch.js';
const usedefectfetch = UsedefectFetch(pinia);
const { filterData, activeDefect, activeProcess, selectOptions, checkbarAry } = storeToRefs(usedefectfetch);

import { UsedefectHC } from '../../../stores/aoi/aoidailydefect/defectHCSet.js';
const usedefecthc = UsedefectHC(pinia);
const { defectAry, processAry, categoriesAry, defectStatus, processStatus, triggerVal, radioItem, machineAry, colorAry } = storeToRefs(usedefecthc);

import { UsedefectTable } from '../../../stores/aoi/aoidailydefect/defectTableSet.js'
const usedefecttable = UsedefectTable(pinia);
const { tableData } = storeToRefs(usedefecttable);


const props = defineProps({
    defect: {
        type: String,
        default: ''
    },
    process: {
        type: String,
        default: ''
    },
    machine: {
        type: String,
        default: ''
    },
    max: {
        type: Array
    }
});

// props.process===''&&props.defect===''///->表示一張表
// { Defect: 'BU O51/O52', Process: 'SAPECU1' },
// { Defect: 'BU A3+A4+A7', Process: 'PTHCUM1/PTHFCU1'},
// console.log('props.defect', props.defect);
// console.log('props.process', props.process);

const chart = ref(null);

console.log('456', props.max);

const avgValue = computed(() => {
    if (props.process !== '' && props.machine !== '') {
        return props.max.filter((item) => item.process === props.process)[0].data
            .filter((item) => item.machine === props.machine)[0].data.avg
    } else if (props.process === '' && props.machine !== '') {
        return props.max[0].data
            .filter((item) => item.machine === props.machine)[0].data.avg
    }
    // else if(props.process === '' && props.machine !== ''){
    //     return 1
    // }
    // else if (props.process !== '' && props.machine === ''){
    //     let tt=props.max.filter((item)=>item.process === props.process)[0].data;
    //     console.log('tt',tt);
    //     let sum=0;
    //     let count=0;
    //     tt.forEach((item)=>{
    //         console.log('item.data.avg',item.data.avg);
    //         sum+=item.data.avg;
    //         count+=1;
    //     });
    //     return sum/count
    // }
});


const seriesAry = computed(() => {
    const container = [];

    let dealData = [];
    if (props.process === '') {////單一站點(ex.SAPECU)
        if (props.machine === '') {///又沒點機台
            dealData = filterData.value.filter((item) => item[`Time${processAry.value[0]}`] !== ' ' && item[`Time${processAry.value[0]}`] !== null).sort((a, b) => Date.parse(a[`Time${processAry.value[0]}`]) - Date.parse(b[`Time${processAry.value[0]}`]));
        } else {///又點機台
            dealData = filterData.value.filter((item) => item[`Time${processAry.value[0]}`] !== ' ' && item[`Time${processAry.value[0]}`] !== null && item[`Machine${processAry.value[0]}`] === props.machine).sort((a, b) => Date.parse(a[`Time${processAry.value[0]}`]) - Date.parse(b[`Time${processAry.value[0]}`]));
        }
    } else {///多個站點
        if (props.machine === '') {///又沒點機台
            dealData = filterData.value.filter((item) => item[`Time${props.process}`] !== ' ' && item[`Time${props.process}`] !== null).sort((a, b) => Date.parse(a[`Time${props.process}`]) - Date.parse(b[`Time${props.process}`]));
        } else {///又點機台   *[PTHCUM1/PTHFCU1]*
            dealData = filterData.value.filter((item) => item[`Time${props.process}`] !== ' ' && item[`Time${props.process}`] !== null && item[`Machine${props.process}`] === props.machine).sort((a, b) => Date.parse(a[`Time${props.process}`]) - Date.parse(b[`Time${props.process}`]));
        }
    };
    ///站點多個則以props.process篩選，反之則用processAry.value[0]

    const pnAry = [...new Set(dealData.map((item) => item.PartNo))];

    pnAry.forEach((pn) => {
        const Obj = {};

        const rate = dealData
            .map((item) => {
                if (item.PartNo !== pn) {
                    return null
                } else {
                    if (props.defect === '') {///S1+S2
                        let rate = 0;
                        for (let i = 0; i < defectAry.value.length; i++) {
                            item[defectAry.value[i]] === '.'
                                ? rate += 0
                                : rate += Number(item[defectAry.value[i]]) * 100
                        };
                        return rate
                    } else {///O51/O52
                        return Number(item[props.defect] === '.' ? 0 : item[props.defect]) * 100;
                    }
                }
            });
        const lot = dealData
            .map((item) => {
                if (item.PartNo !== pn) {
                    return ' '
                } else {
                    return item.LotNum + '_' + item.LayerName
                }
            });
        Obj.type = 'scatter';
        Obj.data = rate;
        Obj.color = colorAry.value.filter((item) => item.pn === pn)[0].color
        // pnObj.time = time;
        Obj.lot = lot;
        Obj.name = pn;
        Obj.marker = { symbol: 'circle', radius: 3, lineColor: 'rgba(0,0,56,0.3)', lineWidth: 2 }

        container.push(Obj);
    });

    ////[series:[{},{},...],scale:[0,5]]
    return container;
});

const timeAry = computed(() => {
    ////各自圖的時間
    if (props.process === '') {////單一站點(ex.SAPECU)
        if (props.machine === '') {///又沒點機台

            return filterData.value
                .filter((item) => item[`Time${processAry.value[0]}`] !== ' ' && item[`Time${processAry.value[0]}`] !== null)
                .sort((a, b) => Date.parse(a[`Time${processAry.value[0]}`]) - Date.parse(b[`Time${processAry.value[0]}`]))
                .map((item) => item[`Time${processAry.value[0]}`]);

        } else {///又點機台

            return filterData.value
                .filter((item) => item[`Time${processAry.value[0]}`] !== ' ' && item[`Time${processAry.value[0]}`] !== null && item[`Machine${processAry.value[0]}`] === props.machine)
                .sort((a, b) => Date.parse(a[`Time${processAry.value[0]}`]) - Date.parse(b[`Time${processAry.value[0]}`]))
                .map((item) => item[`Time${processAry.value[0]}`])

        }
    } else {///多個站點

        if (props.machine === '') {///又沒點機台 props.machine

            return filterData.value
                .filter((item) => item[`Time${props.process}`] !== ' ' && item[`Time${props.process}`] !== null)
                .sort((a, b) => Date.parse(a[`Time${props.process}`]) - Date.parse(b[`Time${props.process}`]))
                .map((item) => item[`Time${props.process}`]);
        } else {///又點機台   *[PTHCUM1/PTHFCU1]*

            return filterData.value
                .filter((item) => item[`Time${props.process}`] !== ' ' && item[`Time${props.process}`] !== null && item[`Machine${props.process}`] === props.machine)
                .sort((a, b) => Date.parse(a[`Time${props.process}`]) - Date.parse(b[`Time${props.process}`]))
                .map((item) => item[`Time${props.process}`]);
        }
    };
})

const markAry = computed(() => {
    let markList = [];
    ///seriesAry.value.
    tableData.value.forEach((item) => {////如果該圖沒有tableData的話，不應該跑，會報錯
        let eachObj = {
            'labels': [{ 'point': { xAxis: 0, yAxis: 0 } }],///1111
            labelOptions: {
                x: -40, y: 0, backgroundColor: 'rgba(0,0,0,0)', borderWidth: 1, borderColor: 'red', padding: 1, allowOverlap: true,
                style: {
                    color: 'red',
                    cursor: 'default',
                    fontSize: '8px',
                    fontWeight: 700
                }
            }
        };

        //如果在seriesAry中找不到tableData中的批號，則push {}
        ///兩種狀況 1.料號沒有符合 2.料號符合但批號沒有符合
        let dataCheck = seriesAry.value.filter((obj) => obj.name === item.PartNo);
        if (dataCheck.length === 0) {

            markList.push({});
        } else if (dataCheck.length !== 0 && dataCheck[0].lot.findIndex((obj) => obj === (item.LotNum + '_' + item.LayerName)) === -1) {
            markList.push({});
        } else {
            let data = dataCheck[0];

            let x = data.lot.findIndex((obj) => obj === (item.LotNum + '_' + item.LayerName));

            let y = data.data[x];

            let text = `${(data['data'][x]).toFixed(2)}%`;

            eachObj.labels[0].point.x = x;
            eachObj.labels[0].point.y = y;
            eachObj.labels[0].text = text;

            markList.push(eachObj);

        }
    });
    return markList;
});

watchEffect(() => {
    if (seriesAry.value.length > 0 && triggerVal.value && selectOptions.value.length > 0 && markAry.value) {
        nextTick(() => {
            Highcharts.chart(chart.value, {
                chart: {
                    type: 'line',
                    width: radioItem.value === 'machine' ? 300 : 1200,
                    height: radioItem.value === 'machine' ? 300 : 400,
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
                    text: `${props.defect === ''
                        ? activeDefect.value
                        : props.defect} ${props.process === ''
                            ? activeProcess.value !== 'ChangeTime'
                                ? activeProcess.value
                                : 'AOI'
                            : props.process} ${props.machine}`,
                    style: { fontSize: '12px', color: 'gray', fontWeight: 700 }


                },
                legend: {
                    // layout:'vertical',
                    // align:'right',
                    // verticalAlign:'middle',
                    enabled: false
                },
                xAxis: {
                    type: 'category',
                    categories: timeAry.value,
                    title: 'Time',
                    labels: {
                        rotation: 90,
                        style: {
                            fontSize: '8px'
                        }
                    },
                    // plotBands: plotAry.value
                },
                yAxis: [{
                    title: 'Value',
                    labels: {
                        format: '{value}%',
                        style: {
                            color: Highcharts.getOptions().colors[1]
                        }
                    },
                    tickInterval: 0.5,
                    max: props.process !== '' && props.defect !== ''
                        ? props.max.filter((item) => item.process === props.process && item.defect === props.defect)[0].max[0] * 100
                        : props.process !== '' && props.defect === ''////else if
                            ? props.max.filter((item) => item.process === props.process)[0].max * 100
                            : props.max[0].max * 100
                    ,
                    plotLines: [
                        {
                            color: 'red',
                            width: 2,
                            value: triggerVal.value * 100,
                            zIndex: 4,
                            label: {
                                x: -30,
                                y: -10,
                                text: `Tri.:${(triggerVal.value * 100).toFixed(1)}%`,
                                rotation: 0,
                                style: {
                                    color: 'red',
                                    font: '10px inherit'
                                }
                            },
                            dashStyle: 'ShortDash'
                        }
                    ]
                }
                ],
                tooltip: {
                    formatter: function () {
                        return `${this.x}<br><a style='color:${this.series.color}'>${this.series.name}</a>:${this.y.toFixed(2)}%<br><strong>${this.series.userOptions.lot[this.point.index]}</strong>`
                    }
                },
                credits: false,
                series: seriesAry.value,

                annotations: radioItem.value !== 'machine' ? markAry.value : []
            });
        })
    }
})


</script>

<style lang="scss" scoped>
.fs-8 {
    font-size: 8px;
}

.p-translate {
    transform: translate(-50%, -100%) !important;
}
</style>