import Vue from 'vue'
import Vuex from 'vuex'

import amap from './modules/amap'

Vue.use(Vuex)

var store = new Vuex.Store({
  modules: {
    amap
  }
})
export default store
