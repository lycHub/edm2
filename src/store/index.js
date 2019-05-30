import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import * as actions from './actions'

// 每当mutations修改了state时，就会输出一个修改日志
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// 开发环境下开启调试，如果状态的改变不是来自mutations，就会报警告
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  getters,
  state,
  mutations,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})