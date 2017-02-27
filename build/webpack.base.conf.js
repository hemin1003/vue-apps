var path = require('path')
var glob = require('glob')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
// 将样式提取到单独的css文件中，而不是打包到js文件或使用style标签插入在head标签中
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var config = require('./config')
var cssLoaders = require('./css-loaders')

var entries = getEntry('./src/apps/*/main.js') // 获得入口js文件
var chunks = Object.keys(entries)

var autoprefixer = require('autoprefixer')

module.exports = {
  entry: entries,
  output: {
    path: config.build.assetsRoot,
    publicPath: config.build.assetsPublicPath,
	  /* ---- 生成的例子 vendors.61714a310523a3df9869.js --- */
    //filename: '[name].[hash].js'
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue', '.less', '.css'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'apps': path.resolve(__dirname, '../src/apps'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components'),
      'plugins': path.resolve(__dirname, '../src/plugins'),
      'vux-components': 'vux/src/components',
      'vux-plugins': 'vux/src/plugins',
      'vux-styles': 'vux/src/styles'
    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /vux.src.*?js$/,
        loader: 'babel'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.resolve(__dirname, '../'),
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test   : /\.css$/,
        loader : 'style-loader!css-loader!postcss-loader'
      }, 
    	{
        test: /\.less$/, 
        loader: 'style!css!postcss-loader!less'
      },
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      { 
        test: /\.((ttf|eot|woff|svg)(\?t=[0-9]\.[0-9]\.[0-9]))|(ttf|eot|woff|svg)\??.*$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: config.build.assetsSubDirectory + '/font/[name].[ext]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|ico|mp3)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: config.build.assetsSubDirectory + '/imgs/[name].[ext]'
        }
      },
      {
  		  test: /vux.src.*?js$/,
  		  loader: 'babel'
	    }
    ]
  },
  postcss: [ autoprefixer({ browsers: ['last 2 versions', '> 1%'] }) ],
  vue: {
    loaders: cssLoaders()
  },
  plugins: [
    // 提取公共模块
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',     // 公共模块的名称
      // filename: config.build.assetsSubDirectory + '/common.js',
      chunks: chunks,     // chunks是需要提取的模块
      minChunks: chunks.length
    }),
    // 配置提取出的样式文件
    new ExtractTextPlugin(config.build.assetsSubDirectory + '/[hash:7]/[name].css')
  ],
  externals:[
    require('webpack-require-http')
  ]
}

for (var pathname in entries) {
  
  var conf = {
    favicon:  'src/assets/imgs/favicon.ico',
    template: 'src/apps/template.html',
    chunks: ['common', pathname],
    hash: true,
    inject: true
  }

  // 配置生成的html文件，定义路径等
  if(pathname === 'default'){
    conf.filename = 'index.html'
  }else{
    conf.filename = pathname + '/index.html'
  }
  module.exports.plugins.push(new HtmlWebpackPlugin(conf))
}

// e.g. getEntry('./src/apps/*/main.js')
/*
  return {
    'index': './src/page/index/main.js',
    'other': './src/page/other/main.js'
  }
*/
function getEntry(globPath) {
  var entries = {}, basename, tmp, pathname
  
  glob.sync(globPath).forEach(function (entry) {
    // basename = path.basename(entry, path.extname(entry))
    tmp = entry.split('/').splice(-3) // ['page', 'index', 'app.js']
    // pathname = tmp.splice(0, 1) + '/' + basename // 正确输出js和html的路径
    pathname = tmp[1] ;
    entries[pathname] = entry
  })
  return entries
}
