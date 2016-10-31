var gulp = require('gulp');
var concat = require('gulp-concat');
var serve = require('gulp-serve');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var browserify = require('browserify');

// default task
gulp.task('default', ['roboto', 'scripts', 'scripts:watch', 'serve', 'sass', 'sass:watch']);

// browserify backend code
gulp.task('browserify', function () {
    var b = browserify({
        entries: 'index.js', // Only need initial file, browserify finds the deps
        debug: true        // Enable sourcemaps
    });
    return b.bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(uglify())

        .pipe(gulp.dest('./app/js/browserify/'));
});

// concatenate all our scripts
gulp.task('scripts', ['browserify'], function() {
    return gulp.src([
            './app/js/util.js',
            './app/js/browserify/*.js',
            './app/js/screens/Screen.js',
            './app/js/*/*.js',
            './app/js/main.js'
        ])
        .pipe(concat('wisteria.js'))
        .pipe(gulp.dest('./app/dist/js/'));
});

// automatically concat scripts on change
gulp.task('scripts:watch', function() {
    gulp.watch(['./app/js/**/*.js', "!./app/js/browserify/*.js"], ['scripts']);
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
