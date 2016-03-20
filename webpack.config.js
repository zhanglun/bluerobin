var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
//定义了一些文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

module.exports = {
  entry: {
    index: APP_PATH + '/index.js'
  },
  output: {
    path: APP_PATH,
    // publicPath: '/build',
    filename: './[name].bundle.js'
  },
  module: {
    loaders: [{
      test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
      loader: 'file-loader?name=/build/fonts/[hash].[ext]'
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'file?hash=sha512&digest=hex&name=/build/images/[hash].[ext]',
        'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}, svgo:{plugins:[{removeViewBox: false},{removeEmptyAttrs: false}]}}',
        // 'url?limit=10000&&hash=sha512&digest=hex&name=/build/images/[hash].[ext]'
      ]
    }, {
      test: /\.vue$/,
      loader: 'vue',
      include: APP_PATH
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      query: {
        presets: ['es2015']
      },
      include: APP_PATH
    }, {
      test: /\.css$|\.less$/,
      // loaders: ['style-loader', 'css-loader?sourceMap', 'sass-loader'],
      loader: ExtractTextPlugin.extract(['css-loader?sourceMap', 'less-loader']),
      include: APP_PATH
    }],
  },
  vue: {
    loaders: {
      css: ExtractTextPlugin.extract("css"),
      less: ExtractTextPlugin.extract("css!less")
    }
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },
  plugins: [
    new ExtractTextPlugin('style.bundle.css')
  ]
}
