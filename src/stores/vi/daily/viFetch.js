import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { apiGetVIData,apiGetNCN } from '@/api/index.js'

export const UseviStore = defineStore('dailyvidata', () => {
    const vi_params = ref({
        st: '',
        et: ''
    });

    const tableData = ref([]);
    const deviceData = ref([]);
    const trendData = ref([]);

    const ncnData=ref([]);


    const vifetchData = async () => {
        try {
            const res = await apiGetVIData(vi_params.value.st, vi_params.value.et);
            console.log('vi res', res.data);
            tableData.value = res.data[0];
            deviceData.value = res.data[1];
            trendData.value = res.data[2];
        } catch (error) {
            console.log('vifetch fail', error);
        }
    };

    const vifetchNCN=async(lot)=>{
        try {
            const res=await apiGetNCN(lot);
            ncnData.value=res.data;
        } catch (error) {
            console.log('vifetch ncn fail', error);
        }
    }

    

    const deviceCount = computed(() => {
        const container = {};
        console.log('deviceData', deviceData.value)
        deviceData.value.map((item) => item.ProdClass)
            .forEach((item) => {
                container[item] = [...new Set(tableData.value
                    .filter((row) => row.ProdClass === item)
                    .map((row) => row.PartNo))
                ].length;

            });
        return container
    });
    watch(deviceCount,(newval,oldval)=>{
        console.log('deviceCount',newval,oldval);
    })
    return {
        vifetchData,vifetchNCN,ncnData, vi_params, tableData, deviceData, deviceCount, trendData
    }
})