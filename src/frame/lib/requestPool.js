/* eslint-disable */
/**
 * todo
 * 后续扩展 （数据实时性不太高时）
 * 1. 池中保存请求数据
 * 2. 每个请求有效时间，在改请求时效内，池中保存请求数据，不再向后端请求。（考虑内存影响）
 * 3. 假如支持文件读写生成临时文件，如果在时间有效期内发出请求，读取文件，文件不存在去后端请求。
 * （实时性高的）
 * 在查看页面时，页面默认发出请求，更新池中数据。不仅包含用户默认显示页面，也可以主动更新数据
 */

let _Pool = {}
/**
 * 获取整个池
 * @returns {Obejct}
 */
function _getPool () {
  return _Pool
}
/**
 * 清空整个池
 */
function _clearPool () {
  _Pool = {}
}
/**
 * 创建一个请求对象
 * @returns {object}
 */
function _initOneRequest (_isAbort, _url, _param, _cancelToken) {
  return {
    isAbort: _isAbort || 0, // >0  为请求状态，<0  为请求异常  0 为正常结束
    url: _url,
    param: _param,
    cancelToken: _cancelToken
  }
}
/**
 * 查找 池中 页面中的请求
 * @param {any} _url
 * @returns
 */
function _findRequestListByPage (_pageuri) {
  let _pool = _getPool()
  if (_pool) {
    let _req = null
    let _spool = _pool[_pageuri]
    return _spool && _spool.length ? _spool : null
  }
  return null
}

/**
 * 查找 池中 页面中的某个请求
 * @param {any} _url
 * @returns
 */
function _findRequestInPage (_pageuri, _url) {
  let _pool = _findRequestListByPage(_pageuri)
  if (_pool) {
    let _req = null
    _pool.forEach(function (t, i) {
      if (t['url'] == _url) {
        _req = t
      }
    })
    return _req || null
  }
  return null
}

/**
 * 池中新增请求
 * @param {any} _opt
 * @returns
 */
export const addRequest = function (_opt) {
  if (!_opt.url) {
    console.error('Url is not exits')
    return
  }
  let _pageuri = _opt.pageuri
  let _url = _opt.url
  let _pools = _getPool()
  if (!_pageuri) {
    return
  }
  let _pool = _findRequestListByPage(_pageuri)
  if (_pool) {
    let _req = _findRequestInPage(_pageuri, _url)
    if (_req) {
      _stopAbort(_req)
      _req['isAbort'] = 1
      _req['url'] = _opt.url
      _req['param'] = _opt.param || ''
      _req['cancelToken'] = _opt.cancelToken || ''
    } else {
      let _s_pool = _initOneRequest(_opt.isAbort, _opt.url, _opt.param, _opt.cancelToken)
      _pools[_pageuri].push(_s_pool)
    }
  } else {
    let _s_pool = _initOneRequest(_opt.isAbort, _opt.url, _opt.param, _opt.cancelToken)
    _pools[_pageuri] = [_s_pool]
  }
}
/**
 * 请求是否终止
 * @param {any} _url
 * @returns
 */
export const hasRequestStop = function (_pageuri, _url) {
  let _s_pool = _findRequestInPage(_pageuri, _url)
  if (_s_pool && !_s_pool.isAbort) {
    return true
  }
  return false
}
/**
 * 更新请求状态
 * @param {any} _url
 * @param {any} _status
 */
export const updateStatus = function (_pageuri, _url, _status) {
  let _s_pool = _findRequestInPage(_pageuri, _url)
  if (_s_pool) {
    _s_pool['isAbort'] = _status
  }
}

function _stopAbort (t) {
  if (t['isAbort'] > 0) {
    t['cancelToken'] ? t['cancelToken'].cancel(405) : null
    t['isAbort'] = 0
  }
}
/**
 * 终止请求
 * @param {any} _url
 */
function _stopStatus (_pageuri) {
  let _pool = _getPool()
  if (_pool) {
    for (let k in _pool) {
      if (k !== _pageuri) {
        let _spool = _pool[k] || []
        _spool.forEach(function (t, i) {
          _stopAbort(t)
        })
      }
    }
  }
}

export const stopRequest = function (_pageuri) {
  _stopStatus(_pageuri)
}
