import {ref,computed} from 'vue';
import {defineStore }from 'pinia'
import {apiGetWPGData} from '@/api/index.js'

export const UsewpgStore=defineStore('dailywpgdata',()=>{

    const wpg_params=ref({
        st:'',
        et:''
    });

    const tableData=ref([]);
    const deviceData=ref([]);
    const trendData=ref([]);

    const wpgfetchData=async()=>{
        try {
            const res=await apiGetWPGData(wpg_params.value.st,wpg_params.value.et);
            console.log('res',res.data);
            tableData.value = res.data[0];
            deviceData.value = res.data[1];
            trendData.value = res.data[2];
        } catch (error) {
            console.log('wpgfetch fail', error);
        }
    };


    const deviceCount=computed(()=>{
        const container={};
        console.log('deviceData',deviceData.value)
        deviceData.value.map((item)=>item.ProdClass)
            .forEach((item)=>{
                container[item]=[...new Set(tableData.value
                    .filter((row)=>row.ProdClass===item)
                    .map((row)=>row.PartNum))
                    ].length;
                    
        });
        return container
    });
    return {
        wpgfetchData,wpg_params,tableData,deviceData,deviceCount,trendData
    }
})