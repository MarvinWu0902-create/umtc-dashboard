<template>
    <div style="overflow: hidden;">
        <!--上面的overflow 是控制內部畫面 -->
        <viDevice />
        <viPick />
        <div class="title">
            <p>VI Daily Low Yield</p>
        </div>
        <div class="sub">
            <p>下列預設為YIP當日晨會VI Trigger批號,如要查詢過往資料,下列條件選擇後,在點選查詢即可</p>
        </div>
        <viTime />
        <viHC v-if="filterTotaltableData.length > 0" />
        <viitemSelect />
        <viTable />
        <vibtnSelect />
        <hr />
        <videfectNav :partnumber="partRecord" />
        <div v-if="selectStatus">
            <videfectTrendHC v-for="eachCount of chartCount" :defect="eachCount" />
            <div class="control-form">
                <h3><a href="javascript:void(0)" @click="clickAction">對策表單</a></h3>
                <n-form v-if="vertifyfromShow">
                    <n-grid :cols="24" :x-gap="10">
                        <n-form-item-gi :span="8" label=""> <!-- 驗證完後要消失 v-if="paramsProcess && !vertifyStatus-->

                            <n-input type="password" show-password-on="mousedown" v-model:value="paramsPwd"
                                placeholder="請輸入pin碼" />
                            <n-button attr-type="button" @click="vertifyClick">
                                驗證
                            </n-button>
                        </n-form-item-gi>
                    </n-grid>
                </n-form>
            </div>
        </div>
        <viactionForm v-show="showAction && vertifyStatus" />


    </div>
</template>
<!-- :series="seriesAry.filter((item)=>item.defect===eachCount)" -->
<!-- seriesAry.filter((item)=>item.defect===eachCount) -->
<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import pinia from "@/stores/index.js";
import { storeToRefs } from 'pinia';
import { NForm, NGrid, NFormItemGi, NSelect, NInput, NButton } from 'naive-ui'

import viDevice from '../components/vi/daily/viDevice.vue';
import viPick from '../components/vi/daily/viPick.vue';
import viTime from '../components/vi/daily/viTime.vue';
import viTable from '../components/vi/daily/viTable.vue';
import vibtnSelect from '../components/vi/daily/vibtnSelect.vue';
import viitemSelect from '../components/vi/daily/viitemSelect.vue';
import viHC from '../components/vi/daily/viHC.vue';
import videfectNav from '../components/vi/daily/videfectNav.vue';
import videfectTrendHC from '../components/vi/daily/videfectTrendHC.vue';
import viactionForm from '../components/vi/daily/viactionForm.vue';



import { UseviStore } from '../stores/vi/daily/viFetch.js'
import { UseTableStore } from '../stores/vi/daily/viTableSet.js';
import { UseTrendStore } from '../stores/vi/daily/viTrendSet.js';

const usevistore = UseviStore(pinia);
const { vifetchData } = usevistore;
const { tableData } = storeToRefs(usevistore);


const usetablestore = UseTableStore(pinia);
const { slicefilterAry, filterTotaltableData, partRecord } = storeToRefs(usetablestore);

const usetrendstore = UseTrendStore(pinia);

const { gettrendData } = usetrendstore;
const { partnumber, process, defect, selectStatus, defecttrendData, seriesAry, testVal } = storeToRefs(usetrendstore);


const showAction = ref(false);

const paramsPwd = ref('');
const vertifyStatus = ref(false);
const vertifyfromShow = ref(false);

const clickAction = () => {
    if (showAction.value === true) {
        showAction.value = false;
        vertifyfromShow.value = false;
        paramsPwd.value = '';
    } else {
        vertifyfromShow.value = true;
    }
    // showAction.value=!showAction.value
    ///要改成跑出認證表單
};
///
const vertifyClick = () => {

    if (paramsPwd.value === '1649') {
        showAction.value = true;
        vertifyStatus.value = true;
        vertifyfromShow.value = false;
    } else {///輸入錯誤
        paramsPwd.value = '';
        alert('密碼錯誤!');
    }
};

////

watch(seriesAry, (newval, oldval) => {
    console.log('seriesAry', newval, oldval);

}, { deep: true })


const chartCount = computed(() => {
    return [...new Set(seriesAry.value.map((item) => item.defect))]
});

onMounted(() => {
    vifetchData();
});

onBeforeUnmount(() => {
    // partRecord.value='';
    tableData.value = [];
});


</script>

<style  scoped>
.title,
.sub {
    width: 100%;
    /* margin-top: -50px;
    height: 90px; */
    display: flex;
    justify-content: center;
    font-size: 36px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    color: #2a2a2a;
}

.title>p {
    margin: 0;
}


.sub {
    color: black;
    font-size: 18px;
}

.control-form{
    display: flex;
    align-items:center;
}
.control-form h3{
    width: 150px;
}
.control-form .n-form{
    margin-left: 50px;
}
</style>