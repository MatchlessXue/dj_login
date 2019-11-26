const getSearchObj = baseUrl => {
  let searchObj = {}
  if (baseUrl.indexOf('?') !== -1) {
    let searchArr = baseUrl.split('?')[1].split('&')
    for (let i of searchArr) {
      let temp = i.split('=')
      if (temp.length !== 1) {
        searchObj[temp[0]] = temp[1]
      }
    }
  }
  return searchObj
}

const isEmptyObj = obj => {
  for (let i in obj) {
    return false
  }
  return true
}

const objToSearch = obj => {
  let res = ''
  if (!isEmptyObj(obj)) {
    res += '?'
    Object.keys(obj).forEach((key) => {
      res += `${key}=${obj[key]}&`
    })
    res = res.substring(0, res.length - 1)
  }
  return res
}

export default (url, target) => {
  target = target || 'mainframe'
  url = url || '/login/#/home'
  let urlArr = url.split('#')
  let baseUrl = urlArr[0]
  let urlFix = baseUrl.split('?')[0]
  let hash = urlArr[1] ? urlArr[1] : ''
  let searchObj = getSearchObj(baseUrl)
  searchObj._ = new Date().getTime()
  let searchStr = objToSearch(searchObj)
  let htmlurl = urlFix + searchStr + '#' + hash
  if (urlFix + '#' + hash !== '/login/#/frame') {
    console.log('查看url', htmlurl, target)
    window.open(htmlurl, target)
  }
}
