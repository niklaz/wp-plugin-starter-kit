var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');

gulp.task('images', function(){
    gulp.src('assets/images/src/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('assets/images/dist/'));
});

gulp.task('css', function(){
    gulp.src(['assets/css/src/**/*.scss'])
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('assets/css/dist/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('assets/css/dist/'))
});

gulp.task('js', function(){
    return gulp.src('assets/js/src/**/*.js')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(concat('main.js'))
        .pipe(babel())
        .pipe(gulp.dest('assets/js/dist/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js/dist/'))
});

gulp.task('default', function(){
    gulp.watch("assets/css/src/**/*.scss", ['css']);
    gulp.watch("assets/js/src/**/*.js", ['js']);
});