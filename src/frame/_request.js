import config from './_base'
import axios from 'axios'
import { getObjectType } from './util'

const _timeout = config.requestTimeout * 60 * 1000
const _urlPrefix = config.urlPrefix

let reqMessage = null

let urlPrefix = {
  /**
  * @property    {Object}    prefix
  * URL前缀
  * @property    {string}    prefix.root     根目录
  */
  prefix: (function (_uri) {
    let uriPath = {}
    for (let key in _uri) {
      uriPath[key] = getRequestPrefix(_uri[key])
    }
    return uriPath
  })(_urlPrefix),
  /**
  * @property    {string}    suffix
  * URL后缀
  */
  suffix: '' // .json
}

/**
* @method
* 获取请求URL前缀
* @private
* @param   {string}    path    前缀路径
* @param   {string}    root    根目录
*
* @return  {string}    基于网站根目录的前缀路径
*/
function getRequestPrefix (path, root) {
  let rootPath = config.proPath
  root = root || location.protocol + '//' + location.hostname + ':' + location.port + '/'
  return root + (rootPath ? rootPath + '/' : '') + (path ? path + '/' : '')
}

/**
* @method
* 获取Ajax完整URL。
* @private
* @param   {string}    url                 请求基准URL
* @param   {string}    [webType='root']     请求类型
* @param   {string}    [suffix='json']     后缀名称
*
* @return  {string}    请求的完整URL
*/
function getAjaxUrl (url, webType, suffix) {
  // 绝对地址直接返回
  if (url.indexOf('http://') !== -1) {
    return url
  }
  // 目标地址的后缀名与URL的后缀名比对，若一致则直接返回，不进行二次封装
  if (suffix && url.lastIndexOf('.' + suffix) === url.length - ('.' + suffix).length) {
    return url
  }
  let prefix = urlPrefix.prefix
  webType = webType || 'root'
  suffix = suffix || urlPrefix.suffix
  if (url.indexOf('/') === 0) {
    url = url.slice(1)
  }
  return prefix[webType] + url + suffix
}

// 判断 session 失效
function isSessionTimeout (code) {
  // 会话是否过期
  if (code === 401) {
    console.warn('Code is ' + code + ',Please Call youself')
    // sessionStorage.removeItem("UUIDSEESION");
    return true
  }
  return false
}

// 跳到登录界面
function routerToLogin (code, callback) {
  // 跳转到登录页面
  let that = this
  // console.log(document.cookie);
  if (code === 401) {
    if (!that.isRouterFromDomain) {
      // showMessage.call(that, 'error', '登录失效,请重新登录.')
    }
    that.$router.push('/login')
  }
}
// promise 请求
const getRequestConfig = function (options) {
  // let CancelToken = axios.CancelToken
  let _url = getAjaxUrl(options.url, options.webType, options.dataType)
  let _param = {
    method: options.type || 'post',
    url: _url,
    timeout: _timeout,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    params: options.params,
    data: options.params,
    cancelToken: ''
  }
  if (!options.urlAppend) {
    delete _param.data
  } else {
    delete _param.params
  }
  return _param
}

// 异步请求处理
let syncRequest = function (_item, resolve, reject) {
  let that = this
  let _config = getRequestConfig(_item)
  let cancelToken = axios.CancelToken
  let source = _item.CancelToken || cancelToken.source()
  // let _pageuri = location.href
  let errorRequest = _item.errorFuc ? _item.errorFunc : errRequest
  // stopRequest(_pageuri);
  // addRequest({pageuri:_pageuri,url:_config.url,param:_config.data,cancelToken:source});
  _config['cancelToken'] = source.token
  axios(_config).then(function (response) {
    const _data = response.data
    // updateStatus(_pageuri,_config.url,0);
    if (!_data) {
      reject(_data || '') // 错误回调
    }
    if (_data.code) {
      // 检查会话是否过期
      if (isSessionTimeout(_data.code)) {
        routerToLogin.call(that, _data.code, function () {
          reject(_data)// 其实不应该报错的
        })
        return
      }
      if (_item.catchError) {
        reject(_data)
        return
      }
      // if (config['errorCodeMap'][_data.code]) {
      // todo 做额外判断  如何做到业务页面覆盖
      // showMessage.call(that, 'error', _data.message)
      // }
      reject(_data)
    } else {
      resolve(_data)
    }
  }).catch(function (error) {
    if (isSessionTimeout(error.response.status)) {
      routerToLogin.call(that, error.response.status, function () {
        reject({})// 其实不应该报错的
      })
      return
    }
    // updateStatus(_config.url,-1);
    // 网络异常，及请求中断
    errorRequest.call(that, error, reject)
  })
}

