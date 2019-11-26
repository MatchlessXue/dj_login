import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const BaseRouter = [
  {
    path: '/',
    redirect: '/frame'
  },
  {
    path: '/login',
    name: 'login',
    meta: { display: 0 },
    component: function (resolve) {
      require(['views/loginup.vue'], resolve)
    }
  }, {
    path: '/info',
    name: 'info',
    meta: { display: 0 },
    component: function (resolve) {
      require(['views/productInfo.vue'], resolve)
    }
  }, {
    path: '/home',
    name: 'home',
    meta: { display: 0 },
    component: function (resolve) {
      require(['views/home.vue'], resolve)
    }
  }, {
    path: '/404',
    name: '404',
    meta: { display: 0 },
    component: function (resolve) {
      require(['views/error/404.vue'], resolve)
    }
  },
  {
    path: '/frame',
    id: 1,
    name: 'Layout',
    meta: { display: 1 },
    component: function (resolve) {
      require(['views/Layout.vue'], resolve)
    }
  },
  { path: '/settinghtml',
    name: 'setting',
    meta: { display: 1 },
    component: function (resolve) {
      require(['views/setting/settinghtml.vue'], resolve)
    }
  },
  { path: '/settingmenu',
    name: 'setting',
    meta: { display: 1 },
    component: function (resolve) {
      require(['views/setting/menu.vue'], resolve)
    }
  },
  { path: '/message',
    name: 'message',
    meta: { display: 1 },
    component: function (resolve) {
      require(['views/agency/newsTask.vue'], resolve)
    }
  },
  { path: '/message/:id',
    name: 'message',
    meta: { display: 1 },
    component: function (resolve) {
      require(['views/agency/newsDetail.vue'], resolve)
    }
  },
  { path: '*', redirect: '/404', meta: { spec: true, display: 0 } }
]

let router = new Router({
  mode: 'hash',
  base: __dirname,
  routes: BaseRouter
})

export default router
