<template>
    <div class="d-flex justify-content-end">
        <n-radio-group v-model:value="radioItem" name="radiogroup">
            <n-radio value="oridinary">
                預設
            </n-radio>
            <n-radio value="machine">
                機台
            </n-radio>
        </n-radio-group>
    </div>
</template>

<script setup>
import pinia from "@/stores/index.js";
import { storeToRefs } from 'pinia';
import { NRadioGroup, NRadio } from 'naive-ui';

import { UsedefectHC } from '../../../stores/aoi/aoidailydefect/defectHCSet.js';


const usedefecthc = UsedefectHC(pinia);
const { radioItem } = storeToRefs(usedefecthc);
</script>

<style scoped></style>

