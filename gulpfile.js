var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    port: 8080,
    livereload: true,
    root: 'public'
  });
});

gulp.task('html', function() {
  gulp.src('public/**/*.html')
    .pipe(connect.reload());
});

gulp.task('js', function() {
  var src = [
  'public/js/menu/**/*.js',
  'public/js/game/**/*.js',
  'public/js/app.js'
  ];

  gulp.src(src)
    .pipe(sourcemaps.init())
    .on('error', function(err) {
      console.error('Error in compress task', err.toString());
    })
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../js'}))
    .pipe(gulp.dest('public'))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('public/**/*.js', ['js']);
  gulp.watch('public/**/*.html', ['html']);
});

gulp.task('default', ['js', 'connect', 'watch']);