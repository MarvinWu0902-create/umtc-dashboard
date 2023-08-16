import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
// import { apiGetaoiDefectData } from '@/api/index.js'

import { storeToRefs } from 'pinia'
import pinia from '../../index.js'

import { UsedefectFetch } from '../../../stores/aoi/aoidailydefect/defectFetch.js';
const usedefectfetch = UsedefectFetch(pinia);
const { defectFetchMacData } = usedefectfetch;
const { filterData,time_params } = storeToRefs(usedefectfetch);

export const UsedefectAnova = defineStore('useaoidailydefectanova', () => {

    ///filterData 去篩選資料
    ///
    const searchTime=computed(()=>{

    })


    return{

    }
})