/**
 * ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
 * 这个路由表是除了登录  404之外的全部静态路由表，是前端和数据库共同维护的维护的，如果有name  和 id  的改动   ，一定要通知PHP更新数据库
 * ！！！！！！！！！！！！！！！！！！！！！！！！！！！
 */
import { Loading } from 'element-ui'
var spinRoute = {
  unique: null,
  show () {
    let opt = { target: document.querySelector('.is-vertical'), text: '' }
    if (!this.unique) this.unique = Loading.service(opt)
  },
  resolve (resolve) {
    var that = this
    return function (component) {
      if (that.unique) {
        that.unique.close()
        that.unique = null
      }
      resolve(component)
    }
  }
}
export const myRouerMap = [
]
