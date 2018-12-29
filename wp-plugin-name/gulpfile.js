'use strict';


const {src, dest, watch, series, parallel} = require('gulp');
let plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer');
let babel = require('gulp-babel');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');
let imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
let minifycss = require('gulp-clean-css');
let sass = require('gulp-sass');

sass.compiler = require('node-sass');


let paths = {
    css : {
        src  : 'assets/css/src/**/*.scss',
        dest : 'assets/css/dist'
    },
    images :{
        src  : 'assets/js/src/**/*',
        dest : 'assets/js/dist/'
    },
    js : {
        src  : 'assets/images/src/**/*.js',
        dest : 'assets/images/dist/'
    }
};


function images(){

    return src(paths.images.src)
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(dest(paths.images.dest));

}

function css(){

    return src(paths.css.src)
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(sass().on('error', sass.logError))
        .pipe(dest(paths.css.dest))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(dest(paths.css.dest))

}

function js(){

    return src(paths.js.src)
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }}))
        .pipe(concat('main.js'))
        .pipe(babel())
        .pipe(dest(paths.js.dest))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(dest(paths.js.dest));
}

function defaultTask(){
   parallel(css,js,images);
   watch([paths.css.src], series(css));
   watch([paths.js.src], series(js));
   watch([paths.images.src], series(images));
 //  watch([paths.css.src,paths.js.src,paths.images.src], parallel(css, js, images));

}

exports.default = defaultTask;
exports.build = parallel(css,js,images);
exports.styles = series(css);
exports.scripts = series(js);
exports.images = series(images);