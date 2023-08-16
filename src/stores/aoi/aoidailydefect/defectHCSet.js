import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
// import { apiGetaoiDefectData } from '@/api/index.js'

import { storeToRefs } from 'pinia'
import pinia from '../../index.js'

import { UsedefectFetch } from '../../../stores/aoi/aoidailydefect/defectFetch.js';
const usedefectfetch = UsedefectFetch(pinia);
const { filterData, activeDefect, activeProcess, triggerData, selectOptions, checkbarAry } = storeToRefs(usedefectfetch);

export const UsedefectHC = defineStore('useaoidailydefecthc', () => {


    const radioItem = ref('oridinary');

    const colorAry = computed(() => {
        let colorBox = [];
        const letters = '0123456789ABCDEF';
        for (let c = 0; c < checkbarAry.value.length; c++) {
            let color = '#';
            const colorObj = {};
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            };
            colorObj.pn = checkbarAry.value[c].pn;
            colorObj.color = color;

            colorBox.push(colorObj);
        };

        return colorBox
    })



    // const colorFunction = () => {
    //     const letters = '0123456789ABCDEF';
    //     let color = '#';
    //     const container=[];
    //     for (let h = 0; h < 30; h++) {
    //         for (let i = 0; i < 6; i++) {
    //             color += letters[Math.floor(Math.random() * 16)]
    //         };
    //         container.push(color);
    //     }
    //     return container;
    // }

    const defectAry = computed(() => {

        let symbolRex = /[\/+]/g;
        let symbolSlanting = /[\/]/g;
        let symbolPlus = /[+]/g;


        if (symbolRex.exec(activeDefect.value) === null) {////BU O4
            // defectStatus.value = 'Normal';
            return [activeDefect.value.split(' ')[1]];
        } else if (symbolSlanting.exec(activeDefect.value) !== null)///BU O51/O52
        {
            // defectStatus.value = 'Slanting';
            return activeDefect.value.split(' ')[1].split('/');
        } else {///BU S1+S2
            // defectStatus.value = 'Plus';
            return activeDefect.value.split(' ')[1].split('+');
        }
    });
    //
    const defectStatus = computed(() => {
        let symbolRex = /[\/+]/g;
        let symbolSlanting = /[\/]/g;
        let symbolPlus = /[+]/g;
        if (symbolRex.exec(activeDefect.value) === null) {
            return 'Normal';
        } else if (symbolSlanting.exec(activeDefect.value) !== null) {
            return 'Slanting';
        } else {
            return 'Plus'
        }
    });
    //

    const processAry = computed(() => {

        let symbolSlanting = /[\/]/g;
        let result = symbolSlanting.exec(activeProcess.value);

        if (result !== null) {////

            // processStatus.value = 'Slanting';
            return activeProcess.value.split('/');
        } else {

            // processStatus.value = 'Normal';
            return [activeProcess.value];
        }
    });


    // const maxValue = computed(() => {
    //     /////processAry   ->[{process:LTHSEP1,,max:0.5},{process:LTHADF,max:0.6}]
    //     let container = [];
    //     for (let i = 0; i < processAry.value.length; i++) {
    //         const dealData = filterData.value.filter((item) => item[`Time${processAry.value[i]}`] !== ' '
    //             && item[`Time${processAry.value[i]}`] !== null);

    //         dealData.map((item) => {
    //             if (defectStatus.value.split('+').length > 0) {///'S1+S2'
    //                 let rate = 0;
    //                 for (let i = 0; i < defectAry.value.length; i++) {
    //                     item[defectAry.value[i]] === '.'
    //                         ? rate += 0
    //                         : rate += Number(item[defectAry.value[i]]) * 100
    //                 };
    //                 return rate
    //             } else {///'O51/O52'
    //                 return Number(item[props.defect] === '.' ? 0 : item[props.defect]) * 100;
    //             }

    //         })




    //     }

    //     return
    // })



    const anovaAry = computed(() => {

        let processBox = [];
        for (let p = 0; p < processAry.value.length; p++) {///// ['LTHADF','LTHSEP',...]
            // const processObj = {};
            // processObj.process = processAry.value[p];

            const baseData = filterData.value
                .filter((item) => item[`Time${processAry.value[p]}`] !== ' '
                    && item[`Time${processAry.value[p]}`] !== null)
                .sort((a, b) => Date.parse(a[`Time${processAry.value[p]}`]) - Date.parse(b[`Time${processAry.value[p]}`]));
            const baseMachine = [...new Set(baseData.map((item) => item[`Machine${processAry.value[p]}`]))];

            if (defectStatus.value === 'Slanting') {

                for (let d = 0; d < defectAry.value.length; d++) {///['O51','O52']
                    const processObj = {};
                    processObj.process = processAry.value[p];
                    processObj.defect = defectAry.value[d];

                    const machineBox = [];
                    const maxBox=[];
                    for (let m = 0; m < baseMachine.length; m++) {
                        let machineObj = { data: {} };

                        machineObj.machine = baseMachine[m];

                        let rawData = baseData
                            .filter((item) => item[`Machine${processAry.value[p]}`] === baseMachine[m])
                            .map((item) => Number(item[defectAry.value[d]] === '.' ? 0 : item[defectAry.value[d]]) * 100);
                        machineObj.data.raw = rawData;
                        machineObj.data.len = rawData.length;
                        machineObj.data.avg = rawData.reduce((acc, cur) => acc + cur) / rawData.length;
                        maxBox.push(rawData.sort((a,b)=>b-a)[0]);
                        machineBox.push(machineObj);
                    }

                    processObj.max=maxBox.sort((a,b)=>b-a);
                    processObj.data = machineBox;

                    processBox.push(processObj);
                }

            } else {
                const processObj = {};
                processObj.process = processAry.value[p];
                processObj.defect = activeDefect.value.split(' ')[1];

                const machineBox = [];
                const maxBox=[];
                for (let m = 0; m < baseMachine.length; m++) {
                    const machineObj = { data: {} };

                    machineObj.machine = baseMachine[m];

                    const rawData = baseData
                        .filter((item) => item[`Machine${processAry.value[p]}`] === baseMachine[m])
                        .map((item) => {
                            let rate = 0;
                            for (let i = 0; i < defectAry.value.length; i++) {////['S1','S2']
                                item[defectAry.value[i]] === '.'
                                    ? rate += 0
                                    : rate += Number(item[defectAry.value[i]]) * 100
                            };
                            return rate
                        });

                    machineObj.data.raw = rawData;
                    machineObj.data.len = rawData.length;
                    machineObj.data.avg = rawData.reduce((acc, cur) => acc + cur) / rawData.length;
                    maxBox.push(rawData.sort((a,b)=>b-a)[0]);
                    machineBox.push(machineObj);
                }

                processObj.max=maxBox.sort((a,b)=>b-a)[0];
                processObj.data = machineBox;
                processBox.push(processObj);
            }
            // processBox.push(processObj);
        }///process for
        return processBox;
    });

    // [
    //     {
    //         process: LTHADF,defect:'S3+S5+S6' ,data:
    //             [
    //                 { machine: '#1', data: { raw: [], avg: '0.5', len: '100' } },
    //                 { ...},
    //                 { ...}
    //             ]
    //     },

    // ]



    // const processMaxValue=computed(()=>{///似乎要來算Anova
    //     //processAry.value
    //     const container=[];

    //     for(let i=0;i<processAry.value.length;i++){
    //         filterData.value.filter((item)=>item[`Machine${processAry.value[i]}`])
    //     }
    //     return 
    // });
    // const dfGValue=computed(()=>{
    //     let container=
    //     [...new Set(filterData.value.filter((item)=>item[`Machine${processAry.value[i]}`]))].length
    //     return 
    // })


    // 
    const processStatus = computed(() => {
        let symbolSlanting = /[\/]/g;
        let result = symbolSlanting.exec(activeProcess.value);
        if (result !== null) {
            return 'Slanting';
        } else {
            return 'Normal';
        }
    });

    const categoriesAry = computed(() => {////x軸 BU O51/O52 一個  PTHCUM1/PTHFCU1 兩個
        if (processStatus.value === 'Slanting') {
            let container = [];
            processAry.value.forEach((process) => {
                let data = filterData.value
                    .filter((item) => item[`Time${process}`] !== ' ' && item[`Time${process}`] !== null)
                    .map((item) => item[`Time${process}`])
                    .sort((a, b) => Date.parse(a) - Date.parse(b));
                container.push({ data: data, process: process });
            });
            return container;
            ///['...','...']
            ///[{data:[],process:PTHCUM1},{data:[],process:PTHFCU1}]
        } else {

            return filterData
                .value.filter((item) => item[`Time${processAry.value[0]}`] !== ' ' && item[`Time${processAry.value[0]}`] !== null)///排除掉時間為空
                .map((item) => processAry.value[0] !== 'ChangeTime' ? item[`Time${processAry.value[0]}`] : item.ChangeTime)
                .sort((a, b) => Date.parse(a) - Date.parse(b))
        };
    });

    const triggerVal = computed(() => {
        return Number(triggerData.value
            .filter((item) => item.Type === activeDefect.value.split(' ')[0] && item.Defect === activeDefect.value.split(' ')[1])
            .map((item) => item.Rate)[0])

    });

    // let machineAry=[...new Set(dealData.map((item)=>item[`Machine${processAry.value[0]}`]))];

    // const machineAry=computed(()=>{
    //     if()
    // })
    ///processAry['LTHADF1']或['LTHSEP1','LTHADF1']
    ////預計得到['#1','#2','#3',...]
    const machineAry = computed(() => {
        if (processAry.value.length === 1) {/////['LTHADF1']
            return [...new Set(filterData.value
                .filter((item) => item[`Time${processAry.value[0]}`] !== ' ' && item[`Time${processAry.value[0]}`] !== null && item[`Machine${processAry.value[0]}`] !== ' ')
                .map((item) => item[`Machine${processAry.value[0]}`])
                .sort((a, b) => Number(a.slice(-3)) - Number(b.slice(-3)))
            )
            ]

            ////[#1,#2,#3,...]

        } else {/////['PTHCUM1','PTHFCU1']
            const container = [];
            for (let i = 0; i < processAry.value.length; i++) {
                const obj = {};
                const data = [...new Set(filterData.value
                    .filter((item) => item[`Time${processAry.value[i]}`] !== '' && item[`Time${processAry.value[i]}`] !== null && item[`Machine${processAry.value[i]}`] !== ' ')
                    .map((item) => item[`Machine${processAry.value[i]}`])
                    .sort((a, b) => Number(a.slice(-3)) - Number(b.slice(-3)))
                )

                ];
                obj.process = processAry.value[i];
                obj.data = data;
                container.push(obj);
            };
            return container;////{process:SAPECU1,data:[#1,#2]}(SAPECU)
        }
    });

    return {
        defectStatus, processStatus, defectAry, processAry, categoriesAry, triggerVal, radioItem, machineAry, colorAry, anovaAry
    }
})