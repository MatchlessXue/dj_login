
// 判断是否空对象 不包含数组
export function isEmptyObject (o) {
  var name = true
  for (name in o) {
    return (name = false)
  }
  return name
}
export function isFalse (o) {
  if (o == '' || o == undefined || o == null || o == 'null' || o == 'undefined' || o == 0 || o == false || o == NaN) return true
  return false
}
// 判断是否为数组
export function isArray (_array) {
  return getObjectType(_array) == 'Array'
}

// 判断是否为对象
export function isObject (_obj) {
  return getObjectType(_obj) == 'Object'
}
/* 删除数组元素 */
export function removeArrayItem (arr, ele) {
  if (!isArray(ele)) {
    let index = arr.indexOf(ele)
    if (index > -1) {
      arr.splice(index, 1)
    }
  } else {
    ele.forEach(item => {
      let _index = arr.indexOf(item)
      if (_index > -1) {
        arr.splice(_index, 1)
      }
    })
  }

  return arr
}

// 判断对象类型
export function getObjectType (target_object) {
  return Object.prototype.toString.call(target_object).slice(8, -1)
}

// 深拷贝
export function deepCopy (obj) {
  if (typeof obj !== 'object') return
  var newObj = obj instanceof Array ? [] : {}
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key]
    }
  }
  return newObj
}

/**
 * @desc 日期格式化
 * @date 2018-02-10 16:15:03
 * @param {*} 要格式化的日期
 * @param {string} formate 'yyyy/MM/dd hh:mm:ss'
 * @return {string} x string return.
 */
export function dateFormat (date, fmt) {
  if (!date) return ''
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  let padLeftZero = function (str) {
    return ('00' + str).substr(str.length)
  }

  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

// 获取路由信息里的name属性值
export function getRouterName (routes) {
  let nameObj = {}

  function mapRoutes (arr) {
    arr &&
            arr.forEach((item, index) => {
              let { name, children } = item
              if (children && children instanceof Array && children.length > 0) {
                mapRoutes(children)
              } else {
                if (name) {
                  nameObj[name] = false
                }
              }
            })
  }
  mapRoutes(routes)
  return nameObj
}
/**
 * @desc 存储localStorage
 * @date 2018-02-10 16:10:45
 * @param {string} localStorage属性名
 * @param {*} localStorage属性值
 */
export const setStore = (name, content) => {
  if (!name) return
  content = JSON.stringify(content)
  window.localStorage.setItem(name, content)
}

/**
 * @desc 获取localStorage
 * @date 2018-02-10 16:12:17
 * @param {string} localStorage属性名
 * @return {*} localStorage属性值
 */
export const getStore = name => {
  if (!name) return
  let value = window.localStorage.getItem(name)
  value = JSON.parse(value)
  return value
}

/**
 * @desc 删除localStorage
 * @date 2018-02-10 16:13:39
 * @param {string} localStorage属性名
 */
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}

/**
 * @desc 数据分页
 * @date 2018-03-26 11:37:00
 * @param {Object} {page,rows,data}
 */
export const pagingData = options => {
  let { page, rows, data } = options
  page = parseInt(page)
  rows = parseInt(rows)
  if (page && page < 0) {
    page = 1
  }
  if (rows && rows < 0) {
    rows = 1
  }
  if (data && data instanceof Array && data.length > 0) {
    let start = (page - 1) * rows
    let end = page * rows
    let sliceData = data.slice(start, end)
    return sliceData
  }
  return []
}

/**
 * 拼接对象为请求字符串，导出使用
 * @param {Object} options - 对象
 */
export function exportDataFunc (options) {
  let { api, obj, webRoot = '/index.php' } = options
  let origin = window.location.origin
  const params = []

  Object.keys(obj).forEach(key => {
    let value = obj[key]
    // 如果值为undefined我们将其置空
    if (typeof value === 'undefined') {
      value = ''
    }
    // 对于需要编码的文本（比如说中文）我们要进行编码
    params.push([key, encodeURIComponent(value)].join('='))
  })
  let encodeParams = params.join('&')
  let url = `${origin}${webRoot}${api}?${encodeParams}`
  window.open(url)
}
/**
 * 获取浏览器视窗的大小，兼容性良好
 */
