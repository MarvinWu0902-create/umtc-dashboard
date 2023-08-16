import { watchEffect, ref, watch, computed } from "vue";
import { defineStore, storeToRefs } from "pinia";
import pinia from "../index.js";

import { UseBtnStore } from "./IndexBtn.js";
import { UseHCClassStore } from './hcClass.js'

const usebtnstore = UseBtnStore(pinia);
const usehcclassstore = UseHCClassStore(pinia);

const { filterData, partList, clickHandle } = storeToRefs(usebtnstore);///filterData變化驅動

const { addColumnClassFn, addColumnPcClassFn, addLineClassFn,addLineAvgClassFn } = usehcclassstore;

const divValue=ref(true);


const yymmngData = ref([]);
const yywwngData = ref([]);
const yyddngData = ref([]);


const yymmData = ref([]);
const yymmInQty = ref([]);
const yymmOutQty = ref([]);///計算用

const yywwData = ref([]);
const yywwInQty = ref([]);
const yywwOutQty = ref([]);

const yyddData = ref([]);
const yyddInQty = ref([]);
const yyddOutQty = ref([]);


const p = ref(0);
const c = ref(0);
const m = ref(0);
const w = ref(0);
const d = ref(0);

const mLeft = ref(6);
const mRight = ref(0);
const wLeft = ref(6);
const wRight = ref(0);
const dLeft = ref(6);
const dRight = ref(0);

const process_array = ['OST', 'CC', 'WPG', 'VI', 'Bump', 'Inline'];

