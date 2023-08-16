<template>
    <div class="topleft" v-if="showButton">
        <button v-for="(eachbtn, index) in partBtn" :key="index" :class="{ active: activeBtn(eachbtn) }"
            @click="btnClick(eachbtn)">
            {{ eachbtn }}
        </button>

        <button v-if="partList.length === 1" :class="percentBtn" @click="percentHandle">%</button>
        <button v-if="partList.length === 1" :class="countBtn" @click="countHandle">C</button>
    </div>
</template>

<script setup>
import {ref,computed ,watchEffect} from 'vue'
import {storeToRefs } from 'pinia'
import pinia from "@/stores/index.js";
import { UseBtnStore } from "@/stores/Index/IndexBtn.js";

const usebtnstore = UseBtnStore(pinia);

const { filterClick, btnClick, activeBtn } = usebtnstore;
const { filterData,partBtn, partList,clickHandle} = storeToRefs(usebtnstore);

const showButton = ref(false);

const percentHandle = () => {
    clickHandle.value = 'isPercent'
};
const countHandle = () => {
    clickHandle.value = 'isCount'
}

const countBtn = computed(() => {

    if (clickHandle.value === 'isCount') {
        return { active: true }
    } else {
        return { active: false }
    }
});

const percentBtn = computed(() => {

if (clickHandle.value === 'isPercent') {
    return { active: true }
} else {
    return { active: false }
}

});

watchEffect(() => {
    if (filterData.value && filterData.value.length > 0||partList.value.length===0) {
        showButton.value = true;
    }
})
</script>

<style scoped>

.active {
    background-color: rgb(100, 100, 100);
    color: #fff;
}
button{
    width: 70px;
    height: 25px;
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
    margin: 5px;
    border-radius: 15px;
    border: 0px;
    cursor: pointer;
}

button:hover {
    background-color: rgba(100, 100, 100, 0.7);
    color: #fff;
}

</style>