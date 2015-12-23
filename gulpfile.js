var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var gutil = require("gulp-util");
var webpack = require("webpack");
var webpackConfig = require('./webpack.config.js');

gulp.task('babel', function(){
	return gulp.src(['./app/**/*.babel.js'])
	.pipe(sourcemaps.init())
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./app'));
});

// 开发
var webpackConfigDev = Object.create(webpackConfig);
webpackConfigDev.devtool = 'source-map';
webpackConfigDev.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(webpackConfigDev);

gulp.task('webpack:build-dev', function() {
  devCompiler.run(function(err, status) {
    if (err) throw new gutil.PluginError("webpack:build-dev", err);
    gutil.log("[webpack:build-dev]", status.toString({
      colors: true
    }));
  });
});

gulp.task('watch', function(){
  gulp.watch('./app/**/*.js', ['webpack:build-dev']);
})




gulp.task('default', [
  'webpack:build-dev',
  'watch'
]);