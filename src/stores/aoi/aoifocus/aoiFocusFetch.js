import { defineStore } from 'pinia'
import { ref,computed, watch } from 'vue'
import {apiGetaoiFocusData,apiGetaoifocusPNData} from '@/api/index.js'

export const UseaoiFocus=defineStore('useaoifocus',()=>{

    const aoi_params=ref({////傳進  focusTime  n-date-picker v-model 綁定
        st:'',
        et:''
    });
    const tableData=ref([]);
    const aostrendData=ref([]);

    const partBtn=ref([]);

    const aoifocusfetchData=async()=>{
        try {
            const res=await apiGetaoiFocusData(aoi_params.value.st,aoi_params.value.et);
            //// 
            const dbpn=await apiGetaoifocusPNData();
            ////
            console.log('rest',res);
            console.log('dbpn',dbpn);

            partBtn.value= dbpn.data[1].map((item)=>item.PartNum);

            tableData.value=res.data[0];
            aostrendData.value=res.data[1];
            console.log('tableData.value',tableData.value);
        } catch (error) {
            console.log('err',error);
        }
    };
    // const partBtn=computed(()=>{
    //     return [...new Set(tableData.value.map((item)=>item.PartNo))]
    // });///給focusPick用
    // const partBtn=ref(['6111C01','3273070']);///要調整成抓DB
    

    const partCount=computed(()=>{///預設會先跑一次
        const countBox={};
        partBtn.value.forEach((eachpart)=>{
            countBox[eachpart]=tableData.value.filter((item)=>item.PartNo===eachpart).length
        })
        return countBox
    });

    const testCount=computed(()=>{///預設會先跑一次
        const countBox=[];
        partBtn.value.forEach((eachpart)=>{
            countBox.push({
                pn:eachpart,
                count:tableData.value.filter((item)=>item.PartNo===eachpart).length,
                yellow:tableData.value.filter((item)=>item.PartNo===eachpart&&Number(item.Triger)-Number(item.Yield)<=0&&Number(item.Target)-Number(item.Yield)>0).length,
                red:tableData.value.filter((item)=>item.PartNo===eachpart&&Number(item.Triger)-Number(item.Yield)>0).length
            })
        })
        return countBox
    });

    watch(partCount,(newval,oldval)=>{
        console.log('partCount',newval,oldval)
    })



    return {
        aoi_params,tableData,aostrendData,partBtn,partCount,testCount,aoifocusfetchData
    }

})