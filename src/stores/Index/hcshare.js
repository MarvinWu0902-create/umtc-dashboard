import {ref} from 'vue'
import {defineStore} from 'pinia'


export const UseHcStore=defineStore('hc',()=>{
    const chartContainer=ref(null); 

    return {
        chartContainer
    }
});