import axios from 'axios'
import { defineStore } from 'pinia'
import { ref} from 'vue'
import {apiGetOAYData}  from '@/api/index.js'

export const UseIndexFetch = defineStore('useindexfetch', () => {
    const Indexdata = ref({});
    const filterData = ref([]);
    const productData = ref([]);

    const daysumData=ref([]);
    const daydetailData=ref([]);
    const ncnData=ref([]);
    const rejectData=ref([]);
    const divData=ref([]);

    const partList = ref([]);
    const errmsg = ref('');
    const Index_params = ref({
        product: ''
    });///綁定IndexView.vue Select List V-model
  
    const IndexfetchData = async () => {
        try {

            // const res = await axios.get(`http://wymana1649:88/api/oay/index.php?device=${Index_params.value.product}`);///我的是88  ///http://wymana1649:88
            const res=await apiGetOAYData(Index_params.value.product);

            Indexdata.value = res.data[0];
            daysumData.value=res.data[1];
            daydetailData.value=res.data[2];

            ncnData.value=res.data[3];
            rejectData.value=res.data[4];
            divData.value=res.data[5];

            // // console.log('daysum',daysumData.value);
            // // console.log('daydetail',daydetailData.value);
            // console.log('ncn',ncnData.value);
            // console.log('reject',rejectData.value);
            // console.log('div',divData.value);
            // filterData.value = Indexdata.value.filter((item) => item.ProdClass === 'Client')///一開始渲染Client
            filterData.value = Indexdata.value;//
            productData.value = filterData.value;///暫存data，給IndexByn的partBtn用
            partList.value = [...new Set(productData.value.map((item) => item.partnum)),'All'];
        } catch (error) {
            errmsg.value = error
        }

    }
    return {
        Indexdata, errmsg, Index_params,daysumData,daydetailData,ncnData,rejectData,divData,filterData, productData, partList, IndexfetchData
    }
});
///IndexfetchData
///&device=${Index_params.value.product}`);
// ?start=${Index_params.value.stime}
//             &end=${Index_params.value.etime}

//http://localhost:88/AOISummarydata.php
// ?start=${Index_params.value.stime}&
//             end=${Index_params.value.etime}&