<template>
    <div>
        <table>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>PN</th>
                    <th>Lot</th>
                    <th>Checkout</th>
                    <th>Units</th>
                    <th>Yield</th>
                    <th>Bin7</th>
                    <th>Bin8</th>
                    <th>Bin10</th>
                    <th>Bin21</th>
                    <th>Bin22</th>
                    <th>Bin23</th>
                    <th>LtL</th>
                    <th>AOI</th>
                    <th>Bin32</th>
                    <th>Bin33</th>
                    <th>Bin91</th>
                    <th>Bin92</th>
                    <th>Bin99</th>
                    <th>Remark</th>
                </tr>
            </thead>
            <tbody v-if="slicefilterAry.length>0">
                <tr v-for="eachData of slicefilterAry">
                    <td>{{eachData.lot_type}}</td>
                    <td>{{eachData.partno}}</td>
                    <td>{{eachData.lotno}}</td>
                    <td>{{eachData.checkouttime}}</td>
                    <td>{{eachData.units}}</td>
                    <td>{{(eachData.Yield*100).toFixed(1)}}%</td>
                    <td><a href="#"  @click="getmappingData(eachData.lotno,'Bin07')"> 
                        {{(eachData.Bin07*100).toFixed(2)}}%</a>
                    </td>

                    <!-- <a :class="{ defect: eachData.C_TOP_1 !== ' ' }" href="#"
                            @click="aoifetchtrendData(eachData.C_TOP_1, eachData.PartNo, eachData.Layer, eachData.LotNum, 'ctop1')">
                            {{ eachData.C_TOP_1 }}
                        </a> -->


                        <td><a href="#" @click="getmappingData(eachData.lotno,'Bin08')"> 
                        {{(eachData.Bin08*100).toFixed(2)}}%</a>
                    </td>
                    <td><a href="#" @click="getmappingData(eachData.lotno,'Bin10')"> 
                        {{(eachData.Bin10*100).toFixed(2)}}%</a>
                    </td>
                    <td><a href="#" @click="getmappingData(eachData.lotno,'Bin21')"> 
                        {{(eachData.Bin21*100).toFixed(2)}}%</a>
                    </td>
                    <td><a href="#" @click="getmappingData(eachData.lotno,'Bin22')"> 
                        {{(eachData.Bin22*100).toFixed(2)}}%</a>
                    </td>
                    <td><a href="#" @click="getmappingData(eachData.lotno,'Bin23')"> 
                        {{(eachData.Bin23*100).toFixed(2)}}%</a>
                    </td>
                    <td><a href="#" @click="getmappingData(eachData.lotno,'Bin31_clear')"> 
                        {{(eachData.Bin31_clear*100).toFixed(2)}}%</a>
                    </td>
                    <td><a href="#" @click="getmappingData(eachData.lotno,'Bin31_aoi')"> 
                        {{(eachData.Bin31_aoi*100).toFixed(2)}}%</a>
                    </td>
                    <td><a href="#" @click="getmappingData(eachData.lotno,'Bin32')"> 
                        {{(eachData.Bin32*100).toFixed(2)}}%</a>
                    </td>
                    <td><a href="#" @click="getmappingData(eachData.lotno,'Bin33')"> 
                        {{(eachData.Bin33*100).toFixed(2)}}%</a>
                    </td>
                    <td><a href="#" @click="getmappingData(eachData.lotno,'Bin91')"> 
                        {{(eachData.Bin91*100).toFixed(2)}}%</a>
                    </td>
                    <td><a href="#" @click="getmappingData(eachData.lotno,'Bin92')"> 
                        {{(eachData.Bin92*100).toFixed(2)}}%</a>
                    </td>
                    <td><a href="#" @click="getmappingData(eachData.lotno,'Bin99')"> 
                        {{(eachData.Bin99*100).toFixed(2)}}%</a>
                    </td>
                    <td>
                        <i class="fa-solid fa-pencil pointer" @click="modalOpen(eachData)"></i>
                        {{ eachData.Remark }}
                    </td>
                </tr>
                <tr><td colspan="20">產出<strong>{{filterTotaltableData.length}}</strong>批，Trigger:<strong>{{tableInfo.tri}}</strong>批，平均良率:<strong>{{(tableInfo.avg*100).toFixed(1)}}%</strong></td>
                </tr>
            </tbody>
            <tbody v-else-if="slicefilterAry.length===0&&filterTotaltableData.length!==0">
                <tr><td colspan="20">產出<strong>{{filterTotaltableData.length}}</strong>批，平均良率:<strong>{{(tableInfo.avg*100).toFixed(1)}}%</strong></td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr><td colspan="20">沒有資料</td>
                </tr>
            </tbody>
        </table>
       
        <transition name="fade">
            <div class='modal' v-if="showModal">
                <button class="close-btn" @click="modalClose">&times;</button>
                <div class="modalcontent">
                    <div class="textblock">
                        <textarea name="text" id="id1" v-model="textareaValue" placeholder="請輸入備註文字..."></textarea>
                        <button @click="sendData">上傳</button>
                    </div>
                </div>
            </div>
        </transition>
        <!-- ostmapHC-->

        <!--  -->
    </div>
    <div class="canvas" v-if="showCanvas">
        <div><p class="lot-name">{{ lotName }}</p></div>
        <button class="close-btn" @click="canvasClose">&times;</button>
        <div class="inner-loyout">
            <!-- HeatMap -->
            <ostmapHC 

            :bin="binName" 
            :xAxis="mapxAxisAry" 
            :yAxis="mapyAxisAry" 
            :series="seriesAry" 
            v-if="seriesAry.length>0"/>
            <!-- Pareto -->
            <ostPareto
            :title="paretoTitle"
            :xAxisDefect="paretoxAxisAry"
            :yAxisCount="paretocountyAxisAry"
            :yAxisPercent="accAry"
            v-if="seriesAry.length>0&&binName!=='Bin31_clear'"
            />
        </div>
    </div>
