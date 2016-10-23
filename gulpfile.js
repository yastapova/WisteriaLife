var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('default', function () {

}); 

gulp.task('scripts', function() {
  return gulp.src([
      './js/util.js',
      './js/*/*.js',
      './js/main.js'
    ])
    .pipe(concat('wisteria.js'))
    .pipe(gulp.dest('./dist/'));
});

