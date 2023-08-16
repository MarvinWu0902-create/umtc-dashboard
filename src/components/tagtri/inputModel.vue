<template>
    <div>
        <n-form label-placement="left">
            <n-grid :cols="4" :x-gap="10" :y-gap="10">
                <n-form-item-gi :span="23" label="料號" path="inputValue">
                    <n-input v-model:value="inputValue.pn" />
                </n-form-item-gi>
                <n-form-item-gi :span="23" label="層別" path="inputValue" v-if="paramsProcess === 'aoi'">
                    <n-input v-model:value="inputValue.layer" />
                </n-form-item-gi>
                <n-form-item-gi :span="23" label="Target" path="inputValue">
                    <n-input v-model:value="inputValue.tag" />
                </n-form-item-gi>
                <n-form-item-gi :span="23" label="Trigger" path="inputValue">
                    <n-input v-model:value="inputValue.tri" />
                </n-form-item-gi>

                <n-form-item-gi>
                    <n-button attr-type="button" @click="addClick">
                        新增
                    </n-button>
                    <n-button attr-type="button" @click="cleanClick">
                        清除
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
const { paramsProcess, paramsPwd, inputValue, tableData } = storeToRefs(usetagtristore);

// 新增至tableData
const addClick = () => {
    if (paramsProcess.value === 'aoi') {
        tableData.value.push(
            {
                PartNum: inputValue.value.pn,
                LayerName: inputValue.value.layer,
                Target: inputValue.value.tag,
                Triger: inputValue.value.tri
            }
        )
        inputValue.value.pn = '';
        inputValue.value.layer = '';
        inputValue.value.tag = '';
        inputValue.value.tri = '';
    } else {
        tableData.value.push(
            {
                ShortPart: inputValue.value.pn,
                Target: inputValue.value.tag,
                Triger: inputValue.value.tri
            }
        );
        inputValue.value.pn = '';
        inputValue.value.tag = '';
        inputValue.value.tri = '';
    }
};

const cleanClick = () => {
    inputValue.value.pn = '';
    inputValue.value.layer = '';
    inputValue.value.tag = '';
    inputValue.value.tri = '';
}

///
</script>

<style  scoped>
.n-form {
    width: 30%;
    position: fixed;
    top: 150px;
    left: 100px;
    width: 30%;

    padding: 15px;
    background-color: rgba(245, 245, 245, 0.8);
    border-radius: 5px;
    box-shadow: 0px 0px 5px 0px rgb(195, 195, 195);
}
</style>