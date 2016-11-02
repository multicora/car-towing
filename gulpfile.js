// TODO: add autoprefixer
// TODO: add source map

var gulp = require('gulp');
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var jade = require('gulp-jade');
var connect = require('gulp-connect');
var order = require('gulp-order');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minCss = require('gulp-minify-css');
var minJs = require('gulp-uglify');
var log = require('gulp-util').log;
var bowerFiles = require('main-bower-files');
var gulpfilter = require('gulp-filter');
var openUrl = require('gulp-open');
var sequence = require('gulp-sequence');
var modrewrite = require('connect-modrewrite');
var modrewrite = require('connect-modrewrite');

var config = {
  autoprefixer: {
    browsers: ['last 2 versions'],
    cascade: false
  },
  scssOrder: ['**/app.scss'],
  jsOrder: ['**/app.js']
};

var path = {};
path.dev = 'dev/publicDev';
path.dest = 'dev/public';
path.jade = path.dev + '/**/*.jade';
path.css = path.dev + '/**/*.scss';
path.js = path.dev + '/**/*.js';
path.assets = path.dev + '/files/**/*';

gulp.task('compile-jade', function() {
  return gulp.src(path.jade)
    .pipe( plumber() )
    .pipe( jade() )
    .on('error', log)
    .pipe( gulp.dest(path.dest) )
    .pipe( connect.reload() )
});

//  compile app.css file (default readable, --prod to minify)
gulp.task('app-css', function () {
  return gulp.src(path.css)
    .pipe( order(config.scssOrder) )
    .pipe( concat('app.css') )
    .pipe( plumber() )
    .pipe( sass() )
    .pipe( autoprefixer(config.autoprefixer) )
    // .pipe( minCss() )
    .on('error', log )
    .pipe( gulp.dest(path.dest) )
    .pipe( connect.reload() );
});

//  compile app.js file (default readable, --prod to minify)
gulp.task('app-js', function () {
  return gulp.src(path.js)
    .pipe( plumber() )
    .pipe( order(config.jsOrder) )
    .pipe( concat('app.js') )
    // .pipe( minJs() )
    .on( 'error', log )
    .pipe( gulp.dest(path.dest) )
    .pipe( connect.reload() );
});

//  compile lib.js file from bower_components (default readable, --prod to minify)
gulp.task('lib-js', function () {
  var filter = gulpfilter(['**/**.js']);

  return gulp.src(bowerFiles())
    .pipe(filter)
    .pipe( plumber() )
    .pipe( concat('libs.js') )
    .on('error', log )
    .pipe( gulp.dest(path.dest) );
});

//  compile lib.css file from bower_components (default min)
gulp.task('lib-css', function () {
  var filter = gulpfilter(['**/**.css']);

  return gulp.src(bowerFiles())
    .pipe(filter)
    .pipe( plumber() )
    .pipe( concat('libs.css') )
    .on('error', log )
    .pipe( gulp.dest(path.dest) );
});

//  copy font files, image files, etc.
gulp.task('assets', function () {
  return gulp.src(path.assets)
    .pipe( gulp.dest(path.dest + '/files') );
});

// Dev tasks
gulp.task('server', function() {
  return connect.server({
    root: path.dest,
    port: 9000,
    livereload: true,
    middleware: function(connect, o) {
      return [
        modrewrite(
          [
            '^/api/(.*)$ http://localhost:80/api/$1 [P]',
            '^/uploads/(.*)$ http://localhost:80/uploads/$1 [P]'
          ]
        )
      ];
    }
  });
});

gulp.task('watch', function() {
  gulp.watch(path.js, ['app-js']);
  gulp.watch(path.jade, ['compile-jade']);
  gulp.watch(path.css, ['app-css']);
  return gulp.watch(path.assets, ['assets']);
});

gulp.task('openUrl', function() {
  return gulp.src(__filename)
    .pipe( openUrl({uri: 'http://localhost:9000/'}) );
});

gulp.task('clean', function() {
  return gulp.src(path.dest, {read: false})
    .pipe(clean());
});

gulp.task('netlify', function() {
  return gulp.src('_redirects')
    .pipe( gulp.dest(path.dest) );
});

// --------------------------------------------------

var buildTasks = ['assets', 'compile-jade', 'app-js', 'lib-js', 'app-css', 'lib-css', 'netlify'];

gulp.task('build', function() {
  return sequence(['clean'], buildTasks, function () {
      return log(' -| Builded');
    }
  );
});

gulp.task('dev', function() {
  return sequence(['clean'], buildTasks, ['server', 'watch'], 'openUrl', function() {
    return log(' -| Runned');
  });
});