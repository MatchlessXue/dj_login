/* eslint-disable */
import config from '../_base'
const _urlPrefix = config.urlPrefix

var urlPrefix = {
  // URL前缀
  prefix: (function (_uri) {
    var _uri_path = {}
    for (var key in _uri) {
      _uri_path[key] = getRequestPrefix(_uri[key])
    }
    return _uri_path
  })(_urlPrefix),
  /** * URL后缀 */
  suffix: '' // .json
}

/** 获取基于网站根目录的前缀路径 */
function getRequestPrefix (path, root) {
  var rootPath = config.proPath
  root = root || location.protocol + '//' + location.hostname + ':' + location.port + '/'
  return root + (rootPath ? rootPath + '/' : '') + (path ? path + '/' : '')
}

/** 获取Ajax完整URL */
export function getAjaxUrl (url, webType, suffix) {
  // 绝对地址直接返回
  if (url.indexOf('http://') != -1) {
    return url
  }
  // 目标地址的后缀名与URL的后缀名比对，若一致则直接返回，不进行二次封装
  if (suffix && url.lastIndexOf('.' + suffix) === url.length - ('.' + suffix).length) {
    return url
  }
  var prefix = urlPrefix.prefix
  webType = webType || 'root'
  suffix = suffix || urlPrefix.suffix
  if (url.indexOf('/') === 0) {
    url = url.slice(1)
  }
  return prefix[webType] + url + suffix
}
