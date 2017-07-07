/**
 * Created by Sever on 2016/9/27.
 */


var gulp = require('gulp');
var webpack = require('webpack');
var named = require('vinyl-named');
var connect = require('gulp-connect');
var concat = require('gulp-concat'); //gulp合并模块
var webpackConfig = require('./webpack.config.js');
var cssmin = require('gulp-cssmin'); //gulp压缩css模块
var uglify = require('gulp-uglify'); //gulp混淆模块，压缩文件
var base64 = require('gulp-css-base64'); //将图片转换成base64编码
var md5 = require('gulp-md5-plus'); //md5模块
var clean = require('gulp-clean');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var runSequence = require('gulp-run-sequence');//执行队列

//主机信息
var host = {
    path: 'web',
    port: 8091,
    html: 'app.html'
};
gulp.task('default', function() {
    runSequence('copy:icon','clean:sass','sass', 'md5:css', 'md5:js', 'copy:html');
    console.log('done');
});

gulp.task('dev', function() {
    runSequence('copy:icon', 'copy:images','clean:sass','sass', 'cssmin', 'build-js', 'copy:html', 'watch');
    console.log('done');
});

var myDevConfig = Object.create(webpackConfig);

var devCompiler = webpack(myDevConfig);

//编译
/*gulp.task('build-js', function() {
 return gulp.src(['static/js/!**.js'])
 .pipe(named())
 .pipe(webpack(webpackConfig()))
 .pipe(gulp.dest('web/js/'))
 });*/

gulp.task("build-js", function(callback) {
    devCompiler.run(function(err, stats) {
        if (err) throw new gutil.PluginError("webpack:build-js", err);
        gutil.log("[webpack:build-js]", stats.toString({
            colors: true
        }));
        callback();
    });
});

//监听
/*gulp.task('watch', function(done) {
    return gulp.watch(['static/!**!/!*'], ['copy:html','copy:images','cssmin', 'build-js'])
        .on('end', done);
});*/

gulp.task('watch', ['watch-css', 'watch-view', 'watch-images', 'watch-js']);

gulp.task('watch-css', function(done) {
    return gulp.watch(['static/css/*','static/sass/**/*','static/sass_lib/**/*'],function(){
        runSequence('sass','cssmin');
    }).on('end', done);
});
gulp.task('watch-view', function(done) {
    return gulp.watch(['static/view/**/*'], ['copy:html'])
        .on('end', done);
});
gulp.task('watch-images', function(done) {
    return gulp.watch(['static/images/**/*'], ['copy:images'])
        .on('end', done);
});
gulp.task('watch-js', function(done) {
    return gulp.watch(['static/js/**/*','static/lib/**/*', 'static/components/**/*'], ['build-js'])
        .on('end', done);
});

//打开服务器
gulp.task('connect', function() {
    console.log('打开web服务器 port:' + host.port + ' root:' + host.path + '=================================');
    connect.server({
        root: host.path,
        port: host.port,
        livereload: true
    });
});

//将html拷贝到目标目录
gulp.task('copy:html', function(done) {
    gulp.src(['static/view/**/*'], { base: 'static' })
        .pipe(gulp.dest('web'))
        .on('end', done);
});

//将图片拷贝到目标目录
gulp.task('copy:images', function(done) {
    gulp.src(['static/images/**/*'])
        .pipe(gulp.dest('web/images'))
        .on('end', done);
});


//清理sass编译后的文件
gulp.task('clean:sass', function () {
    gulp.src(['static/css/sass'])
        .pipe(clean());
});
//sass转化css
gulp.task('sass', function () {
    return gulp.src('static/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('static/css/sass'));
});

//压缩合并css, css中既有自己写的.less, 也有引入第三方库的.css
gulp.task('cssmin', function(done) {
    gulp.src(['static/css/**/*.css'])
        .pipe(concat('style.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('web/css/'))
        .on('end', done);
});



//将js加上10位md5,并修改html中的引用路径，该动作依赖build-js
gulp.task('md5:js', ['build-js'], function(done) {
    gulp.src('web/js/**/*.js')
        .pipe(uglify()) //压缩
        .pipe(md5(10, ['web/view/**/*.html', 'web/view/app.html']))
        .pipe(gulp.dest('web/js'))
        .on('end', done);
});

//雪碧图操作，应该先拷贝图片并压缩合并css
gulp.task('sprite', ['copy:images', 'cssmin'], function(done) {
    var timestamp = +new Date();
    gulp.src('web/css/style.min.css')
        // .pipe(spriter({
        //     spriteSheet: 'web/images/spritesheet' + timestamp + '.png',
        //     pathToSpriteSheetFromCSS: '../images/spritesheet' + timestamp + '.png',
        //     spritesmithOptions: {
        //         padding: 10
        //     }
        // }))
        .pipe(base64())
        .pipe(cssmin())
        .pipe(gulp.dest('web/css'))
        .on('end', done);
});

//将css加上10位md5，并修改html中的引用路径，该动作依赖sprite
gulp.task('md5:css', ['sprite'], function(done) {
    gulp.src('web/css/**/*.css')
        .pipe(md5(10, ['web/view/**/*.html', 'web/view/app.html']))
        .pipe(gulp.dest('web/css'))
        .on('end', done);
});

//将图标文件拷贝到目标目录
gulp.task('copy:icon', function(done) {
    gulp.src(['static/icon/**/*']).pipe(gulp.dest('web/icon')).on('end', done);
});
