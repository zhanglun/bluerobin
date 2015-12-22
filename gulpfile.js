var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');


gulp.task('build', function(){
	return gulp.src(['./app/scripts.babel/*.js', './app/scripts.babel/**/*.js'])
	.pipe(sourcemaps.init())
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('./app/scripts'));
});


