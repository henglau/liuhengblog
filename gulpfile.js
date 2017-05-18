'use strict';
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var less = require('gulp-less'),
    cssmin = require('gulp-minify-css'),
    cssver = require('gulp-make-css-url-version');
var uglify = require('gulp-uglify'),
    rename = require('gulp-rename');
var reload = browserSync.reload;

// less编译后的css将注入到浏览器里实现更新
gulp.task('less', function() {
    return gulp.src("public/less/*.less")
        .pipe(less())
        .pipe(cssver())
        .pipe(cssmin())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest("public/mincss"))
        .pipe(reload({stream: true}));
});
// 处理完JS文件后返回流
gulp.task('js', function () {
    return gulp.src('public/js/*.js')
        .pipe(uglify())
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest('public/minjs'));
});

// 静态服务器 + 监听 less/handlebars 文件
gulp.task('serve', ['less','js'], function() {
    browserSync.init({
        proxy: "http://localhost:3000"
    });
    gulp.watch("public/less/*.less", ['less']);
	gulp.watch("public/js/*.js",['js']);
    gulp.watch("views/*.handlebars").on('change', reload);
});

gulp.task('default', ['serve']);

