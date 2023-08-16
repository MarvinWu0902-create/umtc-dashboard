<template>
    <!-- <n-space vertical>
        <n-slider v-model:value="value" :step="1" :max="10" />
    </n-space> -->
    <!-- <div class="container">
        <div class="chart-layout" ref="chart"></div>
    </div> -->
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { NSpace, NSlider } from 'naive-ui'
// import * as d3 from 'd3';
import * as d3 from 'd3';

import * as XLSX from 'xlsx'
import { getapiexcelData } from '@/api/index.js'


const test = async () => {
    try {
        const res = await getapiexcelData();
        console.log('res', res);



        ////判斷對外批
        const outerAry = [];
        res.data[0].forEach((item, index) => {

            if (item !== null) {
                if (item.includes('SPC') || item.includes('對外')) {
                    outerAry.push(index);
                }
            }
        }
        );
        console.log('outerAry', outerAry);


        ////OST
        const ostHandler = () => {
            let oststartIndex = res.data
                .map((item) => item[2])
                .findIndex((item) => item === 'Defect');

            const pnObj = {};

            let lotAry = res.data[1];
            let pn = lotAry[2] === null
                ? lotAry[0]
                : lotAry[2];

            let weekAry = res.data[2];///周別
            let lotnameAry = res.data[3];///批號名稱

            let ostyieldAry = res.data[oststartIndex + 1];
            let ostbin07Ary = res.data[oststartIndex + 2];
            let ostbin08Ary = res.data[oststartIndex + 3];
            let ostbin10Ary = res.data[oststartIndex + 4];
            let ostbin21Ary = res.data[oststartIndex + 5];
            let ostbin22Ary = res.data[oststartIndex + 6];
            let ostbin23Ary = res.data[oststartIndex + 7];
            let ostbinusAry = res.data[oststartIndex + 8];
            let ostbinusnonAry = res.data[oststartIndex + 9];
            let ostbin32Ary = res.data[oststartIndex + 10];
            let ostbin33Ary = res.data[oststartIndex + 11];
            let ostbin91Ary = res.data[oststartIndex + 12];
            let ostbin92Ary = res.data[oststartIndex + 13];
            let ostbin99Ary = res.data[oststartIndex + 14];

            const ostAry = [];
            for (let i = 0; i < outerAry.length; i++) {
                const ostObj = {};
                const ostLot = lotAry[outerAry[i]];
                const ostLotname = lotnameAry[outerAry[i]]
                const ostWeek = weekAry[outerAry[i]];

                const ost_bin7 = ostbin07Ary[outerAry[i]];
                const ost_bin8 = ostbin08Ary[outerAry[i]];
                const ost_bin10 = ostbin10Ary[outerAry[i]];
                const ost_bin21 = ostbin21Ary[outerAry[i]];
                const ost_bin22 = ostbin22Ary[outerAry[i]];
                const ost_bin23 = ostbin23Ary[outerAry[i]];
                // const ost_bin31=ostmicroAry[i];
                const ost_bin31_aoi = ostbinusAry[outerAry[i]];
                const ost_bin31_clear = ostbinusnonAry[outerAry[i]];
                const ost_bin32 = ostbin32Ary[outerAry[i]];
                const ost_bin33 = ostbin33Ary[outerAry[i]];
                const ost_bin91 = ostbin91Ary[outerAry[i]];
                const ost_bin92 = ostbin92Ary[outerAry[i]];
                const ost_bin99 = ostbin99Ary[outerAry[i]];
                const ost_yield = ostyieldAry[outerAry[i]];

                ostObj.pn = pn;
                ostObj.lot = ostLot;
                ostObj.lotname = ostLotname;
                ostObj.week = ostWeek;
                ostObj.Bin07 = ost_bin7;
                ostObj.Bin08 = ost_bin8;
                ostObj.Bin10 = ost_bin10;
                ostObj.Bin21 = ost_bin21;
                ostObj.Bin22 = ost_bin22;
                ostObj.Bin23 = ost_bin23;
                ostObj.Bin31_aoi = ost_bin31_aoi;
                ostObj.Bin31_clear = ost_bin31_clear;
                ostObj.Bin32 = ost_bin32;
                ostObj.Bin33 = ost_bin33;
                ostObj.Bin91 = ost_bin91;
                ostObj.Bin92 = ost_bin92;
                ostObj.Bin99 = ost_bin99;
                ostObj.Yield = ost_yield;

                ostAry.push(ostObj);



            }
            pnObj.ost = ostAry;
            console.log('pnObj', pnObj);
        };

        const bumpHandler = () => {
            let bumpstartIndex = res.data.map((item) => {
                if (item.length > 3) {
                    return item[0]
                } else {
                    return ' '
                }
            }).findIndex((item) => item === 'Bump AOI');


            let bumpyieldIndex = res.data.map((item) => item[0]).findIndex((item) => item === 'Bump Yield');
            console.log('bumpstartIndex', bumpstartIndex);


            const pnObj = {};

            let lotAry = res.data[1];
            let pn = lotAry[2] === null
                ? lotAry[0]
                : lotAry[2];

            let weekAry = res.data[2];///周別
            let lotnameAry = res.data[3];///批號名稱

            let yieldAry = res.data[bumpyieldIndex];
            let missingbpAry = res.data[bumpstartIndex];
            let lvsbAry = res.data[bumpstartIndex + 1];
            let hvsbAry = res.data[bumpstartIndex + 2];
            let ctvAry = res.data[bumpstartIndex + 3];
            let othersAry = res.data[bumpstartIndex + 4];


            const bumpAry = [];

            for (let i = 0; i < outerAry.length; i++) {

                const bumpObj = {};
                bumpObj.pn = pn;
                bumpObj.lot = lotAry[outerAry[i]];
                bumpObj.lotname = lotnameAry[outerAry[i]]
                bumpObj.week = weekAry[outerAry[i]];

                bumpObj.Yield = yieldAry[outerAry[i]];
                bumpObj.CTV = ctvAry[outerAry[i]];
                bumpObj.HVSB = hvsbAry[outerAry[i]];
                bumpObj.LVSB = lvsbAry[outerAry[i]];
                bumpObj.MB = missingbpAry[outerAry[i]];
                bumpObj.Others = othersAry[outerAry[i]];

                bumpAry.push(bumpObj);
            }
            pnObj.bump = bumpAry;

            console.log('pnObj', pnObj);
        }

        // bumpHandler();

        const ccHandler = () => {
            let ccstartIndex = res.data.map((item) => item[0]).findIndex((item) => item === 'C.C.');
            let ccyieldIndex = red.data.map((item) => item[0]).findIndex((item) => item === 'C.C. Yield');
            if (ccstartIndex !== -1) {
                const pnObj = {};

                let lotAry = res.data[1];
                let pn = lotAry[2] === null
                    ? lotAry[0]
                    : lotAry[2];

                let weekAry = res.data[2];///周別
                let lotnameAry = res.data[3];///批號名稱

                let yieldAry = res.data[ccyieldIndex];
                let t44Ary = res.data[ccstartIndex + 8];
                let t15Ary = res.data[ccstartIndex + 16];

                const ccAry = [];

                for (let i = 0; i < outerAry.length; i++) {
                    const ccObj = {};
                    ccObj.pn = pn;
                    ccObj.lot = lotAry[outerAry[i]];
                    ccObj.lotname = lotnameAry[outerAry[i]];
                    ccObj.week = weekAry[outerAry[i]];

                    ccObj.Yield = yieldAry[outerAry[i]];
                    ccObj.T15 = t15Ary[outerAry[i]];
                    ccObj.T44 = t44Ary[outerAry[i]];

                    ccAry.push(ccObj);
                }
                pnObj.cc = ccAry;
                console.log('pnObj', pnObj);
            }
        }


        const fviHandler = () => {
            let defectList = ['A0', 'A1', 'A3', 'A5-3', 'A5',
                'A6',
                'A10', 'A11', 'B6', 'D0', 'D1', 'D8', 'D2', 'D5-1',
                'D5', 'D6', 'D14', 'G4', 'J0', 'J16'];

            let fviyieldIndex = res.data.map((item) => item[0]).findIndex((item) => item === 'FVI Yield');
            let yieldAry = res.data[fviyieldIndex];
            // let fvistartIndex = res.data.map((item) => item[0]).findIndex((item) => item === 'C.C.');
            let lotAry = res.data[1];
            let pn = lotAry[2] === null
                ? lotAry[0]
                : lotAry[2];

            let weekAry = res.data[2];///周別
            let lotnameAry = res.data[3];///批號名稱

            const fviAry = [];
            for (let i = 0; i < defectList.length; i++) {

                let defectIndex = res.data
                    .map((item) => item[3])
                    .findIndex((item) => item === `${defectList[i]}%`);


                let defectAry = res.data[defectIndex];

                if (i === 0) {
                    for (let j = 0; j < outerAry.length; j++) {////
                        let fviObj = {};
                        fviObj.pn = pn;
                        fviObj.lot = lotAry[outerAry[j]];
                        fviObj.lotname = lotnameAry[outerAry[j]];
                        fviObj.week = weekAry[outerAry[j]];
                        fviObj.Yield = yieldAry[outerAry[j]]
                        fviObj[defectList[i]] = defectAry[outerAry[j]];

                        fviAry.push(fviObj);
                    }
                } else {
                    for (let j = 0; j < outerAry.length; j++) {////
                        fviAry
                            .filter((item) => item.lot === lotAry[outerAry[j]])
                        [0][defectList[i]] = defectAry[outerAry[j]];

                        // console.log('tt',fviAry.filter((item)=>item.lot===lotAry[j]));
                    }
                }



            }////
            console.log('測試', fviAry);



        }
        fviHandler();
        // ostHandler();










    } catch (error) {
        console.log('err', error);
    }
};
// const handleFileChange=(e)=>{
//     const file=e.target.files[0];
//     if(file){
//         this.readFileContent(file);
//     }
// };
// const readFileContent=async(file)=>{
//     const fileReader=new FileReader();
//     fileReader.onload=(e)=>{
//         const data=new Uint8Array(e.target.result);

//         console.log('data',data);
//     };
//     fileReader.readAsArrayBuffer(file);
// }
onMounted(() => {
    test();
    // handleFileChange();
    // readFileContent('../assets/test.xlsx');
})




</script>

<style  scoped></style>