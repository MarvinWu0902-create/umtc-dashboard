<template>
    <n-space vertical>
        <n-layout>

            <n-layout-header bordered>
                <div class="d-flex jc-sb ali-i-cen background-color">
                    <div>
                        <p1 class="color-primary">YM YIP</p1>
                        <n-menu mode="horizontal" :options="menuOptions" />
                    </div>
                    <div>
                        <ul class="d-flex ali-i-cen">
                            <li> <a href="http://10.22.66.28:8000/" target="_blank">
                                    <NIcon :component="LinkWebLogo" size="16px" :depth="2" />YM Dashboard
                                </a></li>
                            <li> <a href="http://10.22.66.28:8001/" target="_blank">
                                    <NIcon :component="LinkWebLogo" size="16px" :depth="2" />YM2 Dashboard
                                </a></li>
                            <li> <a href="http://10.13.65.223/" target="_blank">
                                    <NIcon :component="LinkWebLogo" size="16px" :depth="2" />回到Unimicron首頁
                                </a></li>
                        </ul>
                    </div>
                </div>
            </n-layout-header>

            <!-- <n-layout-content>
                <router-view></router-view>
            </n-layout-content> -->

            <!-- @update:collapsed="val => collapsed = val -->
            <n-layout has-sider>
                <n-layout-sider collapsible :collapsed="collapsed" @update:collapsed="val => collapsed = val" bordered
                    show-trigger collapse-mode="width" :collapsed-width="64" :width="200" :native-scrollbar="false"
                    style="max-height: 320px">

                    <n-menu :collapsed-width="64" :collapsed-icon-size="30" :options="sideOptions" />
                </n-layout-sider>

                <n-layout class="routerContainer">
                    <!-- routerContainers 要調整! -->
                    <router-view></router-view>
                    <!-- v-if="isRouterAlive" -->
                </n-layout>
            </n-layout>


            <n-layout-footer bordered>
                <p3>Copyright &#xA9; 2023 UMTC YMYIP All Rights Reserved.</p3>

            </n-layout-footer>


        </n-layout>
    </n-space>
</template>

<script setup>
import { h, nextTick, ref, provide, watch } from "vue";
import { NIcon, NBackTop, NSpace, NLayout, NLayoutHeader, NMenu, NLayoutSider, NLayoutFooter } from 'naive-ui'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const route = useRoute();
const router = useRouter();

router.afterEach((to, from) => {
    console.log('to', to);
    console.log('from', from);
});


import {
    HardwareChipOutline as PLogo,
    DesktopSharp as HBSLogo,
    PersonOutline as FTLogo,
    FolderOpenOutline as FMLogo,
    SpeedometerOutline as AutoMLLogo,
    EllipsisHorizontal as SystemLogo,
    ArrowRedoCircleOutline as LinkWebLogo
} from "@vicons/ionicons5";

const collapsed = ref(true);

// router.beforeEach((to,from,next)=>{
// if(from.name===undefined&&to.fullPath!=='/'){
//     console.log('to,from',to,from);
//     // router.go(0);
//     // reload();
//     // window.location.reload()
//     // router.push({name:'http://127.0.0.1:5173/vue/',params:to.name});

// }else{
//     next()
// }

//   ?reload()
//     // ?console.log('to,from',to,from,next)
//   :next()

// });

// router.beforeEach((to,from,next)=>{
//     console.log('to,from',to,from);
//     next();
// });


////


