import "@babel/polyfill"
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
Vue.config.productionTip = false

// 全局样式
import 'iview/dist/styles/iview.css'
import './assets/styles/index.less'


// 全局组件
import './components/common'
import './components/business'


// 全局指令
import './directives/index'

// 全局过滤器
import './filters/date-format'

Vue.prototype.emojiParse= function (value) {
  return value && twemoji.parse(value, {size: 16});
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
