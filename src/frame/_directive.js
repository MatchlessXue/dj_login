// vue 请求插件开发
export default {
  // 适应$aitool_开头标记为工具方法的使用
  install: function (Vue, options) {
    Vue.directive('focusNextOnEnter', {
      bind: function (el, {
        value
      }, vnode) {
        el.addEventListener('keyup', (ev) => {
          if (ev.keyCode === 13) {
            let nextInput = vnode.context.$refs[value]
            if (nextInput && typeof nextInput.focus === 'function') {
              nextInput.focus && nextInput.focus()
              nextInput.select && nextInput.select()
              return
            }
            if (nextInput && !nextInput.blur && nextInput.nativeType === 'button') {
              // if(value=='loginbutton'){
              // debugger;
              nextInput.handleClick(ev)
              // }
            }
          }
        })
      }
    })
  }
}
