import {ref,computed} from 'vue';
import {defineStore} from 'pinia'
import {apiGetOSTData} from '@/api/index.js'

export const UseostStore=defineStore('dailyostdata',()=>{
    const ost_params=ref({
        st:'',
        et:''
    });

    const tableData=ref([]);
    const deviceData=ref([]);
    const trendData=ref([]);

    const ostfetchData = async () => {
        try {
            const res = await apiGetOSTData(ost_params.value.st, ost_params.value.et);
            console.log('res',res.data);
            tableData.value = res.data[0];
            deviceData.value = res.data[1];
            trendData.value = res.data[2];
        } catch (error) {
            console.log('ostfetch fail', error);
        }
    }

    const deviceCount=computed(()=>{
        const container={};
        console.log('deviceData',deviceData.value)
        deviceData.value.map((item)=>item.ProdClass)
            .forEach((item)=>{
                container[item]=[...new Set(tableData.value
                    .filter((row)=>row.ProdClass===item)
                    .map((row)=>row.partno))
                    ].length;
                    
        });
        return container
    });



    return {
        ostfetchData,ost_params,tableData,deviceData,deviceCount,trendData
    }
})