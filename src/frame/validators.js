/* eslint-disable */
import { isFalse } from './util.js'
/**
 * 判断多个offer id逗号隔开   为数字  形式
 *
 * @param {any} rule
 * @param {any} value
 * @param {any} callback
 */
export const validateIdSplit = (rule, value, callback) => {
  if (value === '' || value === null) {
    callback()
  } else {
    const _reg = /^[\d,]*[\d]$/ig
    if (!_reg.test(value)) {
      callback(new Error('Please use a comma to separate it'))
    } else {
      callback()
    }
  }
}
export const validateIdSplitRequire = (rule, value, callback) => {
  if (value === '' || value === null) {
		 callback(new Error('Required'))
  } else {
    const _reg = /^[\d,]*[\d]$/ig
    if (!_reg.test(value)) {
      callback(new Error('Please use a comma to separate it'))
    } else {
      callback()
    }
  }
}

/**
 * 判断包名，以逗号隔开  不限制数字或者字母形式
 *
 * @param {any} rule
 * @param {any} value
 * @param {any} callback
 * @returns
 */
export const validatePackageSplit = (rule, value, callback) => {
  if (value === '') {
    callback()
  } else {
    const _reg = /^[\w\.,]*[\w\.]$/ig
    if (!_reg.test(value)) {
      return callback(new Error('Please use a comma to separate it'))
    }
    callback()
  }
}

/**
 * 正整数判断 【限制 0-100】
 *
 * @param {any} rule
 * @param {any} value
 * @param {any} callback
 * @returns
 */
export const validatorNumberRange1_100 = (rule, value, callback) => {
  if (value == '') {
    return callback()
  }
  if (!/^[0-9]*$/ig.test(value)) {
    callback(new Error('Please input positive integer'))
  } else {
    if (value < 0 || value > 100) {
      callback(new Error('Please input 0-100'))
    } else {
      callback()
    }
  }
}

/**
 * 正整数判断 【限制 0-300】
 *
 * @param {any} rule
 * @param {any} value
 * @param {any} callback
 * @returns
 */
export const validatorNumberRange1_255 = (rule, value, callback) => {
  if (value == '') {
    return callback()
  }
  let reg = /^\d+(\.\d{1,2})?$/
  if (value + '' && !reg.test(value + '')) {
    // callback(new Error("Please input positive integer"));
    callback(new Error('The format is incorrect.'))
  } else {
    if (value < 0 || value > 255) {
      callback(new Error('Please input 0-255'))
    } else {
      callback()
    }
  }
}

//

/**
 * 正数判断 【使用price 限制1-10000】
 * @param {any} rule
 * @param {any} value
 * @param {any} callback
 * @returns
 */
export const validatorNumberPositive = (rule, value, callback) => {
  // if(!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/ig.test(value + '')) {
  if (!Number(value) > 0) {
    callback(new Error('Please input Positive.'))
  } else {
    if (value - 0 < 10000 || value - 0 > 0) {
      return callback()
    } else {
      return callback(new Error('Please Limited 1 - 10000.'))
    }
  }
}
/**
 * 正数判断 【使用price 限制1-10000】
 * @param {any} rule
 * @param {any} value
 * @param {any} callback
 * @returns
 */

/**
 * 正整数 验证【不能为空】
 * @param {any} rule
 * @param {any} value
 * @param {any} callback
 * @returns
 */
export const validatorPositiveInteger = (rule, value, callback) => {
  if (!(value + '')) {
    return callback(new Error('Required'))
  }
  let reg = /^[1-9](\d+)?$/
  if ((value + '') && !reg.test(value + '')) {
    callback(new Error('The format is incorrect.'))
  } else {
    callback()
  }
}

/**
 * 正整数 【为空则不验证】
 * @param {any} rule
 * @param {any} value
 * @param {any} callback
 * @returns
 */

