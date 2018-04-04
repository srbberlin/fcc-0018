const gulp = require('gulp')
const runSeq = require('run-sequence')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const browserify = require('browserify')
const babelify = require('babelify')
const browserSync = require('browser-sync').create()
const source = require('vinyl-source-stream')
const del = require('del')

var config = {
  src:     __dirname + '/src',
  htmlin:  __dirname + '/src/html/**/*.html',
  cssin:   __dirname + '/src/css/**/*.css',
  jsin:    __dirname + '/src/js/**/*.js',
  jsentry: __dirname + '/src/js/index.js',
  imgin:   __dirname + '/src/img/**/*',
  cssout:  __dirname + '/docs/css/',
  jsout:   __dirname + '/docs/js/',
  imgout:  __dirname + '/docs/img/',
  htmlout: __dirname + '/docs'
}

gulp.task('reload', function () {
  browserSync.reload()
})

gulp.task('serve', ['sass', 'scripts', 'images', 'html'], function () {
  browserSync.init({
    server: config.htmlout
  })

  gulp.watch(config.jsin, () => runSeq(['scripts', 'reload']))
  gulp.watch(config.cssin, () => runSeq(['sass', 'reload']))
  gulp.watch(config.imgin, () => runSeq(['images', 'reload']))
  gulp.watch(config.htmlin, () => runSeq(['html', 'reload']))
})

gulp.task('sass', function () {
  let path = config.cssin
  return gulp.src(path)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.cssout))
})

gulp.task('scripts', function () {
  return browserify({
    entries: config.jsentry,
    extensions: ['.js'],
    debug: true})
    .transform(babelify)
    .bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest(config.jsout))
})

gulp.task('images', function () {
  let path = config.imgin
  return gulp.src(path)
    .pipe(gulp.dest(config.imgout))
})

gulp.task('html', function () {
  let path = config.htmlin
  return gulp.src(path)
    .pipe(gulp.dest(config.htmlout))
})

gulp.task('clean', function () {
  let paths = [
    config.jsout + '/**/*.js',
    config.cssout + '/**/*.css',
    config.imgout + '/**/*',
    config.htmlout + '/**/*.html'
  ]
  let res
  res = del(paths)
  res.then(function () {
  }).catch(function () {
  })
  return res
})

gulp.task('build', ['scripts', 'sass', 'html', 'images'])

gulp.task('default', ['serve'])

