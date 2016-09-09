var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

gulp.task('babel', function() {
  return gulp.src(['./app/**/*.babel.js'])
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(rename(function(path) {
    path.basename = path.basename.replace(/.babel/ig, '');
  }))
  .pipe(gulp.dest('./app'));
});

// 开发
var webpackConfigDev = Object.create(webpackConfig);
webpackConfigDev.devtool = 'eval-source-map';
webpackConfigDev.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(webpackConfigDev);

gulp.task('webpack:dev', function() {
  devCompiler.run(function(err, status) {
    if (err) {
      throw new gutil.PluginError('webpack:dev', err);
    }
    gutil.log('[webpack:dev]', status.toString({
      colors: true
    }));
  });
});

gulp.task('webpack:build', function() {
    // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('style.bundle.css')
  );

  // run webpack
  webpack(myConfig, function(err, stats, callback) {
    if (err) {
      throw new gutil.PluginError('webpack:build', err);
    }
    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }));
    // callback();
  });
});

gulp.task('watch', function() {
  gulp.watch(['./app/**/*.js', './app/src/components/*.vue', './app/src/components/**/*.vue', './app/**/*.less'], ['webpack:dev']);
});

gulp.task('default', [
  'webpack:dev',
  'babel',
  'watch'
]);

gulp.task('build', ['webpack:build']);

gulp.task('gh-pages', function(){
    return gulp.src('./app/build/**/*')
        .pipe(gulp.dest('./'));
});

gulp.task('publish', ['build','gh-pages']);