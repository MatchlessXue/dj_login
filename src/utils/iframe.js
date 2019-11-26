import CONFIG from '@/config'
import lstore from '@/utils/lstore'
class Dep { // 订阅池
  constructor (name) {
    this.id = new Date() // 这里简单的运用时间戳做订阅池的ID
    this.subs = [] // 该事件下被订阅对象的集合
  }
  defined () { // 添加订阅者
    Dep.watch.add(this)
  }
  notify () { // 通知订阅者有变化
    this.subs.forEach((e, i) => {
      if (typeof e.update === 'function') {
        try {
          e.update.apply(e) // 触发订阅者更新函数
        } catch (err) {
          console.warr(err)
        }
      }
    })
  }
}
Dep.watch = null

class Watch {
  constructor (name, fn) {
    this.name = name // 订阅消息的名称
    this.id = new Date() // 这里简单的运用时间戳做订阅者的ID
    this.callBack = fn // 订阅消息发送改变时->订阅者执行的回调函数
  }
  add (dep) { // 将订阅者放入dep订阅池
    dep.subs.push(this)
  }
  update () { // 将订阅者更新方法
    let cb = this.callBack // 赋值为了不改变函数内调用的this
    cb(this.name)
  }
}

const addHistoryMethod = (function () {
  let historyDep = new Dep()
  return function (name, elwin) {
    if (name === 'historychange') {
      return function (name, fn) {
        let event = new Watch(name, fn)
        Dep.watch = event
        historyDep.defined()
        Dep.watch = null // 置空供下一个订阅者使用
      }
    } else if (name === 'pushState' || name === 'replaceState') {
      let _history = elwin.history || history
      let method = _history[name]
      return function () {
        method.apply(_history, arguments)
        historyDep.notify()
      }
    }
  }
}())

const urlChangeMethod = (el, type, callback) => {
  let href = el.contentWindow.location.href
  let urlArr = href.split(window.location.origin)[1].split('#')
  let url = urlArr[0].split('?')[0] + '#' + urlArr[1]
  let o = {
    url: url,
    time: +new Date() + 1000 * 60 * 60
  }
  console.log(`%c>>> ${type}:${href}`, 'color:#00f')
  lstore.set(CONFIG.accessRecord, o)
  callback(getMenuActiveIndex(url))
}

export const getMenuActiveIndex = (url) => {
  // 通过多层循环找到 index
  let menuArr = lstore.get(CONFIG.menuTree)
  let res = ''
  for (let i in menuArr) {
    let iItem = menuArr[i]
    let ichild = iItem.childList
    if (iItem.visible === '0' && ichild.length !== 0) {
      for (let ii in ichild) {
        let iiItem = ichild[ii]
        let iiChild = iiItem.childList
        if (iiItem.visible === '0' && iiChild.length !== 0) {
          for (let iii in iiChild) {
            let iiiItem = iiChild[iii]
            if (url.indexOf(iiiItem.url) !== -1) {
              res = `${i}-${ii}-${iii}`
            }
          }
        } else {
          if (url.indexOf(iiItem.url) !== -1) {
            res = `${i}-${ii}`
          }
        }
      }
    } else {
      if (url.indexOf(iItem.url) !== -1) {
        res = `${i}`
      }
    }
  }
  return res
}

export default (el, callback) => {
  // console.log(el)
  el.contentWindow.addHistoryListener = addHistoryMethod('historychange', el.contentWindow)
  el.contentWindow.history.pushState = addHistoryMethod('pushState', el.contentWindow)
  el.contentWindow.history.replaceState = addHistoryMethod('replaceState', el.contentWindow)
  el.contentWindow.addEventListener('hashchange', () => {
    urlChangeMethod(el, 'hash', callback)
  })
  el.contentWindow.addHistoryListener('history', function () {
    urlChangeMethod(el, 'history', callback)
  })
  el.addEventListener('load', () => {
    urlChangeMethod(el, 'load', callback)
  })
}
