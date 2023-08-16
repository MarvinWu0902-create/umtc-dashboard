import { ref } from 'vue'
import Highcharts from 'highcharts'
import { defineStore } from 'pinia'

export const UseHCClassStore = defineStore('hcclass', () => {

    const addColumnClassFn = (pn, rate, charttype, color) => {
        const ColumnObj = {
            name: pn.value[color.value],
            data: rate,
            type: charttype,
            color: Highcharts.getOptions().colors[color.value],
            yAxis: 0,
            classify: 'Lot'
        };
        return ColumnObj
    };
    const addColumnPcClassFn = (pn, process, rate, charttype, pc, partcount) => {
        const ColumnPcObj = {
            pn: pn.value[partcount.value],
            name: process[pc.value],
            data: rate,
            type: charttype,
            color: Highcharts.getOptions().colors[pc.value],
            yAxis: 0,
            classify: 'Process',
            process: pc.value,
            part: partcount.value
        };
        return ColumnPcObj
    };

    const addLineClassFn = (pn, rate, charttype, dashstyle, color) => {
        const LineObj = {
            name: pn.value[color.value],
            data: rate,
            type: charttype,
            dashStyle: dashstyle,
            color: Highcharts.getOptions().colors[color.value],
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[color.value],
                fillColor: 'white'
            },
            zIndex:997,
            yAxis: 1,
            classify: 'Line',
        };
        return LineObj
    };

    const addLineAvgClassFn = (rate) => {
        const AvgObj = {
            name: 'Avg',
            data: rate,
            type: 'spline',
            dashStyle: 'Solid',
            lineWidth:4,
            color: '#FF5151',
            yAxis: 1,
            zIndex: 998,
            classify: 'Avg',
            dataLabels: {
                enabled: true,
                zIndex: 999,
                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'black',
                formatter: function () {
                    return this.y.toFixed(1) + '%'
                },
                // backgroundColor:'white',
                // borderColor:'black',
                // borderWidth:1,
                style:{
                    // color:'white',
                    // textShadow:'black',
                    fontSize:'10px',
                    // fontWeight:'bold',
                    // textOutline:'white',
                    // borderColor:'black'
                }
            },
            marker: {
                symbol:'circle',
                lineWidth: 4,
                lineColor: '#FF5151',
                fillColor: 'white'
            },

        }
        return AvgObj
    }

    return {
        addColumnClassFn, addColumnPcClassFn, addLineClassFn,addLineAvgClassFn
    }
})