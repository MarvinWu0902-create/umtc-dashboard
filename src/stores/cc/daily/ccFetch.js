import {ref,computed} from 'vue';
import {defineStore }from 'pinia'
import {apiGetCCData} from '@/api/index.js'

export const UseccStore=defineStore('dailyccdata',()=>{

    const cc_params=ref({
        st:'',
        et:''
    });

    const tableData=ref([]);
    const deviceData=ref([]);
    const trendData=ref([]);
    const fetchStauts=ref(false);

    const ccfetchData=async()=>{
        try {
            const res=await apiGetCCData(cc_params.value.st,cc_params.value.et);
            console.log('res',res.data);
            tableData.value = res.data[0];
            deviceData.value = res.data[1];
            trendData.value = res.data[2];

            fetchStauts.value=true;
        } catch (error) {
            console.log('ccfetch fail', error);
        }
    };


    const deviceCount=computed(()=>{
        const container={};
        console.log('deviceData',deviceData.value)
        deviceData.value.map((item)=>item.type)
            .forEach((item)=>{
                container[item]=[...new Set(tableData.value
                    .filter((row)=>row.type===item)
                    .map((row)=>row.partno))
                    ].length;
                    
        });
        return container
    });


    return {
        ccfetchData,cc_params,tableData,deviceData,deviceCount,trendData,fetchStauts
    }
})