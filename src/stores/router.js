import { ref, nextTick } from 'vue';
import { defineStore } from 'pinia';
export const UserouterStore = defineStore('routerhandler', () => {

    const isRouterAlive = ref(true);
    const reload = () => {
        isRouterAlive.value = false;
        nextTick(() => {
            isRouterAlive.value = true
        })
    };

    return {
        isRouterAlive,reload
    }
});