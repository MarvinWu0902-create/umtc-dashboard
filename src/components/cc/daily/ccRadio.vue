<template>
        <div class="radio">
            <n-radio-group v-model:value="radioItem" name="radiogroup">
                <n-radio value="all">
                    全部
                </n-radio>
                <n-radio value="machine">
                    機台別
                </n-radio>
            </n-radio-group>
        </div>
</template>

<script setup>
import pinia from "@/stores/index.js";
import { storeToRefs } from 'pinia';
import {  NRadioGroup, NRadio} from 'naive-ui';

import { UseHCStore } from '../../../stores/cc/daily/ccHCSet.js';


const usehcstore = UseHCStore(pinia);
const { radioItem } = storeToRefs(usehcstore);



</script>

<style scoped>
.radio {
    margin-left: 20px;
}
</style>