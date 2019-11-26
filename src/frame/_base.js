
export default {
  proPath: '', // php/public

  /**
     * @property    {Object}
     * key
     * value 请求方法名
     */
  URI: {
    LOGIN: 'login',
    GAMELIST: 'gamelist'
  },
  /**
     * @property    {Object}
     * key 路径类型
     * value 请求路径
     */
  urlPrefix: {
    captcha: 'index.php/showCaptcha',
    login: 'index.php',
    order: 'api/order/waybill/track',
    root: 'api/authcenter/user',
    role: 'api/authcenter/role',
    menu: 'api/authcenter/menu',
    api: 'api',
    accounts: 'api/authcenter/accounts'
  },
  /**
     * @property    {Object}
     * key
     * value 静态属性值
     */
  staticProps: {
    tableLoading: false,
    submitBtnLoading: false,
    searchBtnLoading: false,
    submitBtnConfirmLoading: false,
    priceFormat: '$ #,###.000',
    percentFormat: '#,###.00%',
    numberFormat: '#,###',
    paging: {
      pageno: 1,
      pagesize: 20,
      pagetotal: 0
    }
  },
  loadingTxt: {
    zh_CN: '数据加载中，请稍后...',
    zh_TW: '資料載入中，請稍候...',
    en: 'Data Loading...'
  },
  errorCodeMap: {
    '100': '操作失败',
    '114': '网络异常',
    '115': '系统内部错误',
    '401': '登录异常',
    '400': '请求错误',
    '403': '拒绝访问',
    '408': '请求超时'
  },
  /**
     * @property    {string}
     * 语言设置
     */
  language: sessionStorage.language || navigator.language || 'en',
  /**
     * @property    {Number}
     * 前端Seesion 超时设置 [分钟]
     */
  sessionTimeout: 1440,
  /**
     * @property    {Number}
     * 前端 请求 超时设置 [分钟]
     */
  requestTimeout: 3
}
