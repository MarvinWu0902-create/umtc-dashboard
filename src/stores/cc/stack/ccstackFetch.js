import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

import { apiGetccstackData, apiGetccstackPNData, apiGetccstackYieldData } from '@/api/index.js';

export const UseccstackStore = defineStore('ccstack', () => {

    const partData = ref([]);
    const stackData = ref([]);
    const yieldData = ref([]);

    const navpartRecord=ref('');
    const defectSelect=ref('Yield');

    const defectAry = ref(['Yield', 'T44', 'T15']);

    const weekData = ref([]);

    const getmountData = async () => {////先取得前10周料號並取第一個料號和資料為初始渲染
        try {
            const res = await apiGetccstackPNData();

            console.log('res.data',res.data);

            partData.value = res.data.map((item) => item.partno)
                .sort((a, b) => a.substr(0, 4) - b.substr(0, 4))
                .sort((a, b) => a.substr(0, 4) !== '6111' ? a.substr(4, 3) - b.substr(4, 3) : (a.substr(4, 1)).localeCompare(b.substr(4, 1)))

            navpartRecord.value = partData.value[0];
            


            const des = await apiGetccstackData(navpartRecord.value);///param.value.partRecord
            console.log('des',des.data);
            stackData.value = des.data.filter((item) =>
                [...new Set(des.data.map((item) => item.Week))]
                    .sort((a, b) => Number(a) - Number(b))
                    .slice(-10)
                    .includes(item.Week));

            const yis = await apiGetccstackYieldData(navpartRecord.value);///param.value.partRecord
            
            yieldData.value = yis.data.filter((item) =>
            
                [...new Set(yis.data.map((item) => item.Week))]
                    .sort((a, b) => Number(a) - Number(b))
                    .slice(-10)
                    .includes(item.Week))
                .sort((a, b) => new Date(a.Time) - new Date(b.Time))
            ///
            weekData.value = [...new Set(yis.data.map((item) => item.Week))]
                .sort((a, b) => Number(a) - Number(b))
                .slice(-10);

                ////[...new Set(yieldData.value.filter((item)=>item.Yield!=='.').map((item)=>item.Week))]


        } catch (error) {
            console.log('cc mount fetch error', error);
        }
    };

    const getccstackData = async (part) => {
        try {

            const yis = await apiGetccstackYieldData(part);

            yieldData.value = yis.data.filter((item) =>
                [...new Set(yis.data.map((item) => item.Week))]
                    .sort((a, b) => Number(a) - Number(b))
                    .slice(-10)
                    .includes(item.Week))
                .sort((a, b) => new Date(a.Time) - new Date(b.Time));

            weekData.value = [...new Set(yis.data.map((item) => item.Week))]
                .sort((a, b) => Number(a) - Number(b))
                .slice(-10);

            const des = await apiGetccstackData(part);
            stackData.value = des.data.filter((item) =>
                [...new Set(des.data.map((item) => item.Week))]
                    .sort((a, b) => Number(a) - Number(b))
                    .slice(-10)
                    .includes(item.Week));

        } catch (error) {
            console.log('cc stack fetch error', error);
        }
    };



    return{
        getmountData,getccstackData,partData,weekData,yieldData,stackData,navpartRecord,defectAry,defectSelect
    }
})