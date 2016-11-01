var gulp = require('gulp');
var concat = require('gulp-concat');
var serve = require('gulp-serve');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var cleanCSS = require('gulp-clean-css');

// default task
gulp.task('default', ['roboto', 'browserify', 'scripts:watch', 'serve', 'sass', 'sass:watch']);

// run before deploying
gulp.task('deploy', ['roboto', 'browserify:prod', 'sass:prod']);

// browserify for node style requires
gulp.task('browserify', function () {
    var b = browserify({
        entries: './app/js/main.js', // Only need initial file, browserify finds the deps
        debug: true,
        paths: [
            './node_modules',
            './app/js/backend',
            './app/js/components',
            './app/js/screens'
        ]
    });
    return b.bundle()
        .pipe(source('wisteria.js'))
		.pipe(sourcemaps.write())
        .pipe(buffer())
        // .pipe(uglify())

        .pipe(gulp.dest('./app/dist/js/'));
});

// browserify - production - no sourcemap and minified
gulp.task('browserify:prod', function () {
    var b = browserify({
        entries: './app/js/main.js', // Only need initial file, browserify finds the deps
        debug: true,
        paths: [
            './node_modules',
            './app/js/backend',
            './app/js/components',
            './app/js/screens'
        ]
    });
    return b.bundle()
        .pipe(source('wisteria.js'))
        .pipe(buffer())
        .pipe(uglify())

        .pipe(gulp.dest('./app/dist/js/'));
});

// automatically concat scripts on change
gulp.task('scripts:watch', function() {
    gulp.watch(['./app/js/**/*.js'], ['browserify']);
});

// copy materialize
gulp.task('materialize', function() {
    return gulp.src('./node_modules/materialize-css/sass/**/*.scss')
        .pipe(gulp.dest('./app/sass/materialize'));
});

// compile scss files
gulp.task('sass', function() {
    return gulp.src(['./app/sass/**/*.scss', '!./app/sass/materialize/*.scss'])
		.pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write())
        .pipe(gulp.dest('./app/dist/css'));
});

// production scss - minified and no sourcemap
gulp.task('sass:prod', function() {
    return gulp.src(['./app/sass/**/*.scss', '!./app/sass/materialize/*.scss'])
		.pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./app/dist/css'));
});

// move roboto font
gulp.task('roboto', function() {
    return gulp.src('./app/fonts/**/*.*')
        .pipe(gulp.dest('./app/dist/fonts'));
});

// automatically recompile scss on change
gulp.task('sass:watch', function() {
    gulp.watch('./app/sass/**/*.scss', ['sass']);
});

// quick server
gulp.task('serve', serve('app'));
