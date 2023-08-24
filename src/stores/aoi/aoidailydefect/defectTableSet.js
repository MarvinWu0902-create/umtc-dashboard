import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
// import { apiGetaoiDefectData } from '@/api/index.js'

import { storeToRefs } from 'pinia'
import pinia from '../../index.js'


import { UsedefectFetch } from '../../../stores/aoi/aoidailydefect/defectFetch.js';
const usedefectfetch = UsedefectFetch(pinia);
////defectfuckingData
const { defectfuckingData } = usedefectfetch;
const { filterData, activeDefect, activeProcess, matchData,time_params } = storeToRefs(usedefectfetch);

import { UsedefectHC } from '../../../stores/aoi/aoidailydefect/defectHCSet.js';
const usedefecthc = UsedefectHC(pinia);
const { defectAry, processAry, categoriesAry, defectStatus, processStatus, triggerVal, radioItem } = storeToRefs(usedefecthc);

export const UsedefectTable = defineStore('useaoidailydefecttable', () => {





    const columnList = ref(
        [
            { Defect: 'BU S1+S2', column: ['MachineLTHADF1', 'TimeLTHADF1','MachineLTHSEP1', 'TimeLTHSEP1', 'S1', 'S2', 'S1+S2'], title: ['Litho壓膜機台', 'CheckIn','Litho曝光機台', 'CheckIn', 'S1', 'S2', 'S1+S2'] },
            { Defect: 'BU S3+S5+S6', column: ['MachineLTHSEP1', 'TimeLTHSEP1','MachineLTHADF1', 'TimeLTHADF1', 'S3', 'S5', 'S6', 'S3+S5+S6'], title: ['Litho曝光機台', 'CheckIn','Litho壓膜機台', 'CheckIn', 'S3', 'S5', 'S6', 'S3+S5+S6'] },
            { Defect: 'BU O1+O4', column: ['MachineLTHADF1', 'TimeLTHADF1', 'MachineLTHDFV1', 'TimeLTHDFV1', 'O1', 'O4','O1+O4'], title: ['Litho壓膜機台', 'CheckIn', 'Litho顯影機台', 'CheckIn', 'O1', 'O4','O1+O4'] },
            { Defect: 'BU O2+O6', column: ['MachinePTHSAC1', 'TimePTHSAC1','MachineAOIVRS1', 'TimeAOIVRS1','O2', 'O6','O2+O6'], title: ['增層去膜蝕刻機台', 'CheckIn','VRS機台','CheckIn','O2', 'O6','O2+O6'] },
            { Defect: 'BU O51/O52', column: ['MachineSAPECU1', 'TimeSAPECU1', 'MachinePTHCUM1', 'TimePTHCUM1', 'MachineSAPPEC1', 'TimeSAPPEC1', 'O51', 'O52'], title: ['化銅機台', 'CheckIn', 'ASM機台', 'CheckIn', '板清機台', 'CheckIn', 'O51', 'O52'] },////'SAPECU1/PTHCUM1/SAPPEC1
            { Defect: 'BU A3+A4+A7', column: ['MachinePTHCUM1', 'TimePTHCUM1', 'MachinePTHFCU1', 'TimePTHFCU1','MachineABFMEC1', 'TimeABFMEC1', 'CoreO4O7', 'BU2FBA3A4', 'A3A4 w/o O4O7', 'A3', 'A4', 'A7', 'A3+A4+A7'], title: ['ASM機台', 'CheckIn', 'UVCP機台', 'CheckIn','MEC機台', 'CheckIn','CoreO4O7', 'BU2FBA3A4', 'A3A4 w/o O4O7', 'A3', 'A4', 'A7', 'A3+A4+A7'] },
            { Defect: 'Core S4', column: ['MachineLTHDES1','TimeLTHDES1','S4'],title:['內層線路蝕刻機台','CheckIn','S4'] },
            { Defect: 'BU O7', column: ['MachineSAPPEC1', 'TimeSAPPEC1', 'O7'], title: ['板清機台', 'CheckIn', 'O7'] },
            { Defect: 'BU A5+A6', column: ['MachineLDLCOL1', 'TimeLDLCOL1', 'MachineLTHSEP1', 'TimeLTHSEP1', 'A5', 'A6', 'A5+A6'], title: ['雷射機台', 'CheckIn', '曝光機台', 'CheckIn', 'A5', 'A6', 'A5+A6'] }////'LDLCOL1/LTHSEP1'
        ]
    );

    const renderColumn = computed(() => {
        let test = columnList.value.filter((item) => item.Defect === activeDefect.value)[0];
        return test
    });

    const tableData = computed(() => {

        if (defectStatus.value === 'Normal' || defectStatus.value === 'Plus') {
            ////O4 S1+S2
            
            return filterData.value
                .filter((item) => {

                    let defectVal = 0;
                    for (let i = 0; i < defectAry.value.length; i++) {
                        item[defectAry.value[i]] === '.'
                            ? defectVal += 0
                            : defectVal += Number(item[defectAry.value[i]]) ////
                    };
                    item[activeDefect.value.split(' ')[1]] = String(defectVal);
                    // return Date.parse(item.ChangeTime) >= yestimeStamp && defectVal >= triggerVal.value
                    return Date.parse(item.ChangeTime)>=time_params.value.st
                    &&Date.parse(item.ChangeTime)<=time_params.value.et
                    &&defectVal >= triggerVal.value
                })
                // .sort((a, b) => Date.parse(a) - Date.parse(b));

        } else {///Slanting O51/O52
            return filterData.value
                .filter((item) => {
                    for (let i = 0; i < defectAry.value.length; i++) {
                        // return Date.parse(item.ChangeTime) >= yestimeStamp && item[defectAry.value[i]] >= triggerVal.value && item[defectAry.value[i]] !== '.'
                        return Date.parse(item.ChangeTime)>=time_params.value.st
                            &&Date.parse(item.ChangeTime)<=time_params.value.et
                            &&item[defectAry.value[i]] >= triggerVal.value
                            && item[defectAry.value[i]] !== '.'
                    };
                })
                // .sort((a, b) => Date.parse(a) - Date.parse(b));
        };
    });

    watch(activeDefect, (newval, oldval) => {
        if (newval === 'BU A3+A4+A7' && radioItem.value === 'oridinary') {

            let lot = tableData.value.map((item) => item.LotNum);
            console.log('確認批數',lot);
            if(lot.length>0){
                defectfuckingData(JSON.stringify(lot));
            }
        }
    });

    // const matchList=ref([]);

    watch(matchData, (newval, oldval) => {
        let container = [];
        let lot = [...new Set(newval.map((item) => item.LotNum))];
        lot.forEach((lot) => {
            let lotObj = {};
            let lotData = matchData.value.filter((item) => item.LotNum === lot);
            let panelAry = [...new Set(lotData.map((item) => item.BoardNo))];///[1,2,3,4,5,...]
            let mixedCount = 0;
            lotObj.LotNum = lot;
            lotObj.BU = lotData.filter((item) => item.Classify === 'A3' || item.Classify === 'A4').length;
            lotObj.Core = lotData.filter((item) => item.Classify === 'O4' || item.Classify === 'O7').length;
            // lotObj.Mixed=
            panelAry.forEach((panel) => {///[1,2,3,4,5,...]
                let panelData = lotData.filter((item) => item.BoardNo === panel);///符合該板號的data
                let sideAry = [...new Set(panelData.map((item) => item.OutSide))];////['C','S']or['C']or['S']
                sideAry.forEach((side) => {
                    let sideData = panelData.filter((item) => item.OutSide === side);///符合該板號該面次的data
                    ///要開始分群{Xvalue:222,Yvalue:223},{Xvalue:222,Yvalue:223}
                    ///判斷非同一Classify且後減前<1,mixedCount+1
                    let matchObj = { 'BU': [], 'Core': [] };
                    sideData.forEach((item) => {
                        // let matchObj={'BU':[],'Core':[]};
                        item.Classify === 'A3' || item.Classify === 'A4'
                            ? matchObj['BU'].push([item.Xvalue, item.Yvalue])
                            : matchObj['Core'].push([item.Xvalue, item.Yvalue])

                        // testcon.push(matchObj);
                    });
                    matchObj['BU'].forEach((item) => {
                        for (let i = 0; i < matchObj['Core'].length; i++) {
                            if (Math.abs(Number(item[0]) - Number(matchObj['Core'][i][0])) < 1 && Math.abs(Number(item[1]) - Number(matchObj['Core'][i][1]) < 1)) {
                                mixedCount += 1;
                            } else {
                                mixedCount += 0;
                            };
                        };
                    });
                    console.log('matchObj', matchObj, mixedCount);
                })
            })
            lotObj.Mixed = mixedCount;
            container.push(lotObj);
            ////同一BoardNo同一OutSide->Xvalue Yvalue 
        });
        console.log('container', container);
        console.log('table', tableData.value);
        tableData.value.forEach((item) => {
            ////container
            let lotAry = container.filter((match) => match.LotNum === item.LotNum);
            let lot = lotAry[0];  ///如果是空陣列的[0]->undefined

            if (lotAry.length > 0) {

                if (((item.LayerName.split('L')[2] - item.LayerName.split('L')[1]) + 1) / 2 === 2&&(item.ProdClass==='EMIB'||item.PartNo==='3273062')) {
                    item.CoreO4O7 = lot.Mixed;
                    item.BU2FBA3A4 = lot.BU;
                    item['A3A4 w/o O4O7'] = Number(item['A3+A4+A7']) * (1 - (lot.Mixed / lot.BU));
                } else {
                    item.CoreO4O7 = ' ';
                    item.BU2FBA3A4 = ' ';
                    item['A3A4 w/o O4O7'] = ' ';
                }
            }
        });
        console.log('tableData.value ck', tableData.value);
    });

    // const matchtableData=computed(()=>{
    //     return tableData.value
    // })

    // const activeDefect = ref('BU S1+S2');
    // const activeProcess=ref('LTHADF1');



    return {
        tableData, columnList, renderColumn
    }
})