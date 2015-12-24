var path = require('path');
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
        test: /\.vue$/,
        loader: 'vue',
        include: APP_PATH
      }, {
        test: /\.css$|\.scss$/,
        loader: 'style-loader!css-loader!sass-loader',
        include: APP_PATH
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
            presets: ['es2015']
        },
        include: APP_PATH
      }
    ]
  },
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },
  plugins:[]
}