</template>

<script setup>
import {ref, watch} from 'vue';
import {storeToRefs}from 'pinia'
import pinia from'../../../stores/index.js';


import ostmapHC from './ostmapHC.vue';
import ostPareto from './ostPareto.vue';
import {UseostStore}from '../../../stores/ost/daily/ostFetch.js';
import {UseTableStore} from '../../../stores/ost/daily/ostTableSet.js';

import {apiPostOSTData,apiGetOSTmappingData} from '../../../api/index.js';

const useoststore=UseostStore(pinia);
const usetablestore=UseTableStore(pinia);

const {tableData,deviceData,trendData}=storeToRefs(useoststore);
const {filtertableData,filterTotaltableData,slicefilterAry,tableInfo} =storeToRefs(usetablestore);



const showModal=ref(false);
const showCanvas=ref(false);

const textareaValue=ref('');
const textareaLot = ref('');

const mapxAxisAry=ref([]);
const mapyAxisAry=ref([]);
const seriesAry=ref([]);

const lotName=ref('');
const binName=ref('');


const paretoxAxisAry=ref([]);
const paretocountyAxisAry=ref([]);
const accAry=ref([]);

const paretoTitle=ref('');


const modalOpen = (item) => {
    showModal.value = true;
    textareaLot.value = item.lotno///用批號去比對
};
const modalClose = () => {
    showModal.value = false;
    textareaValue.value = '';
};

