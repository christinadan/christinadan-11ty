// Help snippets from gulp boilerplate: https://github.com/cferdinandi/gulp-boilerplate/blob/master/gulpfile.js
const {
  parallel, series, watch, src, dest,
} = require('gulp');
const sass = require('gulp-sass');
const del = require('del');
const flatmap = require('gulp-flatmap');
const lazypipe = require('lazypipe');
const rename = require('gulp-rename');
const header = require('gulp-header');
const concat = require('gulp-concat');
const uglify = require('gulp-terser');
const svgmin = require('gulp-svgmin');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const packageJson = require('./package.json');

// Paths to project folders ///////////////////////////////////////////////////
const paths = {
  input: 'src/',
  output: 'dist/',
  scripts: {
    input: 'src/assets/js/*.js',
    watch: 'src/assets/js/**/*.js',
    polyfills: '.polyfill.js',
    output: 'dist/assets/js/',
    inline: {
      input: 'src/assets/js/inline.js',
      output: 'src/_includes/global/js',
    },
  },
  styles: {
    input: 'src/assets/scss/*.scss',
    watch: 'src/assets/scss/**/*.scss',
    output: 'src/_includes/global/css',
    defer: {
      input: 'src/assets/scss/defer.scss',
      output: 'dist/assets/css',
    },
  },
  svgs: {
    input: 'src/assets/img/*.svg',
    output: 'dist/assets/img/',
  },
  copy: {
    input: 'src/posts/**/*.{jpg,jpeg,png,gif,webp,mp3,mp4,webm,ogg}',
    output: 'dist/media/posts',
  },
};

/**
 * Template for banner to add to file headers
 */

const banner = {
  main:
    `${'/*!<%= package.name %> v<%= package.version %> | (c) '}${new Date().getFullYear()} <%= package.author.name %>`
    + ' | <%= package.license %> License'
    + ' | <%= package.repository.url %>'
    + ' */\n',
};

// Remove pre-existing content from output folders
const cleanDest = (done) => {
  // Clean the dist folder
  del.sync([paths.output]);

  // Signal completion
  done();
};

// Repeated JavaScript tasks
const jsTasks = (file) => lazypipe()
  .pipe(rollup, { plugins: [babel(), resolve(), commonjs()] }, 'umd')
  .pipe(rename, { suffix: '.min' })
  .pipe(uglify)
  .pipe(header, banner.main, { package: packageJson })
  .pipe(
    dest,
    file.path.includes(paths.scripts.inline.input)
      ? paths.scripts.inline.output
      : paths.scripts.output,
  );

// Lint, minify, and concatenate scripts
const buildScripts = () =>
  // Run tasks on script files
  /* eslint-disable implicit-arrow-linebreak */
  src(paths.scripts.input).pipe(
    flatmap((stream, file) => {
      if (file.isDirectory()) {
        /* eslint-enable implicit-arrow-linebreak */
        // Setup a suffix variable
        const suffix = '';

        // Grab all files and concatenate them
        // If separate polyfills enabled, this will have .polyfills in the filename
        src(`${file.path}/*.js`)
          .pipe(concat(`${file.relative + suffix}.js`))
          .pipe(jsTasks(file)());

        return stream;
      }

      // Otherwise, process the file
      return stream.pipe(jsTasks(file)());
    }),
  );

const buildStyles = (done) => {
  src(paths.styles.input).pipe(
    flatmap((stream, file) => stream
      .pipe(
        sass({
          outputStyle: 'compressed',
        }).on('error', sass.logError),
      )
      .pipe(
        dest(
          file.path.includes(paths.styles.defer.input)
            ? paths.styles.defer.output
            : paths.styles.output,
        ),
      )),
  );
  done();
};

// Optimize SVG files
const buildSVGs = () => src(paths.svgs.input).pipe(svgmin()).pipe(dest(paths.svgs.output));

const copy = (done) => {
  src(paths.copy.input).pipe(dest(paths.copy.output));

  done();
};

const watchSource = (done) => {
  watch(
    [paths.styles.watch, paths.scripts.watch],
    parallel(buildStyles, buildScripts, buildSVGs, copy),
  );

  done();
};

// Build task
exports.default = series(cleanDest, parallel(buildStyles, buildScripts, buildSVGs, copy));
exports.watch = series(watchSource);
