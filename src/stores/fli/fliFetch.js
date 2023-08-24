import { defineStore } from 'pinia'
import { ref,computed } from 'vue'
import { apiGetfliData} from '@/api/index.js'///../../api/aoi.js


export const UsefliFetch = defineStore('useflifetch', () => {

    const fli_params = ref({
        st: '',
        et: '',
    });
    const tableData=ref([]);
    const trendData=ref([]);


    const flifetchData = async () => {
        try {
            const res = await apiGetfliData(fli_params.value.st, fli_params.value.et);
            console.log('res.data', res.data);
            tableData.value=res.data[0];
            trendData.value=res.data[1];
        } catch (error) {
            console.log('err', error);
        }
    };




    return {
        flifetchData,fli_params,tableData,trendData
    }
});