const sendData = async () => {
    const postData = {
        data: textareaValue.value,
        type: 'ostdaily',
        lot: textareaLot.value
    };
    try {
        await apiPostOSTData(postData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        alert('上傳成功!');

        tableData.value.find((item) => item.lotno === postData.lot)///先用TableData
            .Remark = postData.data;
        modalClose();

    } catch (error) {
        console.log('err', error);
    }
};

const getmappingData=async(lot,defect)=>{
    try {
        showCanvas.value = true;
        lotName.value=lot;
        binName.value=defect;
        const res=await apiGetOSTmappingData(lot,defect);
        console.log('res',res.data);

        /////
        const regex=/\{(.*?)\}/g;
        const pareto =res.data.map((item)=>item.panelInfo);
        const paretoAry1=res.data
            .map((item)=>item.panelInfo.match(regex))
            .filter((item)=>item!==null);
            
            console.log('pareto',pareto,paretoAry1);


        const container=[];
        paretoAry1.forEach(element => {
            for(let i=0;i<element.length;i++){
                container.push(element[i].substring(1,element[i].length-1));
            };
        });
        const count={};
        container.forEach(el=>{
            
            if(count[el]>=0){
                count[el]+=1;
            }else{
                count[el]=1;
            }
        });
        
        console.log('container',container);
        console.log('count',count);
        const defectAry=Object.entries(count).sort((a,b)=>b[1]-a[1]);

        const paretoAry=defectAry.filter((item)=>defect==='Bin99'
            ?item[0].substring(item[0].length-2,item[0].length)!=='B6'&&item[0].substring(0,4)==='0099'
            :item[0].substring(item[0].length-2,item[0].length)==='B6'&&item[0].substring(0,4)!=='0099'&&('Bin'+item[0].substring(2,8)===defect||'Bin'+item[0].substring(2,4)===defect));//0031_aoi Bin31_aoi 0032 Bin32
            paretoTitle.value=defect==='Bin99'?'Bin99 & AOI':`${defect} & AOI`;
        const nameAry=paretoAry.map((item)=>item[0]);
        const countAry=paretoAry.map((item)=>item[1]);

        // ['0032::-Outer:C-A61-B6', 4]
        // ['0032::3FB:C-A61-B6', 1]



        const percentAry=countAry.map((item)=>(item/countAry.reduce((acc,cur)=>acc+cur,0)));


        let containerAry=[];
        let sum=0;
        for(let i=0;i<percentAry.length;i++){
            sum+=percentAry[i];
            containerAry.push(sum);
        };

        ///rawPercent

        const rawIndex=containerAry.findIndex((item)=>item>=0.8);

        ///得到index處理count累積/x軸合併
        
        accAry.value=containerAry.length!==1&&containerAry.length-1!==rawIndex
            ?containerAry.slice(0,rawIndex+1)
                .concat(1)//哪裡到0.8就直接補1
            :containerAry.slice(0,rawIndex+1);///[1]  [0.33,0,67,1] containerAry.length 3 rawIndex2
        ///countAry.length-rawIndex===2  [0,7,0.9,1]->[0,7,0.9,1]
        paretocountyAxisAry.value=countAry.length-rawIndex<=2||countAry.length===1
            ?countAry.slice(0,countAry.length)
            :countAry.slice(0,rawIndex+1)
                .concat(countAry.slice(rawIndex+1).reduce((acc,cur)=>acc+cur,0));

        paretoxAxisAry.value=nameAry.length-rawIndex<=2||nameAry.length===1
            ?nameAry.slice(0,nameAry.length)
            :nameAry.slice(0,rawIndex+1)
                .concat(`${nameAry.length-(rawIndex+1)} Others`);

        //// [0.8,0.85,0.9,1]->[0.8,]v 第一個後就合併
        //// [0.7,0.8,0.9,1]->[0.7,0.8,1]v 中間合併
        //// [0,7,0.9,1]->[0,7,0.9,1] 剩一個不合併 1 3
        ////[0.9,1]->[0.9,1] 
        ///[0.33,0,67,1]->rawIndex 2   now [0.33,0.67,1,1]
        ///結論 countAry.length-rawIndex=1
        /// [1] containerAry.length===1 ->不加1
        console.log('test',paretoAry,containerAry,accAry.value,paretocountyAxisAry.value,paretoxAxisAry.value);






        const xAxisAry=[...new Set(res.data.map((item) => Number(item.UnitCode.substring(0, 2))-1 ))];
        // const insertXloc=Math.floor(xAxisAry.length/2);

        // mapxAxisAry.value=xAxisAry.slice(0,insertXloc).concat(xAxisAry.slice(insertXloc));
        mapxAxisAry.value=Array.from({length:xAxisAry[xAxisAry.length-1]+1},(_,index)=>index);
    

        // mapyAxisAry.value = [...new Set(res.data.map((item) => Number(item.UnitCode.substring(2, 4))-1 ))];
        const yAxisAry=[...new Set(res.data.map((item) => Number(item.UnitCode.substring(2, 4))-1 ))];
        // const insertYloc=Math.floor(yAxisAry.length/2);
        // mapyAxisAry.value=yAxisAry.slice(0,insertYloc).concat(yAxisAry.slice(insertYloc));

        // mapyAxisAry.value=Array.from({length:yAxisAry[yAxisAry.length-1]+1},(_,index)=>index);
        // seriesAry.value = res.data.map((item) => [
        //     Number(item.UnitCode.substring(0, 2)) ,
        //     Number(item.UnitCode.substring(2, 4)) ,
        //     Number(Number(item[defect]).toFixed(4))
        // ]);

        ////test
        mapyAxisAry.value=Array.from({length:yAxisAry[yAxisAry.length-1]+1},(_,index)=>index);
        const existserAry = res.data.map((item) => [
            Number(item.UnitCode.substring(0, 2)) ,
            Number(item.UnitCode.substring(2, 4)) ,
            Number(Number(item[defect]).toFixed(4))
        ]);

        console.log('existserAry',existserAry);
        let sercontainer=[];
        let sercount=0;
        for(let x=mapxAxisAry.value[1];x<=mapxAxisAry.value.length;x++){
            for(let y=mapyAxisAry.value[1];y<=mapyAxisAry.value.length;y++){
                if(x!==existserAry[sercount][0]||y!==existserAry[sercount][1]){
                    sercontainer.push([x,y,null]);
                }else{
                    sercontainer.push([x,y,existserAry[sercount][2]]);
                    sercount++;
                }
            };
        };
        seriesAry.value=sercontainer;
        console.log('sercontainer',sercontainer);


        console.log(mapxAxisAry.value,mapyAxisAry.value,seriesAry.value);
        
    } catch (error) {
        console.log('map err',error);
    }
};

const canvasClose = () => {
    showCanvas.value = false;
    seriesAry.value = [];
};

// const createMap=(data,defect)=>{
//     const mapxAxisAry=[...new Set(data.map((item)=>Number(item.UnitCode.substring(0,2))-1))];
//     const mapyAxisAry=[...new Set(data.map((item)=>Number(item.UnitCode.substring(2,4))-1))];
//     const seriesAry = data.map((item) => [
//         Number(item.UnitCode.substring(0, 2)) - 1,
//         Number(item.UnitCode.substring(2, 4)) - 1,
//         Number(Number(item[defect]).toFixed(4))
//     ]);
//     console.log('t',mapxAxisAry,mapyAxisAry,seriesAry);
// };

</script>

<style  scoped>
table {
    border-collapse: collapse;
    width: 100%;
    font-size: 12px;
}

th,
td {
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid #ddd;
}

tr:hover {
    transition: 0.5s;
    background-color: antiquewhite;
}

th {
    text-align: center;
    background-color: #f2f2f2;
    color: #333;
    font-weight: bold;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
    transition-delay: 0.2s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
.modal {
    width: 40%;
    height: 40%;
    /*單純Remark */
    display: flex;
    justify-content: center;
    align-items: center;

    border: 1px solid rgb(168, 168, 168);
    border-radius: 15px;
    box-shadow: 2px 2px 3px 1px rgb(210, 210, 210);
    background-color: rgb(255, 255, 255);

    position: fixed;
    top: 50%;
    left: 55%;
    transform: translate(-50%, -50%);
    z-index: 999;

    transition: all 1s ease;
    overflow-y: auto;
}
.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.5em;
    background-color: transparent;
    border: none;
    cursor: pointer;
}
.close-btn:hover {
    color: red;
}
.modalcontent {
    width: 80%;
    height: 90%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.textblock {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
}


#id1 {
    width: 80%;
    height: 50%;
    margin-left: 12%;
}

.textblock>button {
    width: 50px;
    height: 30px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    background-color: #ddd;
    border-radius: 5px;
    border: 0px;
    margin-left: 5%;
}

.textblock>button:hover {
    color: #ffffff;
    background-color: rgb(204, 204, 204);
}

.canvas {
    width: 90%;
    height: 90%;
    /*單純Remark */
    display: flex;
    flex-wrap: wrap;
    /* justify-content: center; */
    /* align-items: center;  */

    border: 1px solid rgb(168, 168, 168);
    border-radius: 15px;
    box-shadow: 2px 2px 3px 1px rgb(210, 210, 210);
    background-color: rgb(255, 255, 255);

    position: fixed;
    top: 100px;
    top: 50%;
    left: 53%;
    transform: translate(-50%, -50%);
    z-index: 999;

    transition: all 1s ease;
    overflow-y: auto;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.5em;
    background-color: transparent;
    border: none;
    cursor: pointer;
}

/* .innerCanvas {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin: 30px
}

.innerCanvas>div {
    width: 50%;
} */


.inner-loyout{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: auto;
}


.lot-name{
    margin: 10px 10px ;
    font-size: 24px;
    font-weight: 700;
}
</style>