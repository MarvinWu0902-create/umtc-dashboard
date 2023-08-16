import { ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import pinia from "../index.js";
import { UseXYStore } from './XYAxisData.js'
import { UseBtnStore } from './IndexBtn.js'

const usexystore = UseXYStore(pinia);
const { xAxisData, seriesData, yymmArySli, yywwArySli, yyddArySli } = storeToRefs(usexystore);
const usebtnstore = UseBtnStore(pinia);
const { clickHandle, partList } = storeToRefs(usebtnstore);
///partList 判斷有幾個料號被選  
///clickHandle 判斷目前點擊 % or C
export const UseTableStore = defineStore('table', () => {
    
    const theadAry = computed(() => {
        const combineAry = ['PN', 'Label']
        let times = 0;
        const sptArr = xAxisData.value.join(' ').split('  ');

        for (const element of sptArr) {
            times++;
            const eachElement = element.split(' ');
            for (const elementItem of eachElement) {
                switch (times) {
                    case 1:
                        combineAry.push('M' + elementItem)
                        break;
                    case 2:
                        combineAry.push('W' + elementItem)
                        break;
                    case 3:
                        combineAry.push(elementItem)
                        break;
                }
            }
        };
        return combineAry
    });

    const bodyAry = computed(() => {

        const totalAry = [];
        const imcompleteAry = [];///for process
        const processAry = [];
        for (const partItem of partList.value) {

            const dealAry = seriesData.value.filter((item) =>
                item.name === partItem
                || item.name === 'OST'
                || item.name === 'CC'
                || item.name === 'WPG'
                || item.name === 'VI'
                || item.name === 'Bump'
                || item.name === 'Inline');

            
            for (const pnAry of dealAry) {
                console.log('pnAry',pnAry);
                if (pnAry.type === 'spline') {

                    const beginpAry = pnAry.data.map((item) => item === null ? ' ' : Number(item).toFixed(2) + '%');
                    
                    totalAry.push(
                        [partItem, 'OAY'].concat(
                            beginpAry.slice(0, yymmArySli.value.length)
                            , beginpAry.slice(yymmArySli.value.length + 1, yymmArySli.value.length + yywwArySli.value.length + 1)
                            , beginpAry.slice(yymmArySli.value.length + yywwArySli.value.length + 2, beginpAry.length)
                        )
                    );


                } else if (pnAry.name === 'OST' || pnAry.name === 'CC' || pnAry.name === 'VI' || pnAry.name === 'WPG' || pnAry.name === 'Bump' || pnAry.name === 'Inline') {

                    const beginpcAry = pnAry.data.map((item) => item === null ? ' ' : item);
                    console.log('pnAry.name', pnAry.name);
                    console.log('beginpcAry', beginpcAry);

                    processAry.push(
                        [partItem, pnAry.name]
                    );

                    imcompleteAry.push(
                        beginpcAry.slice(0, yymmArySli.value.length).concat(
                            beginpcAry.slice(yymmArySli.value.length + 1, yymmArySli.value.length + yywwArySli.value.length + 1)
                            , beginpcAry.slice(yymmArySli.value.length + yywwArySli.value.length + 2, beginpcAry.length)
                        )
                    );

                    if (imcompleteAry.length === 6) {///全滿

                        const calAry = imcompleteAry.map((ary) => ary.map((item, index) => String((item /
                            imcompleteAry.reduce((acc, cur) => cur.map((num1, index) => num1 + acc[index]))[index] * 100).toFixed(1)) + '%'));

                        processAry.forEach((item, index) => {
                            totalAry.push([...item, ...calAry[index]])
                        })
                    };
                }

                else if (pnAry.type === 'column') {
                    const beginlAry = pnAry.data.map((item) => item === null ? ' ' : String(item));
                    totalAry.push(
                        [partItem, 'Lots'].concat(
                            beginlAry.slice(0, yymmArySli.value.length)
                            , beginlAry.slice(yymmArySli.value.length + 1, yymmArySli.value.length + yywwArySli.value.length + 1)
                            , beginlAry.slice(yymmArySli.value.length + yywwArySli.value.length + 2, beginlAry.length)
                        )
                    );
                }

            }
        }
        return totalAry
    })
    return {
        theadAry, bodyAry
    }
})