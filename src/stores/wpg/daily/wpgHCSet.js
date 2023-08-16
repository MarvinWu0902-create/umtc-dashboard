import { ref, computed, watch } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import pinia from '../../index.js';
import { UsewpgStore } from './wpgFetch.js';
import { UsewpgTableStore } from './wpgTableSet.js';
import Highcharts from 'highcharts';

const usewpgstore = UsewpgStore(pinia);
const { trendData } = storeToRefs(usewpgstore);///全部的data 需要篩選partRecord的前100筆資料

const usetablestore = UsewpgTableStore(pinia);
const { partRecord } = storeToRefs(usetablestore);

export const UseHCStore = defineStore('dailyhcwpg', () => {

    const binAry = ref(['2DMatrixfail', 'Land3Dfail','Invalidfail', 'Yield']);

    const targetVal = ref('');
    const triggerVal = ref('');

    const pntrendData = computed(() => {
        const save = trendData.value
            .filter((item) => item.PartNum === partRecord.value)
            .sort((a, b) => new Date(b.ChangeTime) - new Date(a.ChangeTime));

        targetVal.value = save.map((item) => item.Target)[0];
        triggerVal.value = save.map((item) => item.Triger)[0];
        return save
    });

    const xAxisAry = computed(() => {
        return pntrendData.value
            .map((item) => item.LotNum)
            .slice(0, 100)
            .reverse();
    });

    const timeAry = computed(() => {
        return pntrendData.value
            .map((item) => new Date(item.ChangeTime))
            .slice(0, 100)
            .reverse();
    });////選小到大前100批的時間

    const seriesAry = computed(() => {
        const container = [];
        binAry.value.forEach((item) => {
            const passObj = {};
            if (item !== 'Yield') {
                passObj.type = 'column';
                passObj.name = item;
            } else {
                passObj.type = 'line';
                passObj.name = 'WPG';
                passObj.yAxis = 1;
                passObj.marker = {};
                passObj.marker.lineWidth = 2;
                passObj.marker.lineColor = Highcharts.getOptions().colors[3];
                passObj.marker.fillColor = 'white'
            }
            passObj.data = pntrendData.value
                .map((obj) => Number(obj[item]) * 100)
                .slice(0, 100)///時間大到小
                .reverse();///再反轉成小至大
            container.push(passObj);
        })
        return container
    })
    return {
        pntrendData, xAxisAry, seriesAry, partRecord, timeAry, targetVal, triggerVal
    }
})