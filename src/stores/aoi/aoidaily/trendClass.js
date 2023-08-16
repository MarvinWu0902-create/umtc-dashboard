import { defineStore } from 'pinia'

export const UseaoiClassStore = defineStore('aoitrendclass', () => {

    const seriesDataProcess=(process,name, data)=>{
        // const DataObj={
        //     process:process,
        //     name:name,
        //     data:data
        // }
        return {
            name:name,
            data:data,
            process:process
        }
    }
    return {
        seriesDataProcess
    }
});

// class series_data_process {
//     constructor(name, data) {
//         this.name = name;
//         this.data = data;
//     }
// };

// const addColumnClassFn = (pn, rate, charttype, color, zindex) => {
//     const ColumnObj = {
//         name: pn.value[color.value],
//         data: rate,
//         type: charttype,
//         color: Highcharts.getOptions().colors[color.value],
//         zindex: zindex,
//         yAxis: 0,
//         classify: 'Lot'
//     };
//     return ColumnObj
// };

