import { ref, computed } from 'vue';
import { defineStore } from 'pinia'
import { apiGetBumpData } from '@/api/index.js'

export const UsebumpStore = defineStore('dailybumpdata', () => {
    const bump_params = ref({
        st: '',
        et: ''
    });
    const tableData = ref([]);
    const deviceData = ref([]);
    const trendData = ref([]);
    const fetchStauts=ref(false);
    

    const bumpfetchData = async () => {
        try {
            const res = await apiGetBumpData(bump_params.value.st, bump_params.value.et);
            console.log('res', res.data);
            tableData.value = res.data[0];
           
            tableData.value.forEach((item) => {
                for (let i = 0; i < res.data[3].length; i++) {
                    if (res.data[3][i].PN === item.partno) {
                        item.ULMark94V = res.data[3][i].ULMark94V;
                        break;
                    }
                }
            });

            deviceData.value = res.data[1];
            trendData.value = res.data[2];

            fetchStauts.value=true
        } catch (error) {
            console.log('ostfetch fail', error);
        }
    };

    const deviceCount = computed(() => {
        const container = {};
        console.log('deviceData', deviceData.value)
        deviceData.value.map((item) => item.type)
            .forEach((item) => {
                container[item] = [...new Set(tableData.value
                    .filter((row) => row.type === item)
                    .map((row) => row.partno))
                ].length;

            });
        return container
    });




    return {
        bumpfetchData, bump_params, tableData, deviceData, deviceCount, trendData,fetchStauts
    }
})