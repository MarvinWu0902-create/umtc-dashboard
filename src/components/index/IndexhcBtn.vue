<template>
    <div v-show="showButton">

        <div class="pd_block">
            <select v-model="Index_params.product">
                <!-- <option disabled value="">Select One</option>
                    <option>預設</option>
                    <option>Server</option>
                    <option>EMIB</option>
                    <option>Client</option> -->
                <option value="">預設</option>
                <option>Server</option>
                <option>EMIB</option>
                <option>Client</option>
            </select>

            <button @click="filterClick()">產品切換</button>
        </div>
        <div class="div_block">
            <n-space>
                <span>{{ divValue ? '不含批量性報廢' : '含批量性報廢' }}</span>
                <n-switch v-model:value="divValue" />
            </n-space>
        </div>

        <div class="move_block">
            <i @click="iconClick" >
                <n-icon size="20" depth="3">
                    <component :is="showMove
                    ?ArrowUpOutline
                    :SettingsOutline">
                    </component>
                </n-icon>
            </i>
            <div v-show="showMove">
                <!-- showButton(?) -->
                <div class="group1">
                    <div class="downeach">
                        <p><strong>月(左)</strong></p>
                        <p>新增</p><button @click="Move('mLeft_L')">&lt;</button>
                        <p>移除</p><button @click="Move('mLeft_R')">&gt;</button>
                    </div>
                    <div class="downeach">
                        <p><strong>月(右)</strong></p>
                        <p>新增</p><button @click="Move('mRight_L')">&lt;</button>
                        <p>移除</p><button @click="Move('mRight_R')">&gt;</button>
                    </div>
                </div>

                <div class="group1">
                    <div class="downeach">
                        <p><strong>週(左)</strong></p>
                        <p>新增</p><button @click="Move('wLeft_L')">&lt;</button>
                        <p>移除</p><button @click="Move('wLeft_R')">&gt;</button>
                    </div>
                    <div class="downeach">
                        <p><strong>週(右)</strong></p>
                        <p>新增</p><button @click="Move('wRight_L')">&lt;</button>
                        <p>移除</p><button @click="Move('wRight_R')">&gt;</button>
                    </div>
                </div>

                <div class="group1">
                    <div class="downeach">
                        <p><strong>日(左)</strong></p>
                        <p>新增</p><button @click="Move('dLeft_L')">&lt;</button>
                        <p>移除</p><button @click="Move('dLeft_R')">&gt;</button>
                    </div>
                    <div class="downeach">
                        <p><strong>日(右)</strong></p>
                        <p>新增</p><button @click="Move('dRight_L')">&lt;</button>
                        <p>移除</p><button @click="Move('dRight_R')">&gt;</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, inject, computed, watchEffect } from 'vue'
import { storeToRefs } from "pinia";
import pinia from "@/stores/index.js";
///SettingsOutline
import {NIcon} from 'naive-ui'
import {SettingsOutline,ArrowUpOutline} from "@vicons/ionicons5";

import { UseIndexFetch } from "@/stores/Index/IndexFetch.js";
import { UseBtnStore } from "@/stores/Index/IndexBtn.js";
import { UseXYStore } from '@/stores/Index/XYAxisData.js';

import { NSpace, NSwitch } from 'naive-ui'


const usefetstore = UseIndexFetch(pinia);
const usebtnstore = UseBtnStore(pinia);
const usexystore = UseXYStore(pinia);

const { filterClick, btnClick, activeBtn } = usebtnstore;

const { Index_params } = storeToRefs(usefetstore);
const { filterData, partBtn, partList, clickHandle } = storeToRefs(usebtnstore);
const { divValue, mLeft, mRight, wLeft, wRight, dLeft, dRight } = storeToRefs(usexystore);

const showButton = ref(false);
const showMove=ref(false);

const iconClick=()=>{
    showMove.value=!showMove.value;

};


const Move = (id) => {
    switch (id) {
        case 'mLeft_L':
            mLeft.value++///無法判斷全長...要修改
            break;
        case 'mLeft_R':
            mLeft.value === 0 || mLeft.value === mRight.value ? mLeft.value : mLeft.value--
            break;
        case 'mRight_L':
            mRight.value === mLeft.value ? mRight.value : mRight.value++;
            break;
        case 'mRight_R':
            mRight.value === 0 ? mRight.value : mRight.value--;
            break;
        ///
        case 'wLeft_L':
            wLeft.value++
            break;
        case 'wLeft_R':
            wLeft.value === 0 || wLeft.value === wRight.value ? wLeft.value : wLeft.value--
            break;
        case 'wRight_L':
            wRight.value === wLeft.value ? wRight.value : wRight.value++;
            break;
        case 'wRight_R':
            wRight.value === 0 ? wRight.value : wRight.value--;
            break;
        ///
        case 'dLeft_L':
            dLeft.value++
            break;
        case 'dLeft_R':
            dLeft.value === 0 || dLeft.value === dRight.value ? dLeft.value : dLeft.value--
            break;
        case 'dRight_L':
            dRight.value === dLeft.value ? dRight.value : dRight.value++;
            break;
        case 'dRight_R':
            dRight.value === 0 ? dRight.value : dRight.value--;
            break;
        default:
            break;
    }
};


watchEffect(() => {
    if (filterData.value && filterData.value.length > 0) {
        showButton.value = true;
    }
})


</script>

<style scoped>
/* .active {
    background-color: rgb(255 204 204);
} */

.pd_block {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e9e9e9b0;
}


.pd_block>button {
    width: 100px;
    height: 25px;
    font-size: 14px;
    margin: 5px;
    border-radius: 10px;
    border: 0px;
    cursor: pointer;
    font-family: Arial, Helvetica, sans-serif;
}
.move_block{
    display: flex;
}

.n-icon{
    cursor: pointer;
}

.downeach{
    display: flex;
    align-items: center;
}
.downeach>button {
    width: 20px;
    height: 20px;
    background-color: rgb(213, 213, 215);
    border: 0px;
    border-radius: 5px;
    margin: 5px;
}


.div_block {
    margin: 5px;
    width: 100%;
    border-bottom: 1px solid #e9e9e9b0;
}


button:hover {
    background-color: rgba(100, 100, 100, 0.7);
    color: #fff;
}

.active {
    background-color: rgb(100, 100, 100);
    color: #fff;
}

span {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
}
</style>