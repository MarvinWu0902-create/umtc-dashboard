import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

import { apiGetaoistackData, apiGetaoistackPNData, apiGetaoistackYieldData } from '@/api/index.js';

export const UseaoistackStore = defineStore('aoistack', () => {


    const partData = ref([]);
    const stackData = ref([]);
    const yieldData = ref([]);

    // const param = ref({
    //     processRecord: 'BU',
    //     partRecord: ''
    // });
    // const processRecord=ref('BU');
    const navpartRecord=ref('');

    const defectSelect=ref('Yield');


    ///預設
    const radioItem=ref('BU');
    const defectAry = ref(['Yield', 'O2', 'O7', 'O51', 'O52', 'A3+A4', 'A5+A6', 'A51+A61', 'S1+S2', 'S3+S5+S6', 'O1+O4']);
    ///

    const weekData = ref([]);

    const getmountData = async (process) => {////先取得前10周料號並取第一個料號和資料為初始渲染
        try {
            const res = await apiGetaoistackPNData(process);

            partData.value = res.data.map((item) => item.PN)
                .sort((a, b) => a.substr(0, 4) - b.substr(0, 4))
                .sort((a, b) => a.substr(0, 4) !== '6111' ? a.substr(4, 3) - b.substr(4, 3) : (a.substr(4, 1)).localeCompare(b.substr(4, 1)))

            navpartRecord.value = partData.value[0];
            


            const des = await apiGetaoistackData(process, navpartRecord.value);///param.value.partRecord

            stackData.value = des.data.filter((item) =>
                [...new Set(des.data.map((item) => item.Week))]
                    .sort((a, b) => Number(a) - Number(b))
                    .slice(-10)
                    .includes(item.Week));
            

            const yis = await apiGetaoistackYieldData(process,navpartRecord.value);///param.value.partRecord

            yieldData.value = yis.data.filter((item) =>
                [...new Set(yis.data.map((item) => item.Week))]
                    .sort((a, b) => Number(a) - Number(b))
                    .slice(-10)
                    .includes(item.Week))
                .sort((a, b) => new Date(a.ChangeTime) - new Date(b.ChangeTime))
            ///
            weekData.value = [...new Set(yis.data.map((item) => item.Week))]
                .sort((a, b) => Number(a) - Number(b))
                .slice(-10);

        } catch (error) {
            console.log('aoi mount fetch error', error);
        }
    };

    const changeRadioData=async(process)=>{
        try {
            const res = await apiGetaoistackPNData(process);

            partData.value = res.data.map((item) => item.PN)
                .sort((a, b) => a.substr(0, 4) - b.substr(0, 4))
                .sort((a, b) => a.substr(0, 4) !== '6111' ? a.substr(4, 3) - b.substr(4, 3) : (a.substr(4, 1)).localeCompare(b.substr(4, 1)))

            navpartRecord.value = partData.value[0];

            console.log('navpartRecord.value change',navpartRecord.value);
            const yis = await apiGetaoistackYieldData(process,navpartRecord.value);

            console.log('check change',process,navpartRecord.value);
            yieldData.value = yis.data.filter((item) =>
                [...new Set(yis.data.map((item) => item.Week))]
                    .sort((a, b) => Number(a) - Number(b))
                    .slice(-10)
                    .includes(item.Week))
                .sort((a, b) => new Date(a.ChangeTime) - new Date(b.ChangeTime));

            weekData.value = [...new Set(yis.data.map((item) => item.Week))]
                .sort((a, b) => Number(a) - Number(b))
                .slice(-10);

            const des = await apiGetaoistackData(process, navpartRecord.value);
            stackData.value = des.data.filter((item) =>
                [...new Set(des.data.map((item) => item.Week))]
                    .sort((a, b) => Number(a) - Number(b))
                    .slice(-10)
                    .includes(item.Week));


        } catch (error) {
            console.log('aoi pn fetch error', error);
        }
    }


    const getaoistackData = async (process,part) => {
        try {

            // const res = await apiGetaoistackPNData(process);

            // partData.value = res.data.map((item) => item.PN)
            //     .sort((a, b) => a.substr(0, 4) - b.substr(0, 4))
            //     .sort((a, b) => a.substr(0, 4) !== '6111' ? a.substr(4, 3) - b.substr(4, 3) : (a.substr(4, 1)).localeCompare(b.substr(4, 1)))

            // navpartRecord.value = partData.value[0];

            const yis = await apiGetaoistackYieldData(process, part);
            console.log('check',process, part);
            yieldData.value = yis.data.filter((item) =>
                [...new Set(yis.data.map((item) => item.Week))]
                    .sort((a, b) => Number(a) - Number(b))
                    .slice(-10)
                    .includes(item.Week))
                .sort((a, b) => new Date(a.ChangeTime) - new Date(b.ChangeTime));

            weekData.value = [...new Set(yis.data.map((item) => item.Week))]
                .sort((a, b) => Number(a) - Number(b))
                .slice(-10);

            const des = await apiGetaoistackData(process, part);
            stackData.value = des.data.filter((item) =>
                [...new Set(des.data.map((item) => item.Week))]
                    .sort((a, b) => Number(a) - Number(b))
                    .slice(-10)
                    .includes(item.Week));

        } catch (error) {
            console.log('aoi stack fetch error', error);
        }
    };

    return {
        getaoistackData, getmountData,changeRadioData, partData, stackData, yieldData, weekData,navpartRecord,radioItem ,defectAry,defectSelect
    }
})