export const UseXYStore = defineStore('usexy', () => {

    const yymmAry = computed(() => {
        return [...new Set((divValue.value===true?filterData.value.filter((obj)=>obj.type!=='Div_Scrap'&&obj.type!=='Prc_Scrap'):filterData.value)
            .map((obj) => String(new Date(obj.ChangeTime).getFullYear()).substring(2, 4)
            .concat(
                new Date(obj.ChangeTime).getMonth() + 1 >= 10
                    ? String(new Date(obj.ChangeTime).getMonth() + 1)
                    : '0' + String(new Date(obj.ChangeTime).getMonth() + 1)
            )))]
    });///2303,2304,...

    const yywwAry = computed(() => {
        return [...new Set((divValue.value===true?filterData.value.filter((obj)=>obj.type!=='Div_Scrap'&&obj.type!=='Prc_Scrap'):filterData.value)
            .map((obj) => String(Math.ceil((new Date(obj.ChangeTime).getDay() + 1 + Math.floor((new Date(obj.ChangeTime) - new Date(new Date(obj.ChangeTime).getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000))) / 7)).length == 2
            ? String(new Date(obj.ChangeTime).getFullYear()).substring(2, 4)
                .concat(
                    Math.ceil((new Date(obj.ChangeTime).getDay() + 1 + Math.floor((new Date(obj.ChangeTime) - new Date(new Date(obj.ChangeTime).getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000))) / 7)
                )
            : String(new Date(obj.ChangeTime).getFullYear()).substring(2, 4) + '0' + Math.ceil((new Date(obj.ChangeTime).getDay() + 1 + Math.floor((new Date(obj.ChangeTime) - new Date(new Date(obj.ChangeTime).getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000))) / 7)
        )
            .sort((a, b) => Number(b) - Number(a)))]
    });

    const yyddAry = computed(() => {
        return [...new Set((divValue.value===true?filterData.value.filter((obj)=>obj.type!=='Div_Scrap'&&obj.type!=='Prc_Scrap'):filterData.value)
            .map((obj) => String(new Date(obj.ChangeTime).getFullYear()).substring(2, 4)
            .concat(
                new Date(obj.ChangeTime).getMonth() + 1 >= 10
                    ? String(new Date(obj.ChangeTime).getMonth() + 1)
                    : '0' + String(new Date(obj.ChangeTime).getMonth() + 1)
            )
            .concat(
                new Date(obj.ChangeTime).getDate() >= 10
                    ? String(new Date(obj.ChangeTime).getDate())
                    : '0' + String(new Date(obj.ChangeTime).getDate())
            )
        )
            .sort((a, b) => Number(b) - Number(a)))]
    });


    ///yymmAry yywwAry yyddAry 都是根據filterData變化驅動，也就是點選product或是partnum按鈕
    const yymmArySli = computed(() => {
        return yymmAry.value.slice(mRight.value, mLeft.value).reverse()
    });
    const yywwArySli = computed(() => {
        return yywwAry.value.slice(wRight.value, wLeft.value).reverse()
    });
    const yyddArySli = computed(() => {
        return yyddAry.value.slice(dRight.value, dLeft.value).reverse()
    });
    const xAxisData = computed(() => {
        
        return yymmArySli.value.concat('', yywwArySli.value, '', yyddArySli.value)
    });

    const seriesData = computed(() => {

        if (clickHandle.value === 'isCount') {

            const seriesLine = [];
            const seriesColumn = [];
            const seriesAvg=[];
            ///
            const avgYieldAry=[];

            ///
            for (p.value = 0; p.value < partList.value.length; p.value++) {
                if (partList.value[p.value] === 'All') {
                    continue;
                };
                const pnAryYield = [];
                const pnAryLots = [];
                for (m.value = 0; m.value < yymmArySli.value.length; m.value++) {
                    yymmData.value = filterData.value.filter((obj) => obj.OAY_yield != '.'
                        && obj.partnum == partList.value[p.value]
                        && (String(new Date(obj.ChangeTime).getFullYear()).substring(2, 4)
                            .concat(
                                new Date(obj.ChangeTime).getMonth() + 1 >= 10
                                    ? String(new Date(obj.ChangeTime).getMonth() + 1)
                                    : '0' + String(new Date(obj.ChangeTime).getMonth() + 1)
                            )) === yymmArySli.value[m.value]
                        &&(divValue.value===true?obj.type!=='Div_Scrap'&&obj.type!=='Prc_Scrap':obj.type!==null) 
                        );

                        
                        
                        

                    yymmInQty.value = yymmData.value.map((item) => Number(item.In_Qnty));
                    yymmOutQty.value = yymmData.value.map((item) => Number(item.Out_Qnty));

                    if (yymmData.value.length > 0) {
                        pnAryYield.push(
                            (yymmOutQty.value.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur)) / yymmInQty.value.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur))) * 100)
                        pnAryLots.push(yymmData.value.length);
                    } else {//沒東西
                        pnAryYield.push(null);
                        pnAryLots.push(null);
                    }///丟良率



                }///月的平均良率&

                pnAryYield.push(null);
                pnAryLots.push(null);

                for (w.value = 0; w.value < yywwArySli.value.length; w.value++) {

                    yywwData.value = filterData.value.filter((obj) => obj.OAY_yield != '.'
                        && obj.partnum == partList.value[p.value]
                        && (String(Math.ceil((new Date(obj.ChangeTime).getDay() + 1 + Math.floor((new Date(obj.ChangeTime) - new Date(new Date(obj.ChangeTime).getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000))) / 7)).length == 2
                            ? String(new Date(obj.ChangeTime).getFullYear()).substring(2, 4)
                                .concat(
                                    Math.ceil((new Date(obj.ChangeTime).getDay() + 1 + Math.floor((new Date(obj.ChangeTime) - new Date(new Date(obj.ChangeTime).getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000))) / 7)
                                )
                            : String(new Date(obj.ChangeTime).getFullYear()).substring(2, 4) + '0' + Math.ceil((new Date(obj.ChangeTime).getDay() + 1 + Math.floor((new Date(obj.ChangeTime) - new Date(new Date(obj.ChangeTime).getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000))) / 7)
                        ) === yywwArySli.value[w.value]
                        &&(divValue.value===true?obj.type!=='Div_Scrap'&&obj.type!=='Prc_Scrap':obj.type!==null) 
                        );


                    yywwInQty.value = yywwData.value.map((item) => Number(item.In_Qnty));
                    yywwOutQty.value = yywwData.value.map((item) => Number(item.Out_Qnty));

                    if (yywwData.value.length > 0) {
                        pnAryYield.push(
                            (yywwOutQty.value.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur)) / yywwInQty.value.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur))) * 100)
                        pnAryLots.push(yywwData.value.length);
                    } else {//沒東西
                        pnAryYield.push(null);
                        pnAryLots.push(null);
                    }
                }///周的平均良率


                pnAryYield.push(null);
                pnAryLots.push(null);


                for (d.value = 0; d.value < yyddArySli.value.length; d.value++) {

                    yyddData.value = filterData.value.filter((obj) => obj.OAY_yield != '.'
                        && obj.partnum == partList.value[p.value]
                        && (String(new Date(obj.ChangeTime).getFullYear()).substring(2, 4)
                            .concat(
                                new Date(obj.ChangeTime).getMonth() + 1 >= 10
                                    ? String(new Date(obj.ChangeTime).getMonth() + 1)
                                    : '0' + String(new Date(obj.ChangeTime).getMonth() + 1)
                            )
                            .concat(
                                new Date(obj.ChangeTime).getDate() >= 10
                                    ? String(new Date(obj.ChangeTime).getDate())
                                    : '0' + String(new Date(obj.ChangeTime).getDate())
                            )
                        ) === yyddArySli.value[d.value]
                        &&(divValue.value===true?obj.type!=='Div_Scrap'&&obj.type!=='Prc_Scrap':obj.type!==null) 
                        );

                                console.log('123 partList.value',partList.value[p.value]);
                                

                    yyddInQty.value = yyddData.value.map((item) => Number(item.In_Qnty));
                    yyddOutQty.value = yyddData.value.map((item) => Number(item.Out_Qnty));
                    console.log('yyddInQty.value',yyddInQty.value);
                    console.log('yyddOutQty.value',yyddOutQty.value);
                    console.log('day',yyddArySli.value[d.value]);
                    

                    if (yyddData.value.length > 0) {
                        console.log('y',(yyddOutQty.value.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur)) / yyddInQty.value.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur))) * 100)
                        pnAryYield.push(
                            (yyddOutQty.value.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur)) / yyddInQty.value.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur))) * 100);
                        pnAryLots.push(yyddData.value.length);
                    } else {//沒東西
                        pnAryYield.push(null);
                        pnAryLots.push(null);
                    }
                };///日的平均良率

                ////進行月/週/日 各料號算平均良率
                
                avgYieldAry.push(pnAryYield);
                




                /////
                seriesLine.push(addLineClassFn(partList, pnAryYield, 'spline', 'ShortDot', p));
                seriesColumn.push(addColumnClassFn(partList, pnAryLots, 'column', p));
            };///料號for


            let doCount = avgYieldAry[0].length///執行次數
            let aryCount = avgYieldAry.length;///陣列各數
            const finalAry = [];
            for (let i = 0; i < doCount; i++) {
                let dolocNum = 0;
                let nullCount = 0;
                for (let a = 0; a < aryCount; a++) {
                    avgYieldAry[a][i] === null ? nullCount += 1 : nullCount += 0;
                    ///計算每個陣列對應位置元素的null數
                    ///[0,1,2,3]
                    ///[1,2,3,4]
                    ///[null,1,2]
                    
                    dolocNum += avgYieldAry[a][i] === null ? 0 : avgYieldAry[a][i];
                }
                ///第一次執行結果dolocNum為1
                finalAry.push(aryCount - nullCount === 0 ? ' ' : (dolocNum / (aryCount - nullCount)));
                ///判斷不為間隔位置，則1/2=>0.5 (Avg) 
            }///dolocNum nullCount scope


            seriesAvg.push(addLineAvgClassFn(finalAry));




            return seriesLine.concat(seriesColumn,seriesAvg);
        } else {////clickHandle.value==='isPercent'
            const seriesPcColumn = [];
            const seriesLine = [];

            const seriesAvg=[];
            ///
            const avgYieldAry=[];

            for (p.value = 0; p.value < partList.value.length; p.value++) {
                const pnAryYield = [];///
                for (c.value = 0; c.value < process_array.length; c.value++) {////要算各process的NG顆數
                    const pnAryNG = [];
                    for (m.value = 0; m.value < yymmArySli.value.length; m.value++) {
                        ////yymmngData yymmData
                        yymmData.value = filterData.value
                            .filter((obj) => obj.partnum == partList.value[p.value]
                                // && eval(`obj.${process_array[c.value]}_NG != '.'`)
                                ///所以這樣會有OST_NG:'.'
                                && (String(new Date(obj.ChangeTime).getFullYear()).substring(2, 4)
                                    .concat(
                                        new Date(obj.ChangeTime).getMonth() + 1 >= 10
                                            ? String(new Date(obj.ChangeTime).getMonth() + 1)
                                            : '0' + String(new Date(obj.ChangeTime).getMonth() + 1)
                                    )) === yymmArySli.value[m.value]
                                && (divValue.value===true?obj.type!=='Div_Scrap'&&obj.type!=='Prc_Scrap':obj.type!==null)
                            );///filter

                        // yymmngData.value = yymmData.value.map((obj) => eval(`Number(obj.${process_array[c.value]}_NG)`));
                        yymmngData.value = yymmData.value.map((obj) => eval(`obj.${process_array[c.value]}_NG`)==='.'?0:eval(`Number(obj.${process_array[c.value]}_NG)`));

                        if (yymmngData.value.length > 0) {
                            pnAryNG.push(yymmngData.value.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur)));
                        } else {
                            pnAryNG.push(0);
                        }

                        if (c.value == 0) {
                            yymmInQty.value = yymmData.value.map((item) => Number(item.In_Qnty));
                            yymmOutQty.value = yymmData.value.map((item) => Number(item.Out_Qnty));
                            if (yymmData.value.length > 0) {
                                pnAryYield.push(
                                    (yymmOutQty.value.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur)) / yymmInQty.value.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur))) * 100)
                            } else {//沒東西
                                pnAryYield.push(null);
                            }///丟良率
                        }
                    }
                    if (c.value == 0) {
                        pnAryYield.push(null);
                    };
                    pnAryNG.push(null);
                    for (w.value = 0; w.value < yywwArySli.value.length; w.value++) {
                        ////yywwngData yywwData
                        yywwData.value = filterData.value
                            .filter((obj) => obj.partnum == partList.value[p.value]
                                // && eval(`obj.${process_array[c.value]}_NG != '.'`)
                                && (String(Math.ceil((new Date(obj.ChangeTime).getDay() + 1 + Math.floor((new Date(obj.ChangeTime) - new Date(new Date(obj.ChangeTime).getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000))) / 7)).length == 2
                                    ? String(new Date(obj.ChangeTime).getFullYear()).substring(2, 4)
                                        .concat(
                                            Math.ceil((new Date(obj.ChangeTime).getDay() + 1 + Math.floor((new Date(obj.ChangeTime) - new Date(new Date(obj.ChangeTime).getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000))) / 7)
                                        )
                                    : String(new Date(obj.ChangeTime).getFullYear()).substring(2, 4) + '0' + Math.ceil((new Date(obj.ChangeTime).getDay() + 1 + Math.floor((new Date(obj.ChangeTime) - new Date(new Date(obj.ChangeTime).getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000))) / 7)
                                ) === yywwArySli.value[w.value]
                                &&(divValue.value===true?obj.type!=='Div_Scrap'&&obj.type!=='Prc_Scrap':obj.type!==null)
                            );///filter
                        // yywwngData.value = yywwData.value.map((obj) => eval(`Number(obj.${process_array[c.value]}_NG)`));
                        yywwngData.value = yywwData.value.map((obj) => eval(`obj.${process_array[c.value]}_NG`)==='.'?0:eval(`Number(obj.${process_array[c.value]}_NG)`));

                        if (yywwngData.value.length > 0) {
                            pnAryNG.push(yywwngData.value.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur)));
                        } else {
                            pnAryNG.push(0);
                        }

                        if (c.value == 0) {
                            yywwInQty.value = yywwData.value.map((item) => Number(item.In_Qnty));
                            yywwOutQty.value = yywwData.value.map((item) => Number(item.Out_Qnty));
                            if (yywwData.value.length > 0) {
                                pnAryYield.push(
                                    (yywwOutQty.value.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur)) / yywwInQty.value.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur))) * 100)
                            } else {
                                pnAryYield.push(null);
                            }
                        }
                    }
                    if (c.value == 0) {
                        pnAryYield.push(null);
                    };
                    pnAryNG.push(null);
                    for (d.value = 0; d.value < yyddArySli.value.length; d.value++) {
                        ////yyddngData yyddData
                        yyddData.value = filterData.value
                            .filter((obj) => obj.partnum == partList.value[p.value]
                                // && eval(`obj.${process_array[c.value]}_NG != '.'`)
                                && (String(new Date(obj.ChangeTime).getFullYear()).substring(2, 4)
                                    .concat(
                                        new Date(obj.ChangeTime).getMonth() + 1 >= 10
                                            ? String(new Date(obj.ChangeTime).getMonth() + 1)
                                            : '0' + String(new Date(obj.ChangeTime).getMonth() + 1)
                                    )
                                    .concat(
                                        new Date(obj.ChangeTime).getDate() >= 10
                                            ? String(new Date(obj.ChangeTime).getDate())
                                            : '0' + String(new Date(obj.ChangeTime).getDate())
                                    )
                                ) === yyddArySli.value[d.value]
                                &&(divValue.value===true?obj.type!=='Div_Scrap'&&obj.type!=='Prc_Scrap':obj.type!==null)
                            );
                        // yyddngData.value=yyddData.value.map((obj) => eval(`Number(obj.${process_array[c.value]}_NG)`));
                        yyddngData.value = yyddData.value.map((obj) => eval(`obj.${process_array[c.value]}_NG`)==='.'?0:eval(`Number(obj.${process_array[c.value]}_NG)`));                
                        if (yyddngData.value.length > 0) {
                            pnAryNG.push(yyddngData.value.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur)));
                        } else {
                            pnAryNG.push(0);
                        }

                        if (c.value == 0) {
                            yyddInQty.value = yyddData.value.map((item) => Number(item.In_Qnty));
                            yyddOutQty.value = yyddData.value.map((item) => Number(item.Out_Qnty));
                            if (yyddData.value.length > 0) {
                                pnAryYield.push(
                                    (yyddOutQty.value.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur)) / yyddInQty.value.reduce((acc, cur) => parseFloat(acc) + parseFloat(cur))) * 100)
                            } else {
                                pnAryYield.push(null);
                            }
                            ////test
                            avgYieldAry.push(pnAryYield);


                            ////
                        }
                    }

                    seriesPcColumn.push(addColumnPcClassFn(partList, process_array, pnAryNG, 'column', c, p));

                }////要算各process的NG顆數
                seriesLine.push(addLineClassFn(partList, pnAryYield, 'spline', 'longdash', p, 2));
            };//料號for
            // return [...seriesPcColumn, seriesData.value.filter((item) => item.type === 'spline')[0]]
            ////
            let doCount = avgYieldAry[0].length///執行次數
            let aryCount = avgYieldAry.length;///陣列各數
            const finalAry = [];
            for (let i = 0; i < doCount; i++) {
                let dolocNum = 0;
                let nullCount = 0;
                for (let a = 0; a < aryCount; a++) {
                    avgYieldAry[a][i] === null ? nullCount += 1 : nullCount += 0;
                    ///計算每個陣列對應位置元素的null數
                    ///[0,1,2,3]
                    ///[1,2,3,4]
                    ///[null,1,2]
                    
                    dolocNum += avgYieldAry[a][i] === null ? 0 : avgYieldAry[a][i];
                }
                ///第一次執行結果dolocNum為1
                finalAry.push(aryCount - nullCount === 0 ? ' ' : (dolocNum / (aryCount - nullCount)));
                ///判斷不為間隔位置，則1/2=>0.5 (Avg) 
            }///dolocNum nullCount scope

            seriesAvg.push(addLineAvgClassFn(finalAry));

            return seriesLine.concat(seriesPcColumn,seriesAvg);
        }
    });

    return {
        divValue,xAxisData, seriesData, yymmArySli, yywwArySli, yyddArySli, mLeft, mRight, wLeft, wRight, dLeft, dRight
    }
})
