import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

import { apiGetoststackData, apiGetoststackPNData, apiGetoststackYieldData } from '@/api/index.js';

export const UseoststackStore = defineStore('oststack', () => {

    const partData = ref([]);
    const stackData = ref([]);
    const yieldData = ref([]);

    const navpartRecord=ref('');
    const defectSelect=ref('Yield');

    const radioItem=ref('MP');
    const defectAry = ref(['Yield', 'Bin07', 'Bin08', 'Bin10', 'Bin21', 'Bin22', 'Bin23',
    'Bin31_clear', 'Bin31_aoi', 'Bin31_aos', 'Bin32','Bin33','Bin91','Bin92','Bin99']);

    const weekData = ref([]);

    const getmountData = async (process) => {////先取得前10周料號並取第一個料號和資料為初始渲染
        try {
            const res = await apiGetoststackPNData(process);


            partData.value = res.data.map((item) => item.partno)
                .sort((a, b) => a.substr(0, 4) - b.substr(0, 4))
                .sort((a, b) => a.substr(0, 4) !== '6111' ? a.substr(4, 3) - b.substr(4, 3) : (a.substr(4, 1)).localeCompare(b.substr(4, 1)))

            navpartRecord.value = partData.value[0];
            


            const des = await apiGetoststackData(process, navpartRecord.value);///param.value.partRecord

            stackData.value = des.data.filter((item) =>
                [...new Set(des.data.map((item) => item.Week))]
                    .sort((a, b) => Number(a) - Number(b))
                    .slice(-10)
                    .includes(item.Week));

            const yis = await apiGetoststackYieldData(process,navpartRecord.value);///param.value.partRecord

            yieldData.value = yis.data.filter((item) =>
                [...new Set(yis.data.map((item) => item.Week))]
                    .sort((a, b) => Number(a) - Number(b))
                    .slice(-10)
                    .includes(item.Week))
                .sort((a, b) => new Date(a.checkouttime) - new Date(b.checkouttime))
            ///
            weekData.value = [...new Set(yis.data.map((item) => item.Week))]
                .sort((a, b) => Number(a) - Number(b))
                .slice(-10);


        } catch (error) {
            console.log('ost mount fetch error', error);
        }
    };


    const getaoistackData = async (process,part) => {
        try {

            const yis = await apiGetoststackYieldData(process, part);
            console.log('check',process, part);
            yieldData.value = yis.data.filter((item) =>
                [...new Set(yis.data.map((item) => item.Week))]
                    .sort((a, b) => Number(a) - Number(b))
                    .slice(-10)
                    .includes(item.Week))
                .sort((a, b) => new Date(a.checkouttime) - new Date(b.checkouttime));

            weekData.value = [...new Set(yis.data.map((item) => item.Week))]
                .sort((a, b) => Number(a) - Number(b))
                .slice(-10);

            const des = await apiGetoststackData(process, part);
            stackData.value = des.data.filter((item) =>
                [...new Set(des.data.map((item) => item.Week))]
                    .sort((a, b) => Number(a) - Number(b))
                    .slice(-10)
                    .includes(item.Week));

        } catch (error) {
            console.log('ost stack fetch error', error);
        }
    };

    const changeRadioData=async(process)=>{
        try {
            const res = await apiGetoststackPNData(process);
            console.log('ress',res.data);
            partData.value = res.data.map((item) => item.partno)
                .sort((a, b) => a.substr(0, 4) - b.substr(0, 4))
                .sort((a, b) => a.substr(0, 4) !== '6111' ? a.substr(4, 3) - b.substr(4, 3) : (a.substr(4, 1)).localeCompare(b.substr(4, 1)))

            navpartRecord.value = partData.value[0];

            console.log('navpartRecord.value change',navpartRecord.value);
            const yis = await apiGetoststackYieldData(process,navpartRecord.value);

            console.log('check change',process,navpartRecord.value);
            yieldData.value = yis.data.filter((item) =>
                [...new Set(yis.data.map((item) => item.Week))]
                    .sort((a, b) => Number(a) - Number(b))
                    .slice(-10)
                    .includes(item.Week))
                .sort((a, b) => new Date(a.checkouttime) - new Date(b.checkouttime));
            console.log('yield c',yieldData.value);
            weekData.value = [...new Set(yis.data.map((item) => item.Week))]
                .sort((a, b) => Number(a) - Number(b))
                .slice(-10);

            const des = await apiGetoststackData(process, navpartRecord.value);
            stackData.value = des.data.filter((item) =>
                [...new Set(des.data.map((item) => item.Week))]
                    .sort((a, b) => Number(a) - Number(b))
                    .slice(-10)
                    .includes(item.Week));


        } catch (error) {
            console.log('aoi pn fetch error', error);
        }
    }

    return {
        getmountData,getaoistackData,changeRadioData,partData,weekData,yieldData,stackData,navpartRecord,radioItem,defectAry,defectSelect
    }
})