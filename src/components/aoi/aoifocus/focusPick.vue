<template>
    <div class="btn">
        <n-badge class="curset" :color="pncountObj[eachpart] === 0
            ? 'rgb(175 175 175)'////灰色
            : pncountObj[eachpart] !== 0 && pntirObj[eachpart] === 0 && pntarObj[eachpart] === 0///沒有tri又有產出
                ? 'rgb(56, 219, 56)'///綠色
                /////pntarObj
                : pntirObj[eachpart] === 0 && pntarObj[eachpart] > 0
                    ? 'rgb(255, 209, 73)'
                    : 'rgb(255, 135, 135)'" :style="badgeStyle" v-for="eachpart of partBtn" :key="eachpart"
            @click="btnClick(eachpart)" :value="pncountObj[eachpart]" :max="10" :show-zero="true">
            <n-avatar :class="{ active: partRecord === eachpart }" :style="avatarStyle">{{ eachpart }}</n-avatar>
        </n-badge>
        <!-- <button class="addpn" @click="addClick">
            <NIcon v-if="!addformShow" :component="AddOutline" />
            <NIcon v-else :component="RemoveOutline" />
            料號管理
        </button> -->
    </div>
    <div class="addpn">
        <button  @click="addClick">
        <NIcon v-if="!addformShow" :component="AddOutline" />
        <NIcon v-else :component="RemoveOutline" />
        料號管理
    </button>
    </div>
    

    <div class="form-loc" v-if="addformShow">
        <div>
            <n-grid :cols="10" :x-gap="10">
                <n-form-item-gi :span="14" path="transferValue">
                    <n-transfer v-model:value="transferValue" style="width: 100% " :options="generalOptions" />
                </n-form-item-gi>
            </n-grid>
        </div>
        <div>
            <n-form inline>
                <n-form-item label="驗證使用者權限:" path="pincodeValue">
                    <n-input  type="password"
      show-password-on="mousedown" v-model:value="pincodeValue" placeholder="輸入pin碼" />
                </n-form-item>
            </n-form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { NBadge, NAvatar, NIcon, NFormItemGi, NTransfer, NGrid, NButton, NFormItem, NInput, NForm } from 'naive-ui'

import { storeToRefs } from 'pinia'
import { UseaoiFocus } from '@/stores/aoi/aoifocus/aoiFocusFetch.js';
import { UseTableSetStore } from '@/stores/aoi/aoifocus/aoiFocusTableSet.js';
import pinia from '@/stores/index.js';
import { AddOutline, RemoveOutline } from '@vicons/ionicons5';

import { apiGetaoifocusPNData, apiPostaoifocusPNData, apiGetaoiFocusData } from '@/api/index.js';

const useaoifocus = UseaoiFocus(pinia);
const { partBtn, partCount, testCount, aoi_params, tableData, aostrendData } = storeToRefs(useaoifocus);
///tableData,aostrendData
///來處理點擊按鈕新增料號按鈕時，同時更新資料
const usetablesetstore = UseTableSetStore(pinia);
const { partRecord, curPage } = storeToRefs(usetablesetstore);

const btnClick = (PN) => {
    partRecord.value = PN;
    curPage.value = 1;
};
const generalOptions = ref([]);
const transferValue = ref([]);
///test
const pincodeValue = ref('');
///test


const addformShow = ref(false);

const pncountObj = computed(() => {
    const result = testCount.value.reduce((obj, item) => { obj[item.pn] = item.count; return obj }, {});
    return result
});
const pntirObj = computed(() => {
    const result = testCount.value.reduce((obj, item) => { obj[item.pn] = item.red; return obj }, {});
    return result
});
const pntarObj = computed(() => {
    const result = testCount.value.reduce((obj, item) => { obj[item.pn] = item.yellow; return obj }, {});
    return result
});



const aoifetfocusPNData = async () => {
    try {
        const res = await apiGetaoifocusPNData();

        generalOptions.value = res.data[0].map((item) => item.PartNo).map((v) => ({ label: v, value: v }));
        transferValue.value = res.data[1].map((item) => item.PartNum);
        console.log('res', res)

    } catch (error) {
        console.log('err', error);
    }
};


const addClick = () => {
    addformShow.value = !addformShow.value;
    if (addformShow.value === true) {
        aoifetfocusPNData();
    }
};///打開料號管理頁面時，取得全部料號和當前監控料號資料

const aoipostfocusPNData = async (data) => {
    try {
        ///傳transferValue.value
        ///回傳 當前監控料號
        const feedback = await apiPostaoifocusPNData(data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        const res = await apiGetaoiFocusData(aoi_params.value.st, aoi_params.value.et);
        console.log('res data', res.data);
        tableData.value = res.data[0];
        aostrendData.value = res.data[1];
        console.log('fed back', feedback.data);
        partBtn.value = feedback.data;
    } catch (error) {
        console.log('err', error);
    }
};

watch(addformShow, (newval, oldval) => {
    if (newval === false) {
        console.log('checkkkkk', transferValue.value);
        ///try
        const appendpinData = [...transferValue.value.concat(pincodeValue.value)]
        console.log('appendpinData', appendpinData);
        ///try
        aoipostfocusPNData(appendpinData);///transferValue.value///傳至aoifocuscheck進行比對///傳pincode
        console.log('action done');

        pincodeValue.value = '';
        ///最後把pincodeValue.value變成空的下次點開就是空的
    }
})





const badgeStyle = ref({
    margin: '10px',
    width: '80px',
    height: '25px'
})
const avatarStyle = ref({
    width: '80px',
    height: '25px',
    fontSize: '14px',
    fontWeight: '700',
})



</script>

<style scoped>
.curset {
    cursor: pointer;
}

.btn {
    display: flex;
    width: 1150px;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: 10px;
    margin-left: 10px;
}

.addpn{
    display: flex;
    justify-content: flex-end;
}
.addpn button{
    cursor: pointer;
    background-color: rgb(255, 255, 255);
    border: 0;
}


.addpn button:hover {
    transition: 0.3s;
    color: rgb(54, 121, 238);
}

.n-avatar:hover {
    background-color: rgb(155, 155, 155);
}

.active {
    background-color: rgb(53, 142, 219);
}

.form-loc {
    width: 40%;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid rgb(198, 198, 198);
    border-radius: 5px;
    position: absolute;
    z-index: 1;
    top: 0;
    right: 90px
}

.form-loc>div {
    margin: 5px;
}
</style>