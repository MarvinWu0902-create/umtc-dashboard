import { defineStore } from 'pinia'
import { ref,computed } from 'vue'
import { apiGetaoiData} from '@/api/index.js'///../../api/aoi.js


export const UseaoiFetch = defineStore('useaoifetch', () => {

    const aoi_params = ref({
        st: '',
        et: '',
    });
    const tableData=ref([]);


    const aoifetchData = async () => {
        try {
            const res = await apiGetaoiData(aoi_params.value.st, aoi_params.value.et);
            console.log('res.data', res.data);
            tableData.value=res.data;
        } catch (error) {
            console.log('err', error);
        }
    };


    const filterTable = computed(() => {
        return tableData.value.filter((item) => item.Bef_Yield - item.triger < 0);
    })

    return {
        aoifetchData,aoi_params,tableData,filterTable
    }
});