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
const packageJson = require('./package.json');

// Paths to project folders ///////////////////////////////////////////////////
const paths = {
  input: 'src/',
  output: 'dist/',
  scripts: {
    input: 'src/assets/js/**/*.js',
    polyfills: '.polyfill.js',
    output: 'dist/assets/js/',
  },
  styles: {
    input: 'src/assets/scss/main.scss',
    watch: 'src/assets/scss/**/*.scss',
    output: 'src/_includes/global/css',
  },
  svgs: {
    input: 'src/assets/img/*.svg',
    output: 'dist/assets/img/',
  },
  postImages: {
    input: ['src/posts/*/*.{jpg,jpeg,png,gif,webp}'],
    output: 'dist/media',
    widths: [320, 640, 960, 1280, 1600, null],
    formats: [null, 'webp'],
  },
  galleryImages: {
    input: ['src/posts/*/gallery/*.{jpg,jpeg,png,gif,webp}'],
    output: 'dist/media',
    widths: [150, 300, 425, 550, 675, null],
    formats: [null],
  },
  imageDiff: {
    input: ['src/media/**/*.{jpg,jpeg,png,gif,webp}'],
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
  del.sync([paths.scripts.output, paths.scripts.output, paths.svgs.output]);

  // Signal completion
  done();
};

// Repeated JavaScript tasks
const jsTasks = lazypipe()
  .pipe(dest, paths.scripts.output)
  .pipe(rename, { suffix: '.min' })
  .pipe(uglify)
  .pipe(header, banner.main, { package: packageJson })
  .pipe(dest, paths.scripts.output);

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
          .pipe(jsTasks());

        return stream;
      }

      // Otherwise, process the file
      return stream.pipe(jsTasks());
    }),
  );

const buildStyles = (done) => {
  src(paths.styles.input)
    .pipe(
      sass({
        outputStyle: 'compressed',
      }).on('error', sass.logError),
    )
    .pipe(dest(paths.styles.output));

  done();
};

// Optimize SVG files
const buildSVGs = () => src(paths.svgs.input).pipe(svgmin()).pipe(dest(paths.svgs.output));

const watchSource = (done) => {
  watch(
    paths.styles.watch,
    { ignoreInitial: true },
    parallel(buildStyles, buildScripts, buildSVGs),
  );

  done();
};

// Build task
exports.default = series(cleanDest, parallel(buildStyles, buildScripts, buildSVGs));
exports.watch = series(watchSource);
