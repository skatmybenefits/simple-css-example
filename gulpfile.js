var gulp = require('gulp');
//css 
var sass = require('gulp-sass');
//server
var browserSync = require('browser-sync').create();

var config = {
		path:{
			root:'./src',
			styles:'/css'
		}
	}

//default needed
gulp.task('default', function (){});

//build without serve
gulp.task('sass.watch', function() {
    gulp.watch(config.path.root + config.path.styles + "/*.scss", ['sass']);
});

gulp.task('serve.watch', ['sass'], function() {
    browserSync.init({server: config.path});
    gulp.watch(config.path.root + config.path.styles + "/*.scss", ['sass']);
    gulp.watch(config.path.root + "/index.html").on('change', browserSync.reload);
});

//compile sass
gulp.task('sass', function() {
    return gulp.src(config.path.root + config.path.styles + "/*.scss")
        .pipe(sass())
        .pipe(gulp.dest(config.path.root + "/css"))
        .pipe(browserSync.stream());
});
