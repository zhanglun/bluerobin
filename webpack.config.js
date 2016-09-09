var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

// 定义了一些文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var SRC_PATH = path.resolve(APP_PATH, 'src');
console.log(SRC_PATH);
var BUILD_PATH = path.resolve(APP_PATH, 'build');

module.exports = {
  entry: {
    index: SRC_PATH + '/index.js',
    vue: ['vue'],
  },
  output: {
    path: BUILD_PATH,
    // publicPath: BUILD_PATH,
    filename: './[name].bundle.js',
  },
  resolve: {
   alias: {
    'tool':  SRC_PATH + '/services/tool.js',
   },
  },
  module: {
    loaders: [{
      test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
      loader: 'file-loader?name=fonts/[hash].[ext]',
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'url?limit=10000&&hash=sha512&digest=hex&name=images/[hash].[ext]'
      ],
    }, {
      test: /\.vue$/,
      loader: 'vue',
      include: SRC_PATH,
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      query: {
        presets: [
          'es2015',
        ],
      },
      include: SRC_PATH,
    }, {
      test: /\.css$|\.less$/,
      // loaders: ['style-loader', 'css-loader?sourceMap', 'sass-loader'],
      loader: ExtractTextPlugin.extract([
        'css-loader?sourceMap',
        'less-loader',
      ]),
      include: SRC_PATH,
    }],
  },
  vue: {
    loaders: {
      css: ExtractTextPlugin.extract("css"),
      less: ExtractTextPlugin.extract("css!less"),
    },
  },
  babel: {
    presets: [
      'es2015',
    ],
    plugins: [
      'transform-runtime',
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
      }
    }),
    new ExtractTextPlugin('style.bundle.css'),
    new HtmlWebpackPlugin({
      template: SRC_PATH + '/index.html',
      filename: 'index.html',
    }),
    new CopyWebpackPlugin([{
      from: SRC_PATH + '/vendor',
      to: BUILD_PATH + '/vendor',
    }]),
    new CommonsChunkPlugin({
      name: ['vue'],
      minChunks: Infinity
    }),
  ]
};