export const validatorPositiveIntegerNotRequired = (rule, value, callback) => {
  if (value == undefined) {
    return callback()
  }
  if (!(value + '')) {
    return callback()
  }
  let reg = /^[1-9](\d+)?$/
  if ((value + '') && !reg.test(value + '')) {
    callback(new Error('The format is incorrect.'))
  } else {
    callback()
  }
}
/**
 *  把 ips 按逗号拆成 IP 数组，分别进行验证
 *  every 表示每个 ip 验证通过才算通过
 * @param {any} ips
 * @returns
 */
const testIpList = function (ips) {
  // 把 ips 按逗号拆成 IP 数组，分别进行验证
  // every 表示每个 ip 验证通过才算通过
  return ips.split('#')
    .every(ip => {
      // 把每个 IP 拆成几段
      const segments = ip.split('.')
      // 如果是精确的 4 段而且每段转换成数字都在 1~255 就对了
      return segments.length === 4 &&
				segments
				  .every(n => n >= 0 && n <= 255 && /^[1-9](\d+)?$/ig.test(n))
    })
}

/**
 * 多个ip验证  用#分隔
 * @param {any} rule
 * @param {any} value
 * @param {any} callback
 * @returns
 */
export const validateIps = (rule, value, callback) => {
  if (isFalse(value)) {
    return callback()
  }
  if (!testIpList(value)) {
    callback(new Error('Please input IP, and use # to separate if necessary.'))
  } else {
    callback()
  }
}

/**
 * 判断email是否合法
 *
 * @param {any} rule
 * @param {any} value
 * @param {any} callback
 * @returns
 */
export const validateEmail = (rule, value, callback) => {
  if (value == undefined) {
    return callback()
  }
  if (!(value + '')) {
    return callback()
  }
  let reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
  if ((value + '') && !reg.test(value + '')) {
    callback(new Error('Please input the legal Email'))
  } else {
    callback()
  }
}

// 判断是否为正数  金额
export const validateMoney = (rule, value, callback) => {
  //  /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
  let reg = /^\d+(\.\d{1,3})?$/
  if (value == null) {
    value = ''
  }
  if (value + '' && !reg.test(value + '')) {
    callback(new Error('The format is incorrect.'))
  } else if (value > 999999999) {
    callback(new Error('Please input less than 1000,000,000'))
  } else {
    callback()
  }
}
export const validateRate = (rule, value, callback) => {
  //  /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
  let reg = /^\d+(\.\d{1,2})?$/
  if (value == null) {
    value = ''
  }
  if (value + '' && !reg.test(value + '')) {
    callback(new Error('The format is incorrect.'))
  } else if (value > 100) {
    callback(new Error('Please input 0-100'))
  } else {
    callback()
  }
}
// export const validateMoney = (rule, value, callback) => {
// 	//  /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
// 	if (value && !(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value))) {
// 		callback(new Error('should be positive number.'));
// 	} else if (value == 0) {
// 		callback(new Error('should be positive number.'));
// 	} else {
// 		callback();
// 	}
// }
// export const validateRevenue = (rule, value, callback) => {
// 	let reg = /^\d+(\.\d{1,3})?$/;
// 	if (value + "" && !reg.test(value + "")) {
// 		callback(new Error("Please input positive integer"));
// 	} else if (value > 999999999) {
// 		callback(new Error("Please input less than 1000,000,000"));
// 	} else {
// 		callback();
// 	}
// };
export const validatorCheckUrl = (rule, value, callback) => {
  var RegUrl = new RegExp()
  RegUrl.compile('[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.={}]+$')
  if (!RegUrl.test(value)) {
    // alert("注意url有效性");
    callback(new Error('Please input the legal Url'))
    return false
  }
  callback()
  return true
}
export const validate_zero = (rule, value, callback) => {
  if (value == 0) {
    callback(new Error('Can not be zero'))
    return false
  }
  callback()
  return true
}
