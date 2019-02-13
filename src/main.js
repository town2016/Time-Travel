// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/less/animate.css'
import '@/utils/fetch'
import store from '@/store'
import {
  /* eslint-disable no-unused-vars */
  Style,
  Button,
  Scroll,
  Toast,
  Textarea,
  Dialog,
  createAPI, BetterScroll, Locale
} from 'cube-ui'

Vue.config.productionTip = false
Vue.use(Button)
Vue.use(Scroll)
Vue.use(Toast)
Vue.use(Textarea)
Vue.use(Dialog)
createAPI(Vue, App, ['click'], true)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
