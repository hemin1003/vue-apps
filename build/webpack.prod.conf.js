var webpack = require('webpack')
var merge = require('webpack-merge')
var CleanPlugin = require('clean-webpack-plugin') //webpack插件，用于清除目录文件
var cssLoaders = require('./css-loaders')
var config = require('./config')
var baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  //devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: config.build.assetsSubDirectory + '/[hash:7]/[name].js',
    chunkFilename: config.build.assetsSubDirectory + '/[hash:7]/[id].chunk.js'
  },
  vue: {
    loaders: cssLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'  // 为啥双引号不能去掉？
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new CleanPlugin(['../dist']), //清空生成目录
    new webpack.optimize.OccurenceOrderPlugin()
  ]
})

















