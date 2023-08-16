import { createApp } from 'vue'


// // import { createPinia } from 'pinia' //#
// import pinia from './stores/store.js'

// import App from './App.vue'
import App from './Layout.vue'
import router from './router'
import pinia from './stores'
// import pinia from '@/stores/store.js'
// import './assets/main.css'

const app = createApp(App);
// const pinia=createPinia(); //#


app.use(router);
app.use(pinia);
app.mount('#app');
