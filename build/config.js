// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
module.exports = {
  build: {
    // index: path.resolve('dist/page/index.html'),
    assetsRoot: path.resolve('../yz-wx-tmp'), // path.resolve('dist'), // d:\leo-work\vue-pages\dist
    assetsSubDirectory: 'static',
    // assetsPublicPath: process.env.NODE_ENV === 'production' ? '../' : '/',
    assetsPublicPath: '/',
    productionSourceMap: true
  },
  dev: {
    port: 8083,
    proxyTable: {}
  }
}
