(function () {
  'use strict';

  var gulp = require('gulp'),
    gulpClean = require('gulp-clean'),
    gulpConcat = require('gulp-concat'),
    gulpSass = require('gulp-sass'),
    gulpLivereload = require('gulp-livereload'),
    gulpNgAnnotate = require('gulp-ng-annotate'),
    gulpBabel = require('gulp-babel');

  gulp.task('compile-js', function () {
    return gulp.src([
      './src/js/*.module.js',
      './src/js/*.js'
    ])
      .pipe(gulpConcat('aliengoo.ng-insight.js'))
      .pipe(gulpNgAnnotate())
      .pipe(gulpBabel())
      .pipe(gulp.dest('./dist/js'))
      .pipe(gulpLivereload());
  });

  gulp.task('compile-scss', function () {
    return gulp.src('./src/scss/*.scss')
      .pipe(gulpSass({
        errLogToConsole: true
      }))
      .pipe(gulp.dest('./dist/css'))
      .pipe(gulpLivereload());
  });


  gulp.task('default', ['compile-js', 'compile-scss'], function () {
    gulpLivereload.listen();

    gulp.watch(['./src/js/*.js'], ['compile-js']);
    gulp.watch(['./src/scss/*.scss'], ['compile-scss']);
  });
}());