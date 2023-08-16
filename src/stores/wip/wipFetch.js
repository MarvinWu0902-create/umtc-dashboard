import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { apiGetWIPYield } from '@/api/index.js'

export const UsewipStore=defineStore('wipyield',()=>{
    const params=ref({
        pn:'',
        lot:'',
        proccode:'',
        proccode8:'',
        status:'CheckOut',
        st:'',
        et:''
    });
    const radioItem = ref('filter');

    const tableData=ref([]);
    const searchStatus=ref(false);

    const wipyieldFetch = async () => {
        try {
            searchStatus.value=true;
            console.log(params.value.st,params.value.et);
            console.log(params.value);
            const res=await apiGetWIPYield(
                params.value.pn,
                params.value.lot,
                params.value.proccode,
                params.value.proccode8,
                params.value.status,
                params.value.st,
                params.value.et,
                radioItem.value////新加進來
                );
            console.log('wipyield',res.data);
            
            ///判斷查詢結果
            res.data.length===0?searchStatus.value=false:tableData.value=res.data;
            ///
        } catch (error) {
            console.log('wipyield error',error)
        }
    }


    return {
        params,radioItem,searchStatus,tableData,wipyieldFetch
    }
})