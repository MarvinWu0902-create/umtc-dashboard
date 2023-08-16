<template>
    <div>
        <n-grid :cols="24" :x-gap="24">
            <n-form-item-gi :span="14" label="Transfer" path="transferValue">
                <n-transfer v-model:value="transferValue" style="width: 100%" :options="generalOptions" />
            </n-form-item-gi>
        </n-grid>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { NFormItemGi, NTransfer, NGrid } from 'naive-ui'

const transferValue = ref(["groode", "veli good"]);///預設原本有的->結果要傳回mysql
const generalOptions = ["groode", "veli good", "emazing", "lidiculous"].map(
    (v) => ({
        label: v,
        value: v
    })
);

console.log('generalOptions', generalOptions);
console.log('transferValue', transferValue.value)
watch(transferValue, (newval, oldval) => {
    console.log('transferValue', newval, oldval)
})
</script>

<style  scoped></style>