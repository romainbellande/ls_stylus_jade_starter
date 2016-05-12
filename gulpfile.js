var gulp        = require('gulp'),
server          = require('gulp-server-livereload'),
watch           = require('gulp-watch'),
stylus          = require('gulp-stylus'),
gulpJade        = require('gulp-jade'),
jade            = require('jade'),
livescript      = require('gulp-livescript'),
livereload      = require('gulp-livereload'),
sourcemaps      = require('gulp-sourcemaps'),
angularFilesort = require('gulp-angular-filesort'),
inject          = require('gulp-inject'),
wiredep         = require('wiredep').stream,
usemin          = require('gulp-usemin'),
minifyCss       = require('gulp-clean-css'),
concat          = require('gulp-concat'),
concatCss       = require('gulp-concat-css'),
uglify          = require('gulp-uglify'),
rev             = require('gulp-rev'),
minifyHtml      = require('gulp-htmlmin'),
clean           = require('gulp-clean');

var paths = {
  ls: ['./src/**/*.ls'],
  jade: ['./src/**/*.jade'],
  stylus: ['./src/**/*.styl'],
  js: ['./build/app/**/*.js'],
  html: ['./build/**/*.html'],
  css: ['assets/**/*.css', 'app/**/*.css'],
  maps: '.',
  bower_dir: './build/lib/',
  bower_files: './build/lib/**/*.*',
  inject_js: ['!**/app.**.js', 'app/**/*.js'],
  inject_css: ['assets/**/*.css', 'app/**/*.css']
};

gulp.task('default', function() {
  // place code for your default task here
  });

gulp.task('injection', ['ls', 'stylus', 'jade'], function(){
  return gulp.src('./build/index.html')
  .pipe(inject(
    gulp.src(paths.inject_js, {'cwd': __dirname + '/build'})
    .pipe(angularFilesort()),
    { addRootSlash: false }
    ))
  .pipe(inject(
    gulp.src(paths.inject_css, {'cwd': __dirname + '/build'}), { addRootSlash: false }))
  .pipe(gulp.dest('./build'));
  });

gulp.task('wiredep', ['injection'], function(){
  return gulp.src('./build/index.html')
  .pipe(wiredep({
    directory: paths.bower_dir,
    devDependencies: true
    }))
  .pipe(gulp.dest('./build'));
  });

gulp.task('clean_dist', function () {
  return gulp.src('dist/', {read: false})
  .pipe(clean());
  });

gulp.task('ls', function() {
  return gulp.src(paths.ls)
  .pipe(sourcemaps.init())
  .pipe(livescript())
  .pipe(sourcemaps.write(paths.maps))
  .pipe(gulp.dest('./build/'));
  });

gulp.task('jade', function() {
  return gulp.src(paths.jade)
  .pipe(sourcemaps.init())
  .pipe(gulpJade({
    jade: jade,
    pretty: true
    }))
  .pipe(sourcemaps.write(paths.maps))
  .pipe(gulp.dest('./build/'))
  });

gulp.task('stylus', function () {
  return gulp.src(paths.stylus)
  .pipe(sourcemaps.init())
  .pipe(stylus())
  .pipe(sourcemaps.write(paths.maps))
  .pipe(gulp.dest('./build/'));
  });

gulp.task('watch', function () {
  gulp.watch(paths.ls, ['ls']);
  gulp.watch(paths.jade, ['jade', 'injection']);
  gulp.watch(paths.bower_files, ['wiredep']);
  });

gulp.task('usemin', ['clean_dist'], function() {
  return gulp.src(paths.html)
  .pipe(usemin({
    css: [ minifyCss(), rev() ],
    html: [ minifyHtml({collapseWhitespace: true}) ],
    js: [ uglify(), rev() ],
    inlinejs: [ uglify() ],
    inlinecss: [ minifyCss() ]
    }))
  .pipe(gulp.dest('./dist/'));
  });

gulp.task('web-server', ['watch', 'builder'], function () {
  gulp.src('./build/')
  .pipe(server({
    livereload: {
      enable: true,
      filter: function (filename, cb) {
        cb(!/\.ls$|\.jade$|node_modules/.test(filename));
      }
      },
      directoryListing: false,
      open: true
      }));
  });

gulp.task('builder', ['ls','jade', 'stylus', 'injection', 'wiredep']);
gulp.task('serve', ['builder', 'web-server']);
gulp.task('dist', ['builder', 'clean_dist', 'usemin']);





