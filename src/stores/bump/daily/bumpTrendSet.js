import { ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js';
import Highcharts from 'highcharts';

import { UsebumpTableStore } from './bumpTableSet.js';
const usebumptablestore = UsebumpTableStore(pinia);
const { partRecord } = storeToRefs(usebumptablestore);

import { apiGetBumpTrendData } from '../../../api/index.js';




export const UseTrendStore = defineStore('bumpdailytrend', () => {

    const defect = ref('');
    const itemSelect = ref('');

    const defecttrendData = ref([]);

    const selectStatus = ref(false);

    watch(partRecord, (newval, oldval) => {////料號更動時，trnedchart不見
        selectStatus.value = false;
    });
    ///
    const gettrendData = async () => {
        try {
            const res = await apiGetBumpTrendData(defect.value, partRecord.value);
            console.log('trend res data', res.data);
            defecttrendData.value = res.data;
        } catch (error) {
            console.log('bump trend error', error);
        }
    };


    const seriesAry = computed(() => {
        const container = [];
        const machineAry = [...new Set(defecttrendData.value.map((item) => item.u_ball_name))]
            .sort((a,b)=>Number(a.substr(-3))-Number(b.substr(-3)));

        machineAry.forEach((mac, idx) => {
            const passObj = {};
            passObj.type = 'line';
            passObj.lineColor = Highcharts.getOptions().colors[idx];
            passObj.name = mac;
            passObj.marker = {};
            passObj.marker.enabled = true;
            passObj.marker.lineWidth = 2;
            passObj.marker.lineColor = Highcharts.getOptions().colors[idx];
            passObj.marker.fillColor = 'white';
            passObj.marker.symbol = 'circle';

            const eachmacAry = defecttrendData.value
            .sort((a,b)=>Date.parse(a.u_ball_c)-Date.parse(b.u_ball_c))
            
            
            passObj.data = eachmacAry.map((item) => item.u_ball_name === mac ? Number(item.Rate)*100 : null);
            passObj.lotnumber=eachmacAry.map((item) => item.u_ball_name === mac ? item.lotno : null);

            container.push(passObj);
        })
        return container
    });

    const timeAry=computed(()=>{
        return defecttrendData.value.sort((a,b)=>Date.parse(a.u_ball_c)-Date.parse(b.u_ball_c)).map((item) => item.u_ball_c);
        
    });


    watch(seriesAry,(newval,oldval)=>{
        console.log('seriesAry',newval,oldval);
    })

    watch(timeAry,(newval,oldval)=>{
        console.log('timeAry',newval,oldval);
    })

    return {
        gettrendData, defect,seriesAry,timeAry,defecttrendData,selectStatus,itemSelect
    }
})

