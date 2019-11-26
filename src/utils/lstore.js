/*
  本文件是 FungLeo 模仿开源的 stroe.js 的语法，写的一个简易的 localStorage 操作方法类
  方便在项目中简单的使用本地存储，因为只考虑 chrome\ firefox 等现代浏览器，因此未做其他兼容处理
  使用方法以及原理都十分简单，因此不做详细注释
  2019年05月08日
*/
export default {
  get (key) {
    let res = window.localStorage.getItem(key)
    try {
      let o = JSON.parse(res)
      return o
    } catch {
      if (res === 'true') {
        return true
      } else if (res === 'false') {
        return false
      } else if (!isNaN(+res)) {
        return +res
      } else {
        return res
      }
    }
  },
  set (key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  },
  remove (key) {
    window.localStorage.removeItem(key)
  },
  clear () {
    window.localStorage.clear()
  }
}