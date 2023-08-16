import { ref,computed,watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js';
import { apiGetVIDefectData } from '../../../api/index.js';
import Highcharts from 'highcharts';

import {UseTableStore} from './viTableSet.js';
const usetablestore=UseTableStore(pinia);
const {partRecord}=storeToRefs(usetablestore);

export const UseDefectStore = defineStore('videfect', () => {

    const defectRawdata = ref([]);
    const passDefect=ref('');

    const getDefectData=async(process,pn,defect)=>{
        try {
            const res=await apiGetVIDefectData(process,pn,defect);
            defectRawdata.value=res.data;
            passDefect.value=defect;
            console.log('defectTrend',res.data);
        } catch (error) {
            console.log('defectTrend err',error);
        }
    };

    watch(defectRawdata,(newval,oldval)=>{
        console.log('defectRawdata',newval,oldval);
    })
    const defectSeries=computed(()=>{
        const container = [];
        const machineAry=[...new Set(defectRawdata.value.map((item)=>item.machine))];


        machineAry.forEach((mac,idx)=>{
            const passObj={};
                passObj.type='line';
                passObj.lineColor=Highcharts.getOptions().colors[idx];
                passObj.name=mac;
                passObj.defect=passDefect.value;
                passObj.marker={};
                passObj.marker.lineWidth = 2;
                passObj.marker.lineColor = Highcharts.getOptions().colors[idx];
                passObj.marker.fillColor = 'white';
                passObj.marker.symbol='circle';

                const eachmacAry=defectRawdata.value
                    .map((item)=>item.machine===mac?Number(item.Rate):null);
                    ///對應到機台別有值，沒有則null
                    ///[null,1,null,2,3,1,4,6]
                passObj.data=eachmacAry
                    .slice(eachmacAry.length-100,eachmacAry.length+1);
                    ///data取前100個
                passObj.time=defectRawdata.value
                    .map((item)=>item.Processtime)
                    .slice(eachmacAry.length-100,eachmacAry.length+1);
                    ///時間取前100個

                passObj.lotnumber=defectRawdata.value
                    .map((item)=>item.LotNum)
                    .slice(eachmacAry.length-100,eachmacAry.length+1);
                    ////批號取前100個
                container.push(passObj);
        });

        console.log('container',container);
        return container
    });

    return {
        getDefectData,defectRawdata,defectSeries
    }
})