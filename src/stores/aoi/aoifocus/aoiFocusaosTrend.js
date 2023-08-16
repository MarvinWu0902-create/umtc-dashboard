import { ref, computed, watchEffect, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia';
import pinia from '@/stores/index.js'
import { UseaoiFocus } from '@/stores/aoi/aoifocus/aoiFocusFetch.js';
import { UseTableSetStore } from '@/stores/aoi/aoifocus/aoiFocusTableSet.js'

const useaoifocus = UseaoiFocus(pinia);
const { aostrendData } = storeToRefs(useaoifocus);

const usetablesetstore = UseTableSetStore(pinia);
const { partRecord } = storeToRefs(usetablesetstore);

export const SetAosStore = defineStore('setaossotre', () => {

    const weekLoc = ref(4);
    const dayLoc = ref(5);

    const aosfilterData = computed(() => {
        return aostrendData.value
            .filter((item) => item.PartNo === partRecord.value);
    });


    const weekAry = computed(() => {
        return [...new Set(aosfilterData.value
            .map((item) => Number(item.Week))
            .sort((a, b) => b - a))
        ]
            .slice(0, weekLoc.value)
            .reverse()
    });

    const dayAry = computed(() => {
        return [...new Set(aosfilterData.value
            .map((item) => Number(item.Day))
            .sort((a, b) => b - a))
        ]
            .slice(0, dayLoc.value)
            .reverse()
    });

    const xweekAry = computed(() => {
        return weekAry.value.map((item) => 'W' + String(item).substring(4, 6))
    })
    const xdayAry = computed(() => {
        return dayAry.value.map((item) => String(item).substring(4, 8))
    });

    const xaxisAry = computed(() => {
        return [...xweekAry.value, ' ', ...xdayAry.value]
    });

    const fbAry = computed(() => {
        {
            return [...new Set(aosfilterData.value
                .map((item) => item.FB))]
                .sort((a, b) => (a === '-Outer'
                    ? a = 100
                    : a.substring(0, a.length - 2)) - (b === '-Outer'
                        ? b = 100
                        : b.substring(0, b.length - 2)))
        }
    });

    const getBoxPlotData = (ary) => {
        let sorted = [];
        if (ary === null) {
            return {};
        } else {
            sorted = ary.sort((a, b) => a - b)
        };

        return {
            low: sorted[0],
            q1: sorted[Math.round(ary.length * 0.25)],
            median: sorted[Math.round(ary.length * 0.5)],
            q3: sorted[Math.round(ary.length * 0.75)],
            high: sorted[sorted.length - 1]
        }
    };

    // const canvasData=ref([]);///準備存該料號所有FB的Array
    const canvasData = computed(() => {

        let dataBag = [];

        for (let f = 0; f < fbAry.value.length; f++) {

            let testobj = {};
            let fbMean = [];
            let fbbefMean = [];

            let fbpoint = [];
            let fbbefpoint = [];

            let fbscaTotal = [];
            let fbscabefTotal = [];

            let fbfilterData = aosfilterData.value.filter((item) => item.FB === fbAry.value[f]);
            let triValue = [...new Set(fbfilterData
                .map((item) => Number(item.Triger)))
            ]
                .filter((item) => item !== 0)[0];
            let tgValue = [...new Set(fbfilterData
                .map((item) => Number(item.Target)))
            ]
                .filter((item) => item !== 0)[0];

            for (let w = 0; w < weekAry.value.length; w++) {

                let weekData = fbfilterData
                    .filter((item) => item.Week === String(weekAry.value[w]));

                let boxplotAry = weekData.map((item) => Number(item.Yield));
                let boxplotbefAry = weekData.map((item) => Number(item.Bef_Yield));
                ///[0.95,0.96,0.99,...] =>W16
                let meanValue = boxplotAry.length === 0
                    ? null
                    : boxplotAry
                        .reduce((acc, cur) => parseFloat(acc) + parseFloat(cur)) / boxplotAry.length

                let meanbefValue = boxplotbefAry.length === 0
                    ? null
                    : boxplotbefAry
                        .reduce((acc, cur) => parseFloat(acc) + parseFloat(cur)) / boxplotbefAry.length

                let scatterData = weekData
                    .map((item) => [
                        weekAry.value.indexOf(Number(item.Week)),
                        Number(item.Yield),
                        item.LotNum,
                        item.Layer,
                        item.LotType,
                        item.ChangeTime
                    ]);/////[0,0.95,...],[1,0.96,...],[2,0.99,...]

                let scatterbefData = weekData
                    .map((item) => [
                        weekAry.value.indexOf(Number(item.Week)),
                        Number(item.Bef_Yield),
                        item.LotNum,
                        item.Layer,
                        item.LotType,
                        item.ChangeTime
                    ]);

                fbMean.push(meanValue);
                fbbefMean.push(meanbefValue);

                fbpoint.push(boxplotAry);
                fbbefpoint.push(boxplotbefAry);

                fbscaTotal.push(...scatterData);
                fbscabefTotal.push(...scatterbefData);
            }///week
            fbMean.push(null)
            fbbefMean.push(null)
            fbpoint.push(null)
            fbbefpoint.push(null)
            fbscaTotal.push(null)
            fbscabefTotal.push(null)

            for (let d = 0; d < dayAry.value.length; d++) {

                let dayData = fbfilterData
                    .filter((item) => item.Day === String(dayAry.value[d]));

                let boxplotAry = dayData.map((item) => Number(item.Yield));
                let boxplotbefAry = dayData.map((item) => Number(item.Bef_Yield));
                ///[0.95,0.96,0.99,...] =>W16
                let meanValue = boxplotAry.length === 0
                    ? null
                    : boxplotAry
                        .reduce((acc, cur) => parseFloat(acc) + parseFloat(cur)) / boxplotAry.length

                let meanbefValue = boxplotbefAry.length === 0
                    ? null
                    : boxplotbefAry
                        .reduce((acc, cur) => parseFloat(acc) + parseFloat(cur)) / boxplotbefAry.length

                let scatterData = dayData
                    .map((item) => [
                        dayAry.value.indexOf(Number(item.Day)) + dayLoc.value,
                        Number(item.Yield),
                        item.LotNum,
                        item.Layer,
                        item.LotType,
                        item.ChangeTime
                    ]);/////[0,0.95,...],[1,0.96,...],[2,0.99,...]

                let scatterbefData = dayData
                    .map((item) => [
                        dayAry.value.indexOf(Number(item.Day)) + dayLoc.value,
                        Number(item.Bef_Yield),
                        item.LotNum,
                        item.Layer,
                        item.LotType,
                        item.ChangeTime
                    ]);

                fbMean.push(meanValue);
                fbbefMean.push(meanbefValue);

                fbpoint.push(boxplotAry);
                fbbefpoint.push(boxplotbefAry);

                fbscaTotal.push(...scatterData);
                fbscabefTotal.push(...scatterbefData);
            }///day

            let boxplotData = fbpoint.map(getBoxPlotData);
            let boxplotbefData = fbbefpoint.map(getBoxPlotData);
            testobj.PN = partRecord.value
            testobj.FB = fbAry.value[f];
            testobj.mean = fbMean;
            testobj.meanbef = fbbefMean;
            testobj.boxplot = boxplotData;
            testobj.boxplotbef = boxplotbefData;
            testobj.point = fbscaTotal;
            testobj.pointbef = fbscabefTotal;
            testobj.trigger = triValue;
            testobj.target = tgValue;

            dataBag.push(testobj);
        }////fbdatafor
        return dataBag
    })



    return {
        xaxisAry, fbAry, canvasData
    }
})