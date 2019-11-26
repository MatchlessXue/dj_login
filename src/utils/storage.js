var Storage = {
  localStorage: window.localStorage,
  sessionStorage: window.sessionStorage,
  storageName: 'pro', // ace localStorage

  getLocalStorage () { // 获取localStorage
    let ls = this.localStorage.getItem(this.storageName)
    if (ls) {
      return JSON.parse(decodeURIComponent(ls))
    }
    return null
  },
  getSessionStorage () { // 获取sessionStorage
    let ss = this.sessionStorage.getItem(this.storageName)
    if (ss) {
      return JSON.parse(decodeURIComponent(ss))
    }
    return null
  },
  setLocalStorage (data) { // 设置localStorage
    if ((typeof data).toLowerCase() === 'object') {
      this.localStorage.setItem(this.storageName, encodeURIComponent(JSON.stringify(data)))
    }
  },
  setSessionStorage (data) { // 设置sessionStorage
    if ((typeof data).toLowerCase() === 'object') {
      this.sessionStorage.setItem(this.storageName, encodeURIComponent(JSON.stringify(data)))
    }
  },
  setLocalStorageByProperty (propertyName, value) { // 给localStorage添加新键值对或设置已有属性的值
    let localStorage = this.getLocalStorage()
    this.setLocalStorage({ ...localStorage, ...{ [propertyName]: value } })
  },
  setSessionStorageByProperty (propertyName, value) { // 给sessionStorage添加新键值对或设置已有属性的值
    let sessionStorage = this.getSessionStorage()
    this.setSessionStorage({ ...sessionStorage, ...{ [propertyName]: value } })
  },
  getLocalStorageProperty (propertyName) { // 通过key获取localstroage中对应的value
    let localStorage = this.getLocalStorage()
    if (localStorage) {
      return localStorage[propertyName]
    }
    return null
  },
  getSessionStorageProperty (propertyName) { // 通过key获取sessionstroage中对应的value
    let sessionStorage = this.getSessionStorage()
    if (sessionStorage) {
      return sessionStorage[propertyName]
    }
    return null
  },
  removeLocalStorageItem (propertyName) { // 清除localStroage中指定key
    let localStorage = this.getLocalStorage()
    try {
      delete localStorage[propertyName]
      this.setLocalStorage(localStorage)
    } catch (e) {}
  },
  removSessionstroageItem (propertyName) { // 清除sessionstroage中指定key
    this.localStorage.removeItem(this.storageName)
    let sessionstroage = this.getSessionStorage()
    try {
      delete sessionstroage[propertyName]
      this.setSessionStorage(sessionstroage)
    } catch (e) {}
  },
  removeLocalStorage () { // 清除localStroage
    this.localStorage.removeItem(this.storageName)
  },
  removeSessionStorage () { // 清除sessionstroage
    this.sessionStorage.removeItem(this.storageName)
  }
}

window.storageName = Storage.storageName
export default Storage
