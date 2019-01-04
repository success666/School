import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css


import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import Axios from 'axios'
import echarts from 'echarts'
import BaiduMap from 'vue-baidu-map'

Vue.prototype.$echarts = echarts
Vue.prototype.$ajax = Axios

Vue.use(ElementUI)
Vue.use(BaiduMap, {
  ak: 'QeYOs2FMRGO0aGDlvivLNuT1QlDinpEe'
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
