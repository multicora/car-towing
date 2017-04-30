var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
  sass: ['./scss/**/*.scss'],
  modules: ['./www/modules/**/*.js'],
  modulesWithMocks: ['./www/modules/**/*.js', './www/mocks/**/*.js']
};

gulp.task('default', ['sass', 'modules']);

gulp.task('sass', function (done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('modules', function () {
  return gulp.src(paths.modules)
    .pipe(sourcemaps.init())
    .pipe(concat('modules.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./www/js/'));
});

gulp.task('modulesWithMocks', function () {
  return gulp.src(paths.modulesWithMocks)
    .pipe(sourcemaps.init())
    .pipe(concat('modules.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./www/js/'));
});

gulp.task('serve:before', ['sass', 'modulesWithMocks', 'watch']);

gulp.task('watch', function () {
  gulp.watch(paths.sass, function () {
    gulp.run('sass');
  });
  gulp.watch(paths.modulesWithMocks, function () {
    gulp.run('modulesWithMocks');
  });
});

gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
