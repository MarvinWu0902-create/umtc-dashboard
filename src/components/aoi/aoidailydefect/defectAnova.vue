<template>

        <table v-if="fdata.data.length>0">
            <thead>
                <th colspan="6">ANOVA</th>
                <tr>
                    <th> </th>
                    <th>DF</th>
                    <th>Sum of Square</th>
                    <th>Mean Square</th>
                    <th>F-ratio</th>
                    <th>Prob-F</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>M</th>
                    <td>{{ dfG }}</td>
                    <td>{{ SSG.toFixed(8)}}</td>
                    <td>{{ MSG.toFixed(6) }}</td>
                    <td>{{ Fratio.toFixed(2) }}</td>
                    <td :class="{pfont:pValue.toFixed(4)<=0.05}">{{ pValue.toFixed(4) }}</td>
                </tr>
                <tr>
                    <th>Error</th>
                    <td>{{ dfW }}</td>
                    <td>{{ SSW.toFixed(8) }}</td>
                    <td>{{ MSW.toFixed(6) }}</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <th>C.Total</th>
                    <td>{{ dfG+dfW }}</td>
                    <td>{{ (SSG+SSW).toFixed(8) }}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
        <!-- pValue.toFixed(4) -->
</template>

<script setup>
import { nextTick, ref, watch, computed, watchEffect } from 'vue';
import { storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js'
import jstat from 'jstat';

import { UsedefectHC } from '../../../stores/aoi/aoidailydefect/defectHCSet.js';


const usedefecthc = UsedefectHC(pinia);
const { anovaAry } = storeToRefs(usedefecthc);

const props = defineProps({
    defect: {
        type: String,
        default: ''
    },
    process: {
        type: String,
        default: ''
    },
    machine: {
        type: String,
        default: ''
    },
    anovaData:{
        type:Array
    }
});


////測試


///需要props.process
const fdata = computed(() => {

    
    if (props.defect === '' && props.process === '') {

        return props.anovaData[0]
    } else if (props.defect === '' && props.process !== '') {
        return props.anovaData
            .filter((item) => item.process === props.process)[0]

    } else {
        return props.anovaData
            .filter((item) => item.process === props.process
                && item.defect === props.defect)[0]
    }
});


const dfG = computed(() => {
    return fdata.value.data.length-1;
});

const dfW = computed(() => {
    
    let sum = 0;

    fdata.value.data.forEach((item) => {
        sum += item.data.len
    });
    console.log('sum',sum);
    console.log('dfG.value',dfG.value);
    return sum - dfG.value - 1
});


const groupMean = computed(() => {
    let groupAvg = 0;
    let length=0;
    fdata.value.data.forEach((item) => {
        groupAvg += item.data.avg*item.data.len;
        length+=item.data.len;
    });

    return groupAvg /length
});

const SSG = computed(() => {
    let sum = 0;
    fdata.value.data.forEach((item) => {
        sum += item.data.len * ((item.data.avg - groupMean.value) ** 2);
    });
    return sum
});

const SSW = computed(() => {
    let sum=0;
    
    fdata.value.data.forEach((item) => {
        console.log('item',item);
        sum+=item.data.raw
            .map((eachraw) => (eachraw - item.data.avg) ** 2)
            .reduce((acc, cur) => acc + cur)
    });

    console.log('sum',sum);
    return sum
})

const MSG = computed(() => {
    return SSG.value / dfG.value
});
const MSW = computed(() => {
    return SSW.value / dfW.value
});

const Fratio=computed(()=>{

    return MSG.value/MSW.value
});

const pValue=computed(()=>{
    return 1-jstat.centralF.cdf(Fratio.value,dfG.value,dfW.value)
});



</script>

<style  scoped>
table {
    margin: 10px auto;
    border-collapse: collapse;
    width: 75%;
    font-size: 12px;
}

th,
td {
    /* padding: 8px; */
    text-align: center;
    border: 1px solid rgb(48 48 48 / 54%);
    font-weight: 700;
}

tr:hover {
    transition: 0.5s;
    background-color: antiquewhite;
}

th {
    text-align: center;
    background-color: #f2f2f2;
    color: #000;
    font-weight: bold;
}
.pfont{
    color: red;
    font-weight: 700;
}
</style>