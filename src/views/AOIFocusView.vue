<template>
    <div>
        <focusPick />
        <div class="pstr">
            <p>AOI Focus Product</p>
        </div>
        <focusTime />
        <focusitemSelect />
        <focusTable />
        <focusbtnSelect />
        <NIcon v-show="chartStatus === false" class="cur" :component="AddCircle" size="36px" :depth="3"
            @click="niconClick" />
        <NIcon v-show="chartStatus === true" class="cur" :component="RemoveCircle" size="36px" :depth="3"
            @click="niconClick" />

            <focusCanvas v-if="chartStatus" />

    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import pinia from "@/stores/index.js";
import { NIcon} from 'naive-ui'
import { AddCircle, RemoveCircle } from "@vicons/ionicons5";

import focusPick from '@/components/aoi/aoifocus/focusPick.vue';
import focusTime from '@/components/aoi/aoifocus/focusTime.vue';
import focusTable from '@/components/aoi/aoifocus/focusTable.vue';
import focusitemSelect from '../components/aoi/aoifocus/focusitemSelect.vue';
import focusbtnSelect from '../components/aoi/aoifocus/focusbtnSelect.vue';
import focusCanvas from '../components/aoi/aoifocus/focusCanvas.vue';
// import focuspartForm from '../components/aoi/aoifocus/focuspartForm.vue'


import { UseaoiFocus } from '@/stores/aoi/aoifocus/aoiFocusFetch.js'
import { SetAosStore } from '@/stores/aoi/aoifocus/aoiFocusaosTrend.js'///try

const useaoifocus = UseaoiFocus(pinia);
const setaosstore = SetAosStore(pinia);


const { aoifocusfetchData } = useaoifocus;
// const {xaxisAry,fbAry,canvasData}=storeToRefs(setaosstore);

const chartStatus = ref(false);

const niconClick = () => {
    chartStatus.value = !chartStatus.value;
}

onMounted(() => {
    aoifocusfetchData();
});
</script>

<style  scoped>
.cur {
    cursor: pointer;
}

.cur:hover {
    color: rgb(1, 78, 146);
}


.pstr {
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

.pstr>p {
    margin: 0;
}
</style>