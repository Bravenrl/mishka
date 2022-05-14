import gulp from 'gulp';
import plumber from 'gulp-plumber';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import gulpStylelint from 'gulp-stylelint';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename'


const sass = gulpSass(dartSass);
const browser = browserSync.create();

// Styles

export const styles = () => {
  return gulp
    .src('source/scss/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('source/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
};

// Stylelint

const lintCss = () => {
  return gulp.src('source/scss/**/*.scss').pipe(
    gulpStylelint({
      reporters: [{ formatter: 'string', console: true }],
    })
  );
};

// Server

const server = done => {
  browser.init({
    server: {
      baseDir: 'source',
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

// Watcher

const watcher = () => {
  gulp.watch('source/scss/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
};

export default gulp.series(styles, lintCss, server, watcher);
