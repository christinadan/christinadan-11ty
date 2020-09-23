const {
  parallel, series, watch, src, dest,
} = require('gulp');
const sass = require('gulp-sass');
const del = require('del');

// Default settings for gulpfile
const project = {
  src: 'src/',
  dest: 'dist/',
  includes: 'src/_includes/css',
  scripts: 'src/js/**/*.js',
  styles: 'src/scss/**/*.scss',
};

// Remove pre-existing content from output folders
const cleanDest = (done) => {
  // Clean the dist folder
  del.sync([project.dest]);

  // Signal completion
  return done();
};

const buildStyles = (done) => {
  src(project.styles)
    .pipe(
      sass({
        outputStyle: 'compressed',
      }).on('error', sass.logError),
    )
    .pipe(dest(project.includes));
  done();
};

const watchSource = (done) => {
  watch(project.styles, { ignoreInitial: true }, buildStyles);

  done();
};

// Build task
exports.default = series(cleanDest, parallel(buildStyles));
exports.watch = series(watchSource);
