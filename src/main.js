import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './Style/main.css'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// //Grphic Design Import Bootstrap an BootstrapVue CSS files 
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import vuetify from './plugins/vuetify';
import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
