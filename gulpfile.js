import gulp from 'gulp';
import plumber from 'gulp-plumber';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import gulpStylelint from 'gulp-stylelint';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import webp from 'gulp-webp';
import svgstore from 'gulp-svgstore';
import htmlmin from 'gulp-htmlmin';
import del from 'del';
import csso from 'postcss-csso';
import terser from 'gulp-terser';
import fileinclude from 'gulp-file-include';
import imagemin, { mozjpeg, optipng, svgo } from 'gulp-imagemin';

const sass = gulpSass(dartSass);
const browser = browserSync.create();

// Styles

export const styles = () => {
  return gulp
    .src('source/scss/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
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

// HTML

const minifyHtml = () => {
  return gulp
    .src(['source/**/*.html', '!source/components/**/*.html'])
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'))
    .pipe(browser.stream());
};

// Js

const compressScripts = () => {
  return gulp
    .src('source/js/script.js')
    .pipe(terser())
    .pipe(rename('script.min.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(browser.stream());
};

// Images

const createWebp = () => {
  return gulp
    .src('source/img/**/*.{jpg,png}')
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest('build/img'));
};

const optimizeImages = () => {
  return gulp
    .src('source/img/**/*.{jpg,png,svg}')
    .pipe(
      imagemin([
        mozjpeg({ quality: 90, progressive: true }),
        optipng({ optimizationLevel: 3 }),
        svgo(),
      ])
    );
};

const copyImages = () => {
  return gulp
    .src(['source/img/**/*.{jpg,png,svg}', '!source/img/icons/*.svg'])
    .pipe(gulp.dest('build/img'));
};

// Sprite

const createSprite = () => {
  return gulp
    .src('source/img/icons/**/*.svg')
    .pipe(rename({ prefix: 'icon-' }))
    .pipe(svgstore())
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
};

// Server

const server = done => {
  browser.init({
    server: {
      baseDir: 'build',
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
  gulp.watch('source/*.html', gulp.series(minifyHtml));
};

// Copy

const createCopy = done => {
  gulp
    .src(['source/fonts/*.{woff2,woff}', 'source/*.ico'], {
      base: 'source',
    })
    .pipe(gulp.dest('build'));
  done();
};

// Clean

const clean = () => {
  return del('build');
};

// Build

const build = gulp.series(
  clean,
  createCopy,
  optimizeImages,
  copyImages,
  gulp.parallel(styles, minifyHtml, compressScripts, createSprite, createWebp)
);

// Default

export default gulp.series(
  clean,
  createCopy,
  copyImages,
  gulp.parallel(styles, minifyHtml, compressScripts, createSprite, createWebp),
  gulp.series(server, watcher)
);

export { build };
