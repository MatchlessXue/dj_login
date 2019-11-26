import { isArray, dateFormat } from './util'
import { formatNumber } from './lib/numberFormatter'
import moment from 'moment'
export default {
  // 适应$aitool_开头标记为工具方法的使用
  install: function (Vue, options) {
    /**
     * desc 格式化数字千分位及位数补齐
     * @param {number} _num  格式化数字
     * @param {string} _format 格式化的格式（'#,###.00%'）
     */
    Vue.prototype.mtd_numberFomatter = function (_num, _format = '#,###') {
      var _number = Number(_num)
      var numString = _num.toString()
      if (isNaN(_number) || numString.replace(/\s+/gi, '') === '' || numString === 'null' || numString === 'undefined') {
        return '-'
      }
      // 判断前缀
      return formatNumber(numString, { format: _format })
    }

    Vue.prototype.mtd_getDicts = function (dict, value) {
      return Vue.prototype.getDictValue(dict, value)
    }
    Vue.prototype.mtd_dateFomatter = function (date, fmt) {
      // 判断前缀

      return dateFormat(date, fmt)
    }
    Vue.prototype.mtd_getLastMonth = function () {
      return [moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD'), moment().subtract(1, 'months').endOf('month').format('yyyy-MM-dd')]
    }
    Vue.prototype.mtd_getLastMonthToNow = function () {
      return [moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
    }
    /*
    修复 加法 损失精度
     */
    Vue.prototype.numAdd = function (arg1, arg2) {
      if (isNaN(arg1)) {
        arg1 = 0
      }
      if (isNaN(arg2)) {
        arg2 = 0
      }
      arg1 = Number(arg1)
      arg2 = Number(arg2)
      var r1, r2, m, c
      try {
        r1 = arg1.toString().split('.')[1].length
      } catch (e) {
        r1 = 0
      }
      try {
        r2 = arg2.toString().split('.')[1].length
      } catch (e) {
        r2 = 0
      }
      c = Math.abs(r1 - r2)
      m = Math.pow(10, Math.max(r1, r2))
      if (c > 0) {
        var cm = Math.pow(10, c)
        if (r1 > r2) {
          arg1 = Number(arg1.toString().replace('.', ''))
          arg2 = Number(arg2.toString().replace('.', '')) * cm
        } else {
          arg1 = Number(arg1.toString().replace('.', '')) * cm
          arg2 = Number(arg2.toString().replace('.', ''))
        }
      } else {
        arg1 = Number(arg1.toString().replace('.', ''))
        arg2 = Number(arg2.toString().replace('.', ''))
      }
      return (arg1 + arg2) / m
    }
    /*
     减法修复
      */
    Vue.prototype.numSub = function (arg1, arg2) {
      if (isNaN(arg1)) {
        arg1 = 0
      }
      if (isNaN(arg2)) {
        arg2 = 0
      }
      arg1 = Number(arg1)
      arg2 = Number(arg2)

      var r1, r2, m, n
      try {
        r1 = arg1.toString().split('.')[1].length
      } catch (e) {
        r1 = 0
      }
      try {
        r2 = arg2.toString().split('.')[1].length
      } catch (e) {
        r2 = 0
      }
      m = Math.pow(10, Math.max(r1, r2)) // last modify by deeka //动态控制精度长度
      n = (r1 >= r2) ? r1 : r2
      return ((arg1 * m - arg2 * m) / m).toFixed(n)
    }
    /**
     * 表格中的formatter属性用到的方法，不用传参
     * 用法-------------- el-table-column 标签上 加 :formatter="returnBlank"
     */
    Vue.prototype.returnBlank = function (row, column, cellValue, index) {
      if (isArray(cellValue)) {
        return cellValue.length ? cellValue.toString() : '-'
      } else if (cellValue === '' || cellValue === undefined || cellValue === null || cellValue === 'null' || cellValue === 'undefined' || isNaN(cellValue)) {
        return '-'
      }
      return cellValue
    }
  }
}
