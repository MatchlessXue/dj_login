const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: '/login/',
  configureWebpack: {
    externals: {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
      'vuex': 'Vuex',
      'moment': 'moment',
      'axios': 'axios'
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('frame', resolve('src/frame'))
      .set('views', resolve('src/views'))
      .set('router', resolve('src/router'))
      .set('store', resolve('src/store'))
      .set('utils', resolve('src/utils'))
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('url-loader')
      .loader('url-loader')
  },
  devServer: {
    port: 8888,
    proxy: {
      // '/api/order': {
      //   target: 'http://192.168.1.191:1411', // 薛星
      //   ws: false,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api/order': '/order'
      //   }
      // },
      // '/api/libraries': {
      //   target: 'http://192.168.1.140:1101', // 余波
      //   ws: false,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api/libraries': '/libraries'
      //   }
      // },
      // '/api/datum': {
      //   target: 'http://192.168.1.118:1101', // 许达
      //   ws: false,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api/datum': '/datum'
      //   }
      // },
      // '/api/settle': {
      //   target: 'http://192.168.1.118:8300', // 许达
      //   ws: false,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api/settle': '/'
      //   }
      // },
      '/api': {
        target: 'https://cs.56ctm.com',
        // target: 'http://tms-uat.dj.com',
        // target: 'http://192.168.1.247',
        changeOrigin: true
      },
      '/tms': {
        target: 'http://localhost:9527/',
        changeOrigin: true
      },
      '/help-admin': {
        target: 'http://localhost:9000',
        changeOrigin: true
      },
      '/help': {
        target: 'http://localhost:9009',
        // target: 'http://tms-dev.dj.com',
        changeOrigin: true
      },
      '/waybill': {
        target: 'http://localhost:8910',
        changeOrigin: true
      },
      '/magic-form': {
        target: 'http://localhost:8089',
        changeOrigin: true
      },
      '/chart': {
        target: 'http://localhost:8905',
        changeOrigin: true
      },
      '/finance': {
        target: 'http://localhost:8900',
        changeOrigin: true
      },
      '/manage': {
        target: 'http://localhost:9101/',
        changeOrigin: true
      },
      '/work-flow': {
        target: 'http://localhost:9999/',
        changeOrigin: true
      },
      '/track': {
        target: 'http://localhost:8906/',
        changeOrigin: true
      },
      '/dispatch': {
        target: 'http://localhost:8900/',
        changeOrigin: true
      },
      '/resources': {
        target: 'http://localhost:8901/',
        changeOrigin: true
      }
    }
  }
}
