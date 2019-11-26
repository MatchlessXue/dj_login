import Vue from 'vue'
import App from './App'
import router from 'router'
import store from 'store'
// import lang from 'element-ui/lib/locale/lang/en'
// import locale from 'element-ui/lib/locale'
import lodash from 'lodash'
// import ElementUI from 'element-ui'

// 引入字体图标

import './assets/style/index.scss'
// 引入封装请求
import _props from './frame/_props.js'
import _request from './frame/_request.js'
import _directive from './frame/_directive.js'
import _filter from './frame/_filter.js'
import _methods from './frame/_methods.js'

// 引入element-UI
Vue.prototype.$ELEMENT = { size: 'medium' }
// 设置语言
// locale.use(lang)
// Vue.use(ElementUI, { size: 'medium' })


// 插件
Vue.use(_props)
Vue.use(_request)
Vue.use(_directive)
Vue.use(_filter)
Vue.use(_methods)
// Vue.use(_MetalEx)
Vue.config.productionTip = false
// 注册lodash
Object.defineProperty(Vue.prototype, '_lodash', { value: lodash })
Vue.lodash = lodash

Vue.mixin({
  methods: {
    // role 规则名  base（基础版）
    _auth (role = 'base') {
      let userInfo = this.$store.state.userInfo
      if (userInfo) {
        console.log('userInfo', userInfo)
        // 是否是标准版
        let isBaseVersion = false
        if (userInfo.bbEnable === '1' || userInfo.bbEnable === 1) isBaseVersion = true
        if (role === 'base') return !isBaseVersion
      }
    }
  }
})

// 注册全局组建

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
