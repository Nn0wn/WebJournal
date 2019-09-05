/* eslint-disable node/no-unpublished-require */
const {
  watch, src, dest, series, parallel
} = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const cleanHTML = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const plumber = require('gulp-plumber');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
/* eslint-enable node/no-unpublished-require */

function sassTranslate() {
  return src('dev/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['defaults'],
        cascade: true
      })
    )
    .pipe(cssnano())
    .pipe(dest('./public/stylesheets'))
    .pipe(browserSync.stream());
}

function pugTranslate() {
  return src('dev/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(cleanHTML())
    .pipe(dest('views'));
}

function jsTranslate() {
  return src('dev/js/*.js')
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(dest('./public/javascripts'));
}

function nodemonTask(done) {
  let started = false;
  nodemon({
    script: 'app.js',
    ext: 'js pug',
    env: { NODE_ENV: 'development' },
    done
  })
    .on('start', () => {
      if (!started) {
        done();
        started = true;
      }
    })
    .on('restart', () => {
      setTimeout(() => {
        browserSync.reload({
          stream: false
        });
      }, 100);
    });
}

function browserSyncTask(done) {
  browserSync.init(
    null,
    {
      proxy: 'http://localhost:3000',
      files: ['dev/**/*.*'],
      port: 5000
    },
    done
  );
}

function watchTask() {
  watch('dev/scss/**/*.scss', sassTranslate);
  watch('dev/**/*.pug', pugTranslate);
  watch('dev/**/*.js', jsTranslate);
}

// gulp.task('watch', () => {
//   gulp.watch('dev/scss/**/*.scss', gulp.parallel('sass'));
//   gulp.watch('dev/**/*.pug', gulp.parallel('pug'));
// });

// gulp.task('default', gulp.parallel('sass', 'pug', 'watch')});

module.exports.default = series(
  // parallel(sassTranslate, pugTranslate),

  parallel(sassTranslate, pugTranslate, jsTranslate),
  nodemonTask,
  browserSyncTask,
  watchTask
);