// 请求异常处理 不区分同步异步
const errRequest = function (error, reject) {
  let that = this
  error.status = error.response.status
  if (error.message && error.message === 405) {
    reject({ code: 405 })
    return
  } else if (!error.response) {
    showMessage.call(that, 'error', '请求超时，请稍后尝试')
  } else {
    let msg = error.response.data.message
    switch (error.status) {
      case 504:
        showMessage.call(that, 'error', msg || '网关错误，请稍后尝试')
        break
      case 503:
        // showMessage.call(that, 'error', 'Service Unavailable')
        break
      case 500:
        showMessage.call(that, 'error', msg || '服务器内部错误')
        break
      case 429:
        break
      case 405:
        break
      case 404:
        break
      case 403:
        break
      case 400:
        break
      default:
        // showMessage.call(that, 'error', '登录超时，请重新登录')
    }
  }
  reject(error)
}

function showMessage (type, msg, time) {
  type = type || 'info'
  msg = msg || ''
  time = time || 5
  if (reqMessage) {
    reqMessage.close()
  }
  reqMessage = this.$message({ message: msg, type: type, iconClass: '', duration: time * 1000 })
}

/**
* 添加后台token
* @param {any} config
* @returns
*/
const getToken = function (config) {
  // 如果存在token
  // if (document.cookie){
  //     config.headers['Set-Cookie'] = document.cookie;
  // }
  return config
}
// 添加请求拦截器
axios.interceptors.request.use(getToken, function (error) {
  // 当出现请求错误是做一些事
  return Promise.reject(error)
})
axios.interceptors.response.use(function (response) {
  // if (response.headers.authorization){
  //     window.localStorage.setItem('access_token',response.headers.authorization)
  // }
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
// vue 请求插件开发
export default {
  install: function (Vue, options) {
    // var _timeout = 3000
    let loadingInstance = ''

    Vue.prototype.$http = axios

    Vue.prototype._api = function (options, callback) {
      let that = this
      // var _timeout = config.requestTimeout * 60 * 1000
      // var _isloading = !!options.isloading
      options.type = options.type ? options.type.toUpperCase() : 'POST'
      options.params = typeof options.params === 'undefined' ? {} : options.params
      // loadingInstance = getLoading(options.loadingtype,this);

      // 并发处理 TODO
      // var _concurrent = []
      let type = getObjectType(options)
      if (type === 'Object') {
        // 单个请求
        return new Promise(function (resolve, reject) {
          syncRequest.call(that, options, resolve, reject, loadingInstance)
        })
      } else {
        return new Promise(function (resolve, reject) {
          reject(new Error('Request error'))
        })
      }
    }
    // 添加实例方法
    Vue.prototype._httpGetUrl = function (url, webType, suffix) {
      return getAjaxUrl(url, webType, suffix)
    }
    // 获取codemap映射
    Vue.prototype._httpErrorCodeMap = function (code) {
      return config.errorCodeMap[code]
    }

    /**
         * @description 导出文件
         * @param {url:'url地址',webType:"url类型",params:"参数"} opt
         */
    Vue.prototype._httpExportDataForm = function (opt) {
      var _url = getAjaxUrl(opt.url, opt.webType, '')

      var FormEleOld = document.getElementById('ExportDataFormID')
      var FormEle = FormEleOld || document.createElement('form')
      if (!FormEleOld) {
        FormEle.id = 'ExportDataFormID'
      }
      FormEle.target = opt.target || '_blank'
      FormEle.action = _url
      FormEle.method = opt.method || 'post'
      FormEle.innerHTML = ''
      for (var key in opt.params) {
        if (opt.params.hasOwnProperty(key)) {
          var input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = opt.params[key]
          FormEle.appendChild(input)
        }
      }

      if (window.localStorage.getItem('access_token')) {
        var elInput = document.createElement('input')
        elInput.type = 'hidden'
        elInput.name = 'token'
        elInput.value = window.localStorage.getItem('access_token').substring(6)
        FormEle.appendChild(elInput)
      }

      if (!FormEleOld) {
        document.body.appendChild(FormEle)
      }
      FormEle.submit()
    }
  }
}
