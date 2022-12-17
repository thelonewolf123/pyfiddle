import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { firebaseApp } from '@/plugins/firebase'
import vuetify from '@/plugins/vuetify' // path to vuetify export
import store from './store/store'

Vue.config.productionTip = false

new Vue({
    router,
    vuetify,
    store,
    firebaseApp,
    render: (h) => h(App)
}).$mount('#app')
