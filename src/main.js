import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/elementui'
import '@/style/global.scss'
import './assets/iconfont/iconfont.css'
import mixin from '@/plugins/mixin'
import filtter from './plugins/filtter'
import Big from 'big.js'
import clipboard from 'clipboard'
window.$Big = Big
window.$clipboard = clipboard

Vue.mixin(mixin)
Vue.mixin(filtter)

Vue.config.productionTip = false
window.name = 'APM-DASHBOARD'

if (
  navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
) {
  const u = window.navigator.userAgent
  if (u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) { sessionStorage.terminal = 'IPhone' } else sessionStorage.terminal = 'Android'
} else {
  sessionStorage.terminal = 'PC'
}
let noTab = ['login', 'user-changePassword']

router.beforeEach((to, from, next) => {
  // 排除不需要缓存的页面
  if (to.meta.isKeepAlive) {
    store.commit('ADD_KEEP_ALIVES', to.name)
  }

  // 排除不需要开启新tab的页面
  if (noTab.indexOf(to.name) < 0) {
    store.commit('ADD_EDITABLETABS', {
      path: to.fullPath,
      name: to.name,
      title: to.meta.title
    })
    store.commit('SET_CURRENT_TAB', to.fullPath)
  }

  document.title = to.meta.title ? `监控系统-${to.meta.title}` : '监控系统'
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
