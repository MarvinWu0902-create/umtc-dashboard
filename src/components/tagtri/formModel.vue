<template>
    <div>
        <n-form>
            <n-grid :cols="24" :x-gap="10">
                <n-form-item-gi :span="4" label="">
                    <n-select v-model:value="paramsProcess" placeholder="請選擇站點" :options="generalOptions" />
                </n-form-item-gi>
                    <n-form-item-gi :span="4" label="" v-if="paramsProcess && !vertifyStatus"><!-- 驗證完後要消失 -->

                        <n-input type="password"
      show-password-on="mousedown" v-model:value="paramsPwd" placeholder="請輸入pin碼" />
                        <n-button attr-type="button" @click="vertifyClick">
                            驗證
                        </n-button>
                    </n-form-item-gi>
            </n-grid>
        </n-form>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { NForm, NGrid, NFormItemGi, NSelect, NInput, NButton } from 'naive-ui'

import { storeToRefs } from 'pinia'
import pinia from '../../stores/index.js';

import { UsetagtriStore } from '../../stores/tagtri/tagtriFetch.js';

const usetagtristore = UsetagtriStore(pinia);
const { tagtrifetchData } = usetagtristore;
const { paramsProcess, paramsPwd, vertifyStatus, tableData } = storeToRefs(usetagtristore);

const generalOptions = ref([
    { label: 'AOI', value: 'aoi' },
    { label: 'Bump', value: 'bump' },
    { label: 'CC', value: 'cc' },
    { label: 'VI', value: 'vi' },
]);

watch(paramsProcess, (newval, oldval) => {
    tableData.value = [];
    console.log('paramsProcess', newval, oldval);
    if (oldval !== null) {///非第一次切換站點
        ///認證跑出來
        vertifyStatus.value = false;
    }
});

const vertifyClick = () => {///點選認證 通過 vertifyStatus.value=true;
    tagtrifetchData();
};


</script>

<style  scoped>
.n-form {
    margin-left: 20px;
}
</style>