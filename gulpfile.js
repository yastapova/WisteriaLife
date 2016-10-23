var gulp = require('gulp');
var concat = require('gulp-concat');
var serve = require('gulp-serve');
var sass = require('gulp-sass');


// default task
gulp.task('default', ['scripts', 'scripts:watch', 'serve', 'sass', 'sass:watch']);

// concatenate all our scripts
gulp.task('scripts', function() {
  return gulp.src([
      './app/js/util.js',
	  './app/js/screens/Screen.js',
      './app/js/*/*.js',
      './app/js/main.js'
    ])
    .pipe(concat('wisteria.js'))
    .pipe(gulp.dest('./app/dist/js/'));
});

// automatically concat scripts on change
gulp.task('scripts:watch', function () {
  gulp.watch('./app/js/**/*.js', ['scripts']);
});

// compile scss files
gulp.task('sass', function () {
  return gulp.src('./app/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/dist/css'));
});

// automatically recompile scss on change
gulp.task('sass:watch', function () {
  gulp.watch('./app/sass/**/*.scss', ['sass']);
});

// quick server
gulp.task('serve', serve('app'));
