var gulp = require('gulp');
var browserify = require('gulp-browserify');
var minifyHTML = require('gulp-minify-html');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var mocha = require('gulp-mocha');

gulp.task('test', function() {
  gulp
    .src(['./server/**/*.test.js', './utility/**/*.test.js'])
    .pipe(mocha());
});

gulp.task('mincss', function() {
  gulp
    .src('./client/css/*.css')
    .pipe(cleanCSS())
    .pipe(concat('style.css'))
    .pipe( gulp.dest('./public') );
});

gulp.task('minhtml', function() {
  gulp
    .src('./client/**/*.html')
    .pipe( minifyHTML({
      empty: true
    }) )
    .pipe( gulp.dest('./public') );
});

gulp.task('browserify', function() {
  gulp
    .src('./client/app.js')
    .pipe(browserify())
    .pipe(gulp.dest('./public'));
});

gulp.task('build', ['browserify', 'minhtml', 'mincss']);

gulp.task('watch', ['build'], function() {
  gulp.watch('./client/**/*.html', ['minhtml']);
  gulp.watch('./client/css/*.css', ['mincss']);
  gulp.watch('./client/**/*.js', ['browserify']);
  gulp.watch(['./server/**/*.js', './utility/**/*.js'], ['test']);
});
