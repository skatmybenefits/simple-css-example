var gulp = require('gulp');
var del = require('del');
var seq = require('gulp-sequence');

//css 
var sass = require('gulp-sass');
var order = require("gulp-order");
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');

//server
var inject = require('gulp-inject');
var browserSync = require('browser-sync').create();

var config = {
		path:{
			root:'./src',
			scss:'/scss', 
            outputName:''
		}
	}

//default needed
gulp.task('default', function (){});


gulp.task('clean.dev', function (done) {
  del([config.path.root + "/scss/css/*.css"], done);
});

//build without serve
gulp.task('sass.watch', function() {
    gulp.watch(config.path.root + config.path.scss + "/*.scss", ['sass']);
});

//serve watch and build
gulp.task('serve.watch', ['serve'], function() {
    browserSync.init({server: "./src"});
    gulp.watch(config.path.root + config.path.scss + "/*.scss", ['serve']);
    gulp.watch(config.path.root + "/index.html").on('change', browserSync.reload);
});

gulp.task('serve',['build.dev'], function() {
    var sources = gulp.src(['./src/css/*.css', '!./src/css/variables.css'], {read: false});
    
    return gulp.src('./src/index.html')
            .pipe(inject(sources,{
                                   transform:function(filepath){
                                   arguments[0] = filepath.replace('/src','');
                                    return inject.transform.apply(inject.transform, arguments);
                                   }
            }
            ))
            .pipe(gulp.dest('./src'))
            .pipe(browserSync.stream());
});

// gulp.task('build.inject', function() {
//     var sources = gulp.src(['./src/css/*.css'], {read: false}, {relative:true});
    
//     return gulp.src('./src/index.html')
//             .pipe(inject(sources,{
//                                    transform:function(filepath){
//                                        arguments[0] = filepath.replace('/src','');
//                                        return inject.transform.apply(inject.transform, arguments);
//                                     }
//             }
//             ))
//             .pipe(gulp.dest('./src'))
//             //.pipe(browserSync.stream());
// });


//compile sass
gulp.task('sass', function() {
    return gulp.src(config.path.root + config.path.scss + "/*.scss")
            .pipe(sass().on('error', sass.logError))        
            .pipe(gulp.dest("./src/scss/css"));
});

//todo: minify and bundle styles if condistion in confit is true 
gulp.task('build.dev',['sass'], function() {
     return gulp.src(config.path.root + config.path.scss + "/css/*.css")
            .pipe(order(["reset.css","content.css","grid.css","styles.css"]))//order files as needed before concat
             
             //.pipe(concat("app.styles.css"))//concat files
             //.pipe(uglify())//minify
            .pipe(gulp.dest(config.path.root + "/css"));
           
});

