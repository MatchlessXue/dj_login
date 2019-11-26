// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

var _config = {
    "prod": {
        NODE_ENV: '"production"'
    },
    "dev": {
        NODE_ENV: '"development"'
    },
    "test": {
        NODE_ENV: '"testing"'
    }
}

module.exports = {
    build: {
        env: _config.prod,
        index: path.resolve(__dirname, '../../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: './',
        productionSourceMap: false,
        devtool: '#source-map',
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: _config.dev,
        host: '127.0.0.1',
        port: 8888,
        autoOpenBrowser: true,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, 
        useEslint: false,
        showEslintErrorsInOverlay: false,
        devtool: 'cheap-module-eval-source-map',
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            '/api/authcenter': {
                target: 'http://tms-uat.dj.com/api',
                changeOrigin: true,
                pathRewrite: {
                    '^/api/authcenter': '/authcenter'
                }
            }
        },
        cacheBusting: true,
        cssSourceMap: false
    },
    test: {
        env: _config.test
    }
}