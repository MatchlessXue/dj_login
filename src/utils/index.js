import enquireJs from 'enquire'
import { DEVICE_TYPE } from './constance.js'

// 设备适配
export const deviceEnquire = function () {
  // 电脑
  const matchDesktop = {
    match: () => {
      return DEVICE_TYPE.DESKTOP
    }
  }
  // 平板
  const matchLablet = {
    match: () => {
      return DEVICE_TYPE.TABLET
    }
  }
  // 手机
  const matchMobile = {
    match: () => {
      return DEVICE_TYPE.MOBILE
    }
  }

  enquireJs
    .register('screen and (max-width: 576px)', matchMobile)
    .register('screen and (min-width: 576px) and (max-width: 1199px)', matchLablet)
    .register('screen and (min-width: 1200px)', matchDesktop)
}
