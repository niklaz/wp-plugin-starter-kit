

'use strict';

//import gulp from 'gulp';

const {src, dest, watch, series, parallel} = require('gulp');

var plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var minifycss = require('gulp-clean-css');
var sass = require('gulp-sass');

//sass.compiler = require('node-sass');

//var assetsDir =


function images(){
    return src('assets/images/src/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(dest('assets/images/dist/'));
}

function css(){
    return src(['assets/css/src/**/*.scss'])
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(dest('assets/css/dist/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(dest('assets/css/dist/'))
}

function js(){
    return src('assets/js/src/**/*.js')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(concat('main.js'))
        .pipe(babel())
        .pipe(dest('assets/js/dist/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(dest('assets/js/dist/'))
}

function defaultTask(cb){
    watch(["assets/css/src/**/*.scss"], css());
    watch(["assets/js/src/**/*.js"], js());

    cb();
}

exports.default = defaultTask;
exports.build = parallel(css,js);
exports.styles = css;
exports.scripts = js;