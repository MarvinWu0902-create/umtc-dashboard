import { createApp } from 'vue'


// // import { createPinia } from 'pinia' //#
// import pinia from './stores/store.js'

// import App from './App.vue'
import App from './Layout.vue'
import router from './router'
import pinia from './stores'
// import pinia from '@/stores/store.js'
// import './assets/main.css'
import VueMatomo from 'vue-matomo'

const app = createApp(App);
// const pinia=createPinia(); //#

app.use(VueMatomo, {
    host: '//wsyp2p36569/s2factory/matomo/',
    siteId: 3,
    trackerFileName:'matomo',
    trackerUrl:'//wsyp2p36569/s2factory/matomo/matomo.php',
    router: router,
});
window._paq.push;


app.use(router);
app.use(pinia);
app.mount('#app');
