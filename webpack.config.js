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
    filename: './[name].bundle.js'
  },
  module: {
    loaders: [{
      test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
      loader: 'file-loader'
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'file?hash=sha512&digest=hex&name=[hash].[ext]',
        'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
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
      test: /\.css$|\.scss$/,
      loader: ['style-loader', 'css-loader?sourceMap', 'sass-loader'],
      include: APP_PATH
    }, ],
    vue: {
      loaders: {
        sass: ExtractTextPlugin.extract("css!sass")
      }
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
