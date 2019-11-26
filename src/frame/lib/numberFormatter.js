
function FormatData (dec, group, neg) {
  this.dec = dec
  this.group = group
  this.neg = neg
}

function formatCodes (locale) {
  // default values
  let dec = '.'
  let group = ','
  let neg = '-'

  return new FormatData(dec, group, neg)
}

function toFixed (number, len) {
  let _snumber = number.toString()
  let index = _snumber.indexOf('.')
  if (index > -1) {
    return _snumber.substring(0, index + len + 1)
  }
  return _snumber
}

let formatNumberDefaults = {
  defaults: {
    format: '#,###.00',
    locale: 'us',
    decimalSeparatorAlwaysShown: false,
    nanForceZero: true,
    round: true,
    scale: false,
    scaleNames: ['', 'K', 'M', 'B', 'T'],
    useScaleAsDecimalSeparator: false
  }
}

function _formatNumber (number, options, suffix, prefix, negativeInFront) {
  options = Object.assign({}, formatNumberDefaults.defaults, options)
  let formatData = formatCodes(options.locale.toLowerCase())

  let dec = formatData.dec
  let group = formatData.group
  let neg = formatData.neg
  let scaleName = options.scaleNames[0]
  let forcedToZero = false
  if (isNaN(number)) {
    if (options.nanForceZero === true) {
      number = 0
      forcedToZero = true
    } else { return null }
  }

  // special case for percentages
  if (suffix === '%') {
    // number = number * 100;
  }

  if (options.scale) {
    let scaleFactor = 1
    let absVal = Math.abs(number)
    let scaleI
    for (scaleI = 0; scaleI < options.scaleNames.length; scaleI++) {
      if (absVal < scaleFactor * 1000) {
        break
      }
      scaleFactor *= 1000
    }
    number /= scaleFactor
    scaleName = options.scaleNames[scaleI]
  }

  let returnString = ''
  let decimalPortion = ''
  if (options.format.indexOf('.') > -1) {
    let decimalFormat = options.format.substring(options.format.lastIndexOf('.') + 1)

    // console.log("====",number);
    // round or truncate number as needed
    if (options.round === true) {
      // number = new Number(number.toFixed(decimalFormat.length));
      number = +toFixed(number, decimalFormat.length)
    } else {
      let numStr = number.toString()
      numStr = numStr.substring(0, numStr.lastIndexOf('.') + decimalFormat.length + 1)
      number = +numStr
    }
    // let decimalValue = number % 1;
    let decimalValue = number.toString().lastIndexOf('.') > -1 ? '0' + number.toString().substring(number.toString().lastIndexOf('.')) : '0.0'
    // let decimalString = new String(decimalValue.toFixed(decimalFormat.length));
    let decimalString = toFixed(decimalValue, decimalFormat.length).toString()
    decimalString = decimalString.substring(decimalString.lastIndexOf('.') + 1)

    for (let i = 0; i < decimalFormat.length; i++) {
      if (decimalFormat.charAt(i) === '#' && decimalString.charAt(i) !== '0') {
        decimalPortion += decimalString.charAt(i)
        continue
      } else if (decimalFormat.charAt(i) === '#' && decimalString.charAt(i) === '0') {
        let notParsed = decimalString.substring(i)
        if (notParsed.match('[1-9]')) {
          decimalPortion += decimalString.charAt(i)
          continue
        } else {
          break
        }
      } else if (decimalFormat.charAt(i) === '0') { decimalPortion += decimalString.charAt(i) }
    }
    // 后缀补零
    while (decimalPortion.length < decimalFormat.length) {
      decimalPortion += '0'
    }
    returnString += decimalPortion
  } else {
    number = Math.round(number)
  }

  let ones = Math.floor(number)
  if (number < 0) {
    ones = Math.ceil(number)
  }

  let onesFormat = ''
  if (options.format.indexOf('.') === -1) {
    onesFormat = options.format
  } else {
    onesFormat = options.format.substring(0, options.format.indexOf('.'))
  }

  let onePortion = ''
  if (!(ones === 0 && onesFormat.substr(onesFormat.length - 1) === '#') || forcedToZero) {
    // find how many digits are in the group
    let oneText = Math.abs(ones).toString()
    let groupLength = 9999
    if (onesFormat.lastIndexOf(',') !== -1) { groupLength = onesFormat.length - onesFormat.lastIndexOf(',') - 1 }
    let groupCount = 0
    for (let i = oneText.length - 1; i > -1; i--) {
      onePortion = oneText.charAt(i) + onePortion
      groupCount++
      if (groupCount === groupLength && i !== 0) {
        onePortion = group + onePortion
        groupCount = 0
      }
    }

    // account for any pre-data 0's
    if (onesFormat.length > onePortion.length) {
      let padStart = onesFormat.indexOf('0')
      if (padStart !== -1) {
        let padLen = onesFormat.length - padStart

        // pad to left with 0's
        while (onePortion.length < padLen) {
          onePortion = '0' + onePortion
        }
      }
    }
  }

  if (ones === 0) { // add  显示为0的情况
    onePortion = '0'
  }
  if (!onePortion && onesFormat.indexOf('0', onesFormat.length - 1) !== -1) {
    onePortion = '0'
  }
  if (options.useScaleAsDecimalSeparator && scaleName) {
    returnString = onePortion + scaleName + returnString
  } else {
    returnString = onePortion + (decimalPortion ? dec : '') + returnString + scaleName
  }

  // handle special case where negative is in front of the invalid characters
  if (number < 0 && negativeInFront && prefix.length > 0) {
    prefix = neg + prefix
  } else if (number < 0) {
    returnString = neg + returnString
  }
  if (!options.decimalSeparatorAlwaysShown) {
    if (returnString.lastIndexOf(dec) === returnString.length - 1) {
      returnString = returnString.substring(0, returnString.length - 1)
    }
  }
  returnString = prefix + returnString + suffix
  return returnString
}

export function formatNumber (numberString, options) {
  // let options = Object.assign({}, formatNumberDefaults.defaults, options)
  // let formatData = formatCodes(options.locale.toLowerCase())
  // let dec = formatData.dec
  // let group = formatData.group
  // let neg = formatData.neg

  let validFormat = '0#-,.^'

  // strip all the invalid characters at the beginning and the end
  // of the format, and we'll stick them back on at the end
  // make a special case for the negative sign "-" though, so
  // we can have formats like -$23.32
  let prefix = ''
  let negativeInFront = false

  for (let i = 0; i < options.format.length; i++) {
    if (validFormat.indexOf(options.format.charAt(i)) === -1) {
      prefix = prefix + options.format.charAt(i)
    } else {
      if (i === 0 && options.format.charAt(i) === '-') {
        negativeInFront = true
      } else {
        break
      }
    }
  }
  let suffix = ''
  for (let i = options.format.length - 1; i >= 0; i--) {
    if (validFormat.indexOf(options.format.charAt(i)) === -1) { suffix = options.format.charAt(i) + suffix } else { break }
  }

  options.format = options.format.substring(prefix.length)
  options.format = options.format.substring(0, options.format.length - suffix.length)

  if (options.format.indexOf('^') !== -1) {
    options.scale = true
    options.format = options.format.replace('^', '')
  }

  // now we need to convert it into a number
  // while (numberString.indexOf(group) > -1)
  // numberString = numberString.replace(group, '');
  // let number = new Number(numberString.replace(dec, ".").replace(neg, "-"));
  let number = +numberString
  return _formatNumber(number, options, suffix, prefix, negativeInFront)
}

// export const numberFormat = numberFormat;