const menuOptions = [
    { label: () => h(RouterLink, { to: { path: '/' } }, { default: () => 'Home' }), key: 'go-home' }
    ,
    {
        label: () => 'AOI', key: 'go-aoi',
        children:
            [
                { label: () => h(RouterLink, { to: { path: '/aoidaily' } }, { default: () => 'AOI Daily Low Yield' }), key: 'go-aoidailylow' },
                { label: () => h(RouterLink, { to: { path: '/aoifocus' } }, { default: () => 'AOI Focus Product' }), key: 'go-aoifocus' },
                //weekly stack
                { label: () => h(RouterLink, { to: { path: '/aoistack' } }, { default: () => 'AOI Weekly Stack' }), key: 'go-aoistack' },
                { label: () => h(RouterLink, { to: { path: '/aoidailydefect' } }, { default: () => 'AOI Daily Defect' }), key: 'go-aoidailydefect' }
                // 
            ]
    }
    ,
    {
        label: () => 'OST', key: 'go-ost',
        children:
            [
                { label: () => h(RouterLink, { to: { path: '/ostdaily' } }, { default: () => 'OST Daily Low Yield' }), key: 'go-ost' },
                //weekly stack
                { label: () => h(RouterLink, { to: { path: '/oststack' } }, { default: () => 'OST Weekly Stack' }), key: 'go-oststack' }
                // 
            ]
    }
    ,
    {
        label: () => 'Bump', key: 'go-bump',
        children:
            [
                { label: () => h(RouterLink, { to: { path: '/bumpdaily' } }, { default: () => 'Bump Daily Low Yield' }), key: 'go-bump' },
                { label: () => h(RouterLink, { to: { path: '/flidaily' } }, { default: () => 'FLI Daily Low Yield' }), key: 'go-fli' },
                { label: () => h(RouterLink, { to: { path: '/bumpstack' } }, { default: () => 'Bump Weekly Stack' }), key: 'go-bumpstack' }
            ]
    },
    {
        label: () => 'CC', key: 'go-cc',
        children:
            [
                { label: () => h(RouterLink, { to: { path: '/ccdaily' } }, { default: () => 'CC Daily Low Yield' }), key: 'go-cc' },
                { label: () => h(RouterLink, { to: { path: '/ccstack' } }, { default: () => 'CC Weekly Stack' }), key: 'go-ccstack' }

            ]
    },
    {
        label: () => 'VI', key: 'go-vi',
        children:
            [
                { label: () => h(RouterLink, { to: { path: '/vidaily' } }, { default: () => 'VI Daily Low Yield' }), key: 'go-vi' },
                { label: () => h(RouterLink, { to: { path: '/vitrend' } }, { default: () => 'VI Trend Chart' }), key: 'go-vitrend' }
            ]
    },
    {
        label: () => 'WPG', key: 'go-wpg',
        children:
            [
                { label: () => h(RouterLink, { to: { path: '/wpgdaily' } }, { default: () => 'WPG Daily Low Yield' }), key: 'go-wpg' }
            ]
    },
    {
        label: () => 'More', key: 'go-more',
        children:
            [
                { label: () => h(RouterLink, { to: { path: '/wipyield' } }, { default: () => 'WIP Yield' }), key: 'go-wipyield' },
                { label: () => h(RouterLink, { to: { path: '/tagtri' } }, { default: () => 'Target/Trigger' }), key: 'go-tagtri' },
                { label: () => h(RouterLink, { to: { path: '/test' } }, { default: () => 'D3 Test' }), key: 'go-test' }
            ]
    },
];

const sideOptions = [
    { label: () => h(RouterLink, { to: { path: '/' } }, { default: () => 'P Dashboard' }), key: 'go-p', icon: renderIcon(PLogo) },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        path: '/hbs'
                    }
                },
                { default: () => 'HBS Dashboard' }
            ),
        key: 'go-hbs',
        icon: renderIcon(HBSLogo)

    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        path: '/ft'
                    }
                },
                { default: () => 'FT Dashboard' }
            ),
        key: 'go-ft',
        icon: renderIcon(FTLogo)
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        path: '/fm'
                    }
                },
                { default: () => 'FM Dashboard' }
            ),
        key: 'go-fm',
        icon: renderIcon(FMLogo)
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        path: '/ml'
                    }
                },
                { default: () => 'AutoML' }
            ),
        key: 'go-ml',
        icon: renderIcon(AutoMLLogo)
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        path: '/systemlink'
                    }
                },
                { default: () => 'Ststem Link' }
            ),
        key: 'go-system',
        icon: renderIcon(SystemLogo)
    }

];


function renderIcon(icon) {
    return () => h(NIcon, null, { default: () => h(icon) });
}

</script>

<style scoped>

.color-primary{
    color:#18a058;
}
p1 {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 18px;
    font-weight: 700;
    margin-left: 5px
}

.routerContainer {
    min-height: 800px;
}

.n-layout-footer {

    background-color: rgba(224, 224, 224, 0.6);
    font-family: Arial, Helvetica, sans-serif;
    color: rgba(179, 179, 179, 0.5);
    display: flex;
    justify-content: right;
}

.d-flex {
    display: flex;
}

.jc-sb {
    justify-content: space-between;
}

.ali-i-cen {
    align-items: center;
}

.background-color{
    background: linear-gradient(to bottom, #fcfcfc,#dddddd36);
}

.n-layout-header .n-menu {
    font-weight: 700;
}

.n-layout-header ul li{
    list-style: none;
}
.n-layout-header a {
    display: block;
    text-decoration: none;
    color: gray;
    font-size: 8px;
    font-weight: 700;
    margin-right: 10px;
    /* test */
    box-sizing: border-box;
}
.n-layout-header a:hover{
    color: #18a058;
}
/* 右邊頁面連結hover */

</style>