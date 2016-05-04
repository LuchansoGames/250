var gulp = require('gulp'),
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
  gulp.src('public/**/*.js')
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('public/**/*.js', ['js']);
  gulp.watch('public/**/*.html', ['html']);
});

gulp.task('default', ['connect', 'watch']);