export const clientSize = () => {
  if (window.innerHeight !== undefined) {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  } else if (document.compatMode === 'CSS1Compat') {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    }
  } else {
    return {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    }
  }
}
/**
 * 节流
 * throttle函数接收两个参数
 * @params fn: 需要被延迟执行的函数;
 * @params interval: 延迟执行的时间;
 */

export const throttle = (fn, interval) => {
  var _self = fn // 保存需要被延迟执行的函数引用
  var timer // 计时器
  var firstTime = true // 是否第一次调用

  return function () {
    var args = arguments
    var _this = this

    if (firstTime) {
      // 如果是第一次调用, 不需要延迟执行
      _self.apply(_this, args)
      return (firstTime = false)
    }

    if (timer) {
      // 如果定时器还在, 说明前一次延迟执行还未完成
      return false
    }

    timer = setTimeout(function () {
      clearTimeout(timer)
      timer = null
      _self.apply(_this, args)
    }, interval || 500)
  }
}
export const addHandler = function (element, type, handler) {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false)
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, handler)
  } else {
    element['on' + type] = handler
  }
}
export const removeHandler = function (element, type, handler) {
  if (element.removeEventListener) {
    element.removeEventListener(type, handler, false)
  } else if (element.detachEvent) {
    element.detachEvent('on' + type, handler)
  } else {
    element['on' + type] = null
  }
}
// arr里 ["1","2"] ---》[1,2] ,obj里{a:'1',b:'2'}---》{a:1,b:2}
export const transStringInt = param => {
  let _arr = []; let _obj = {}
  if (isArray(param) && param.length) {
    param.forEach(element => {
      element && _arr.push(element - 0)
    })
    return _arr
  } else if (isObject(param)) {
    for (const key in param) {
      if (param.hasOwnProperty(key)) {
        _obj[key] = param[key] - 0
      }
    }
    return _obj
  } else {
    return param
  }
}

// 原生js 判断 class 是否存在
export function hasClass (elements, cName) {
  return !!elements.className.match(new RegExp('(\\s|^)' + cName + '(\\s|$)'))
}

// 原生添加class
export function addClass (elements, cName) {
  if (!hasClass(elements, cName)) {
    elements.className += ' ' + cName
  }
}

// 原生移除class
export function removeClass (elements, cName) {
  if (hasClass(elements, cName)) {
    elements.className = elements.className.replace(new RegExp('(\\s|^)' + cName + '(\\s|$)'), ' ')
  }
}

/**
 * @desc 时间段筛选分隔标识  例： 开始日期+空格+-+空格+结束日期
 * @date 2018-03-28 17:13:39
 * @param {Object} obj 传入的对象
 * @param {string} name name 要处理的对象的属性名
 * @return {Object} 返回新的对象
 */
export const changeDateRange = (obj, name) => {
  if (obj && JSON.stringify(obj) != '{}' && name) {
    let newObj = { ...obj }
    let arr = newObj[name] || []
    if (arr && arr instanceof Array) {
      newObj[name] = arr.join(' - ')
      return newObj
    }
  }
  return null
}

/**
 * @desc 多选参数全部以逗号分隔  例：  1,2,3 或者 ua,cn
 * @date 2018-03-28 16:13:39
 * @param {Object} obj 传入的对象
 * @param {array|string} nameArr 要格式的属性名
 * @return {Object} 返回新的对象
 */
export const changeMultipleData = (obj, nameArr) => {
  if (obj && JSON.stringify(obj) != '{}' && nameArr) {
    let newObj = {
      ...obj
    }
    if (typeof nameArr === 'string') {
      let arr = newObj[name] || []
      if (arr && arr instanceof Array) {
        newObj[name] = arr.join(',')
        return newObj
      }
    }
    if (nameArr instanceof Array) {
      nameArr.forEach(name => {
        let arr = newObj[name] || []
        if (arr && arr instanceof Array) {
          newObj[name] = arr.join(',')
        }
      })
      return newObj
    }
  }
  return null
}

/**
 * 计算元素距页面顶部距离的方法
 * @param {any} dom
 * @returns {number} 返回距离顶部的距离
 */
