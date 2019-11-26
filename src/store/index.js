import Vue from 'vue'
import Vuex from 'vuex'
import Storage from '../utils/storage'
Vue.use(Vuex)
// 全局获取dict方法

export default new Vuex.Store({
  state: {
    isFilterTableRefresh: true,
    // 判断页面是否强制刷新
    isPageRefresh: true,
    accesstoken: '',
    loginUser: null,
    userInfo: null,
    tenantId: ''
  },
  getters: {
    GET_ACCESSTOKEN: (state, getters) => {
      let accesstoken = state.accesstoken
      if (accesstoken) {
        return accesstoken
      } else {
        accesstoken = Storage.getSessionStorageProperty('accesstoken')
        return accesstoken
      }
    },
    GET_LOGIN_USER: (state, getters) => {
      let loginUser = state.loginUser
      if (loginUser) {
        return loginUser
      } else {
        loginUser = Storage.getSessionStorageProperty('loginUser')
        return loginUser
      }
    },
    GET_USER_INFO: (state, getters) => {
      let userInfo = state.userInfo
      if (userInfo) {
        return userInfo
      } else {
        userInfo = Storage.getSessionStorageProperty('userInfo')
        return userInfo
      }
    },
    GET_TENANTID: (state, getters) => {
      let tenantId = state.tenantId
      if (tenantId) {
        return tenantId
      } else {
        let tenantId = Storage.getSessionStorageProperty('tenantId')
        return tenantId
      }
    }
  },
  mutations: {
    SET_ACCESSTOKEN: (state, accesstoken) => {
      state.accesstoken = accesstoken || ''
      Storage.setSessionStorageByProperty('accesstoken', accesstoken || '')
    },
    SET_LOGIN_USER: (state, loginUser) => {
      state.loginUser = loginUser || null
      Storage.setSessionStorageByProperty('loginUser', loginUser || '')
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo || null
      Storage.setSessionStorageByProperty('userInfo', userInfo || '')
    },
    SET_TENANTID: (state, tenantId) => {
      state.tenantId = tenantId || ''
      Storage.setSessionStorageByProperty('tenantId', tenantId || '')
    }
  },
  modules: {
  }
})
