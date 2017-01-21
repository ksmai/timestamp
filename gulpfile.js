var gulp = require('gulp');
var minifyHTML = require('gulp-minify-html');
var mocha = require('gulp-mocha');

gulp.task('test', function() {
  gulp
    .src(['./server/**/*.test.js', './utility/**/*.test.js'])
    .pipe(mocha());
});

gulp.task('minhtml', function() {
  gulp
    .src('./client/**/*.html')
    .pipe( minifyHTML({
      empty: true
    }) )
    .pipe( gulp.dest('./public') );
});

gulp.task('build', ['minhtml']);

gulp.task('watch', ['build'], function() {
  gulp.watch('./client/**/*.html', ['minhtml']);
  gulp.watch(['./server/**/*.js', './utility/**/*.js'], ['test']);
});
