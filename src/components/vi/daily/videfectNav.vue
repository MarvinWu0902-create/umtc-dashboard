<template>
    <div>
        <nav>
            <ul>
                <li v-for="item of itemList">
                    <a :class="{ active: item === itemSelect && selectStatus }" 
                        @click="itemSelectHandler(item)"
                        href="JavaScript:void(0)">
                        {{ item.defect }} By {{ item.process }}
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import pinia from '../../../stores/index.js';
import { UseTrendStore } from '../../../stores/vi/daily/viTrendSet.js';
const usetrendstore = UseTrendStore(pinia);

const { gettrendData } = usetrendstore;
const { partnumber, process, defect, defecttrendData, seriesAry, selectStatus,actionValue,colorValue,insertLoc,insertStatus,plotAry,acitonOption,actionmodelValue,templotAry,itemSelect } = storeToRefs(usetrendstore);


const props = defineProps(['partnumber']);

// const itemSelect = ref('');傳到acction DB 要用


const itemSelectHandler = (item) => {
    if (itemSelect.value !== item || selectStatus.value === false) {
        ///非重複點擊或是沒圖
        partnumber.value = props.partnumber;////將目前料號傳進
        defect.value = item.defect;///參考下面itemList
        process.value = item.process;///參考下面itemList

        itemSelect.value = item;///點擊項目，觸發class active
        selectStatus.value = true;////為有點選狀態
        ///

        actionValue.value='';
        colorValue.value='rgba(255, 255, 255, 1)';
        insertLoc.value=0;
        plotAry.value=[];

        acitonOption.value=[];
        actionmodelValue.value=[];
        templotAry.value=[];
        
    
        insertStatus.value=false;


        gettrendData();

    } else {//重複點擊
        selectStatus.value = false;////v-if 畫布消失
    }
};


const itemList = ref([
    { process: 'SMK1VDF1', defect: 'A1,A3' },
    { process: 'SMK1SEP1', defect: 'A1,A3' },
    { process: 'EPG1ENP1', defect: 'A5-3,D5-1' },
    { process: 'EPG1PRE1', defect: 'A0-E' },
    { process: 'PSP2CCM1', defect: 'D6-S,D14' },
    { process: 'EPG1ENP1', defect: 'D8' },
    { process: 'PSP1UBL1', defect: 'D14' },
    { process: 'PSP1UBL1', defect: 'J16' }
]);



</script>

<style  scoped>
ul {
    width: 1200px;
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    margin: auto;

}

li {

    list-style: none;
    border-top: 1px solid transparent;
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
    transition: border-color 0.3s;
}

li:hover {
    border-top: 1px solid rgb(213, 213, 213);
    border-left: 1px solid rgb(213, 213, 213);
    border-right: 1px solid rgb(213, 213, 213);
    border-radius: 3px 3px 0 0
}

a {
    color: #d1d1d1;
    text-decoration: none;
    display: inline-block;
    /* height: 100%; */
    padding: 10px 10px;
}

a:hover {
    color: #007bff;
}

.active {
    color: #007bff;

    border-top: 1px solid rgb(213, 213, 213);
    border-left: 1px solid rgb(213, 213, 213);
    border-right: 1px solid rgb(213, 213, 213);
    border-radius: 3px 3px 0 0
}
</style>