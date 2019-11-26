// vue 常用方法
import { isArray } from './util'

export default {
  // 适应$aitool_开头标记为工具方法的使用
  install: function (Vue, options) {
    /**
    * 注册全局指令
    * 适用于数组 字符串在表格中的展示，
        * * 用法场景  当作普通函数使用
    * @param {any} cellValue
    */
    Vue.filter('showblanktablevalue', function (cellValue) {
      // 返回处理后的值
      if (isArray(cellValue)) {
        return cellValue.length ? cellValue.toString() : '-'
      } else if (cellValue === '' || cellValue === undefined || cellValue === null || cellValue === 'null' || cellValue === 'undefined' || isNaN(cellValue)) {
        return '-'
      }
      return cellValue
    })
  }
}
