<template>
    <div class="container">
        <ul class="d-flex justify-content-center list-unstyled ">
            <li v-for="List of defectList">
                <a class="d-block btn btn-outline-success me-1 my-3 fz-8 fw-bold" href="javascript:void(0)" @click="defectClick(List.Defect, List.Process)"
                    :class="{ active: activeDefect === List.Defect }">
                    {{ List.Defect }}
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import pinia from "@/stores/index.js";

import { UsedefectFetch } from '../../../stores/aoi/aoidailydefect/defectFetch.js'
const usedefectfetch = UsedefectFetch(pinia);

const { activeDefect, activeProcess,defectList} = storeToRefs(usedefectfetch);



const defectClick = (defect, process) => {
    activeDefect.value = defect;
    activeProcess.value = process;
}

</script>

<style lang="scss" scoped>
.container {
    width: 1000px;
    margin: 0 auto;
}
a{
    text-decoration: none;
}
.fz-8{
    font-size: 8px;
}
</style>