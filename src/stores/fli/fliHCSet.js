import { ref, computed, watch } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import pinia from '../index.js';

import { UsefliFetch } from './fliFetch.js';
import { UsefliTableSet } from './fliTableSet.js';

import Highcharts from 'highcharts';

const useflifetch = UsefliFetch(pinia);
const { trendData, fli_params } = storeToRefs(useflifetch);///全部的data 需要篩選partRecord的前100筆資料

const useflitableset = UsefliTableSet(pinia);
const { partRecord } = storeToRefs(useflitableset);

export const UseHCStore = defineStore('dailyhcfli', () => {

    // const defectAry=ref(['P3',''])
    const defectAry = ref(['P3', 'S9', 'O8', 'S21', 'A13', 'P2', 'A5', 'A17', 'A9', 'A19', 'A21', 'S12', 'O52', 'S2', 'A16', 'A41', 'S11', 'S13', 'S14', 'A1', 'S10', 'A2', 'A6', 'O10', 'A20', 'O1', 'A10', 'A12', 'A18', 'Yield'])
    const pntrendData = computed(() => {
        const save = trendData.value
            .filter((item) => item.PN === partRecord.value)
            .sort((a, b) => new Date(b.Time) - new Date(a.Time))
        return save
        // .map((item)=>item.checkouttime);
    });///時間由大到小

    const xAxisAry = computed(() => {
        return pntrendData.value
            .map((item) => item.LotNum)
            .slice(0, 100)
            .reverse();
    });///選時間大到小前100批->又反轉回小至大

    const timeAry = computed(() => {
        return pntrendData.value
            .map((item) => new Date(item.Time))
            .slice(0, 100)
            .reverse();
    });////選小到大前100批的時間

    const triggerVal=computed(()=>{
        return Number(pntrendData.value[0].Triger)
    });


    const seriesAry = computed(() => {
        const container = [];
        defectAry.value.forEach((item) => {
            const passObj = {};
            if (item !== 'Yield') {
                passObj.type = 'column';
                passObj.name = item;
            } else {
                passObj.type = 'line';
                passObj.name = 'FLI';
                passObj.yAxis = 1;
                passObj.marker = {};
                passObj.lineColor='gray';
                passObj.marker.lineWidth = 2;
                passObj.marker.lineColor = Highcharts.getOptions().colors[3];
                passObj.marker.fillColor = 'white'
            }
            passObj.data = pntrendData.value
                .map((obj) => Number(obj[item]) * 100)
                .slice(0, 100)///時間大到小
                .reverse();///再反轉成小至大
            container.push(passObj);

        });
        return container
    })

    return {
        pntrendData, xAxisAry, timeAry,triggerVal, seriesAry
    }
})