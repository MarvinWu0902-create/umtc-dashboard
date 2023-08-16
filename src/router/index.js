
import { createRouter, createWebHistory } from 'vue-router'


import IndexView from '../views/IndexView.vue'
import HBSView from '../views/HBSView.vue'
import AOIdailyView from '../views/AOIdailyView.vue'
import FLIdailyView from '../views/FLIdailyView.vue'
import AOIFocusView from '../views/AOIFocusView.vue'
import OSTdailyView from '../views/OSTdailyView.vue'
import BumpdailyView from'../views/BumpdailyView.vue'
import CCdailyView from '../views/CCdailyView.vue'
import VIdailyView from '../views/VIdailyView.vue'
import VITrendView from '../views/VITrendView.vue'
import WPGdailyView from '../views/WPGdailyView.vue'
import WIPyieldView from '../views/WIPyieldView.vue'
import TagTriView from '../views/TagTriView.vue'
import AOIdailyDefectView from '../views/AOIdailyDefectView.vue'

// weekly堆疊
import AOIstackView from '../views/stack/AOIstackView.vue'
import OSTstackView from '../views/stack/OSTstackView.vue'
import BumpstackView from '../views/stack/BumpstackView.vue'
import CCstackView from '../views/stack/CCstackView.vue'

// 


import SystemLinkView from '../views/SystemLinkView.vue'
// import HomeView from '../views/HomeView.vue'

// 測試D3 
import TestView from '../views/TestView.vue'

//



const router = createRouter({
  history: createWebHistory('/ymyip/'),///Hash
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
    // { path: '/', name: 'home', component: HomeView },
    { path: '/', name: 'index', component: IndexView },
    { path: '/aoidaily', name: 'aoidaily', component: AOIdailyView },
    { path: '/flidaily', name: 'flidaily', component: FLIdailyView },
    { path: '/aoifocus', name: 'aoifocus', component: AOIFocusView },
    { path: '/ostdaily', name: 'ostdaily', component: OSTdailyView },
    { path: '/bumpdaily', name: 'bumpdaily', component: BumpdailyView},
    { path: '/ccdaily', name: 'ccdaily', component: CCdailyView},
    { path: '/vidaily', name: 'vidaily', component: VIdailyView},
    { path: '/vitrend', name: 'vitrend', component: VITrendView},
    { path: '/wpgdaily', name: 'wpgdaily', component: WPGdailyView},
    { path: '/wipyield', name: 'wipyield', component: WIPyieldView},
    { path: '/tagtri', name: 'tagtri', component: TagTriView},
    { path: '/aoidailydefect', name: 'aoidailydefect', component: AOIdailyDefectView},
    //weekly 堆疊
    { path: '/aoistack', name: 'aoistack', component: AOIstackView},
    { path: '/oststack', name: 'oststack', component: OSTstackView},
    { path: '/bumpstack', name: 'bumpstack', component: BumpstackView},
    { path: '/ccstack', name: 'ccstack', component: CCstackView},
    // 
    { path: '/systemlink', name: 'systemlink', component: SystemLinkView },
    { path: '/hbs', name: 'hbs', component: HBSView },

    // Test
    { path: '/test', name: 'test', component: TestView },
  ]
});

export default router