export const getElementTop = dom => {
  if (!dom) {
    return
  }
  // 获得当前元素距父元素顶部的距离，保存在变量top中
  var top = dom.offsetTop
  // 将当前元素的相对定位父元素对象保存在变量curr中
  var curr = dom.offsetParent
  // 循环，只要curr不等于null，就继续获得父元素的父元素
  while (curr != null) {
    //    再次获得curr距它的父元素顶部的距离，累加到top中
    top += curr.offsetTop
    //    将curr再设置为curr的相对定位的父元素
    curr = curr.offsetParent
  }
  return top
}
/**
 * 获取日期选择器daterange默认值
 *
 * @param {number} relateDate
 * @returns {Array} 返回daterange数组
 */
export const getDefaultRange = (relateDate = 0, from = 0) => {
  relateDate = Number(relateDate)
  if (isNaN(relateDate)) {
    return
  }
  let today = new Date()
  let nowValue = today.getTime() + 3600 * 1000 * 24 * from
  let now = dateFormat(new Date(nowValue), 'yyyy-MM-dd')
  let value = today.getTime() + 3600 * 1000 * 24 * relateDate
  let otherday = dateFormat(new Date(value), 'yyyy-MM-dd')
  if (relateDate > 0) {
    return [now, otherday]
  } else {
    return [otherday, now]
  }
}
/**
 * 去重
 *
 * @param {any} arr
 * @returns {Array}
 */
export const unique = arr => {
  var result = []
  var obj = {}
  for (var i = 0; i < arr.length; i++) {
    if (!obj[arr[i]]) {
      result.push(arr[i])
      obj[arr[i]] = true
    }
  }
  return result
}

/**
 * 去掉数组中为空的元素  包含  null，'',undefined
 *
 * @param {any} arr
 * @returns {Array}
 */
export const reduceEmptyInArray = function (arr) {
  var result = []
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == undefined || arr[i] + '' == 'null' || arr[i] + '' == '') {
    } else {
      result.push(arr[i])
    }
  }
  return result
}
/**
 * 判断是否字符串
 *
 * @param {any} obj
 * @returns
 */
export const isNumber = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

/**
 * 排序  支持 数组中{} 数字  字符串
 * @param {any} name
 * @returns
 */
export const sortBy = function (name) {
  return function (o, p) {
    if (typeof o === 'object' && typeof p === 'object' && o && p) {
      var a = o[name]
      var b = p[name]
      if ((name == 'times' || name == 'click_times' || name == 'active_times' || name == 'postback_times' || name == 'phone' || name == 'mobile')) {
        return Number(a) === Number(b) ? 0 : Number(a) > Number(b) ? 1 : -1
      }
      if (isNumber(a || '0') && isNumber(b || '0')) {
        return Number(a) === Number(b) ? 0 : Number(a) > Number(b) ? 1 : -1
      }
      var _a = a ? String(a) : ''
      var _b = b ? String(b) : ''
      return _a == _b ? 0 : _a > _b ? 1 : -1
    }

    if (isNumber(o || '0') && isNumber(p || '0')) {
      return Number(o) === Number(p) ? 0 : Number(o) > Number(p) ? 1 : -1
    }
    if (typeof o === 'string' && typeof p === 'string') {
      return String(o || '') === String(p || '') ? 0 : String(o || '') > String(p || '') ? 1 : -1
    }
  }
}

/**
 * 浏览器执行复制到粘贴版
 * @param {String} text  要复制的内容
 * @param {Function} success  复制成功的回调
 * @param {Function} error  复制失败的回调
 */
export const copyUtil = (text, success, error) => {
  let iscopy = false
  let mydata = document.createElement('textarea')
  mydata.style.position = 'absolute'
  mydata.style.left = '-10000px'
  mydata.style.top = '-10000px'
  mydata.setAttribute('id', 'mydata_id')
  mydata.value = text
  document.body.appendChild(mydata)
  mydata.select()
  try {
    iscopy = document.execCommand('copy', false, null)
  } catch (e) {
    console.log(e)
    iscopy = false
  }
  document.body.removeChild(mydata)
  if (iscopy) {
    //   this.$message.success("Copy Success.");
    success()
  } else {
    // this.$message.error("Copy Fail.");
    error()
  }
}

Array.prototype.indexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i
  }
  return -1
}

Array.prototype.remove = function (val) {
  var index = this.indexOf(val)
  if (index > -1) {
    this.splice(index, 1)
  }
}
