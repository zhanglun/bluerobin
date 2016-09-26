var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var webpack = require('webpack');
var webpackDevConfig = require('./webpack.config.js');
var webpackBuildConfig = require('./webpack.build.config.js');


// 开发
// create a single instance of the compiler to allow caching
var devCompiler = webpack(webpackDevConfig);
var buildCompiler = webpack(webpackBuildConfig);
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
  // run webpack
  buildCompiler.run(function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack:build', err);
    }
    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }));
  });
});

gulp.task('watch', ['webpack:dev'], function() {
  gulp.watch(['./app/**/*.js', './app/src/components/*.vue', './app/src/components/**/*.vue', './app/**/*.less'], ['webpack:dev']);
});

gulp.task('default', [
  'webpack:dev',
  'watch'
]);

gulp.task('build', ['webpack:build']);

gulp.task('deploy', function() {
  return gulp.src('./app/dist/**/*')
    .pipe(ghPages());
});

gulp.task('publish', ['build', 'deploy']);