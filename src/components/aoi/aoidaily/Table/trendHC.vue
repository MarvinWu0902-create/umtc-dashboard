<template>
    <div>
        <div ref="chart"></div>
    </div>
</template>

<script setup>
import {nextTick, ref,watchEffect} from 'vue'
import Highcharts from 'highcharts'

const chart=ref(null);

const props = defineProps({
    options: {
        type: Array,
        require: true,
        default: () => {[]}
    },
    lot:{
        type:String,
        require:true,
        default:''
    },
    layer:{
        type:String,
        require:true,
        default:''
    }
});

watchEffect(() => {
    if (!chart.value && props.options) {
        console.log('props.options',props.options);
        console.log('chart.value',chart.value);
        nextTick(()=>{
            Highcharts.chart(chart.value, {
            chart: {
                type: 'scatter',
                marginRight: 50,
                width: '500',
                // height: '300',
                zoomType: 'xy'
            },
            title: {
                text: `${[...new Set(props.options.map((item) => item.process))]}`
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the year
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: 'Date'
                }
            },
            yAxis: {
                labels: {
                    formatter: function () {
                        return (this.value * 100).toFixed(2) + '%'
                    },
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Defect Rate(%)'
                },
                min: 0
            },
            tooltip: {
                formatter: function () {
                    let index = this.series.xData.indexOf(this.x);

                    return `<b>${this.series.name}</b><br/>
                            <b>${this.series.userOptions.data[index][2]}_${this.series.userOptions.data[index][3]}_${this.series.userOptions.data[index][4]}</b><br/>
                            <b>${Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x)}</b><br/>
                            <b>${Highcharts.numberFormat((this.y * 100), 2)}%</b>`;
                    console.log(this.series.userOptions.data[index][2], lot);
                }
            },
            plotOptions: {
                scatter: {
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            let index = this.series.xData.indexOf(this.x);
                            if (this.series.userOptions.data[index][2] == props.lot && this.series.userOptions.data[index][3] == props.layer) {
                                return '<span style="color:red;">&#9660;</span>';
                            }
                        }
                    }
                }
            },
            colors: ['#6CF', '#39F', '#06C', '#036', '#000'],
            series: props.options,
            credits: false,
            responsive: {
                rules: [{
                    condition: {
                        maxwidth: 500
                    },
                    chartOptions: {
                        chart: {
                            width: '100%'
                        }
                    }
                }]
            },
            legend: {
                itemStyle: {
                    fontSize: '12px'
                }
            }
        }

        )
        })

    }
})
</script>

<style  scoped>

</style>