import config from './_base'
// vue 添加全局属性
export default {
  // 适应$aitool_开头标记为工具方法的使用
  install: function (Vue, options) {
    // Vue.prototype.httploading = false;
    Vue.mixin({
      data () {
        var _data = Object.assign({}, config.staticProps)
        _data['URI'] = config.URI
        return _data
      },
      methods: {
        // 从后台获取Affiliate 下拉框需要的静态数据
        getAffiliateSelectData (callback) {
          this._api({
            url: 'affiliate',
            webType: 'root'
          }).then(res => {
            if (!res.errorcode) {
              callback && callback(res.data)
            } else {
              this.$message.error(res.message)
            }
          }, err => {
            console.log(err)
          }).catch(err => {
            console.log(err)
          })
        }
      }
    })
  }
}
