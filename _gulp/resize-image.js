const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const merge = require('merge2');
const rename = require('gulp-rename');
const newer = require('gulp-newer');
const through = require('through2')
const sharp = require('sharp');
const globby = require('globby');
const del = require('del');
const path = require('path');

const _resize = (width, format) => {
  return through.obj(async (chunk, enc, cb) => {
    const file = chunk.clone({contents: false});

    if (file.isNull()) {
      return cb(null, file);
    }

    const sharpImage = sharp(file.contents);
    const metadata = await sharpImage.metadata();

    // If desired width is larger than the original image's width, skip
    if (width > metadata.width) {
      cb(null, null);
    } else {
      if (!width) {
        width = metadata.width;
      }

      const imageFormat = sharpImage.clone();

      if (format && metadata.format !== format) {
        imageFormat.toFormat(format);
      }

      const buffer = await imageFormat.resize({
        width: width,
        withoutEnlargement: true
      }).toBuffer();

      file.contents = buffer;
        
      cb(null, file);
    }
  });
};

// src should be a file path to an image or a buffer
const resizeImage = (src, dest, widths, formats = []) => {
   /*
  We can map each element of this array to a Gulp stream.
  Each of those streams selects each of the original images
  and creates one variant.
  */
  const streams = [];

  if (!formats.length) {
    formats.push(null);
  }
  
  widths.forEach(width =>  {
    formats.forEach(format => {
      streams.push(
        gulp.src(src)
          .pipe(rename(file => {
            if (width) {
              file.basename += '-' + width;
            }

            if (format) {
              file.extname = `.${format}`;
            }
          }))
          /*
          This is where the "incremental" builds kick in.
          Before we run the heavy processing and resizing tasks,
          we filter elements that don't have any updates.
          This Gulp tasks checks whether the results in "images" are
          older than the source items.
          */
          .pipe(newer(dest))
          .pipe(_resize(width, format))
          .pipe(imagemin())
          .pipe(gulp.dest(dest))
      );
    });
  });

  return merge(streams);
};

const _addSuffix = (name, w) => {
  const p = path.parse(name);
  p.name = `${p.name}-${w}`;
  return path.format(p);
}

const imageDiff = async (globs, widths) => {
  return Promise.all([
    /* First, we select all files in the destination. */
    globby(globs, { cwd: 'dist', nodir: true }),
    /* In parallel, we select all files in the source
       folder. Because they don't have the width suffix,
       we add them for every image width after selecting. */
    () => globby(globs, { cwd: 'src', nodir: true }).then(files => {
      return files.map(el => widths.map(w => _addSuffix(el, w)));
    })
  ])
  /* This is the diffing process. All file names that
     are in the destination directory but not in the source
     directory are kept in this array. Everything else is
     filtered. */
  .then(paths => paths[0]
    .filter(i => paths[i].indexOf(i) < 0))
  /* The array now consists of files that are in "dest"
     but not in "src." They are leftovers and should be
     deleted. */
  .then(diffs => del(diffs));
};

module.exports = {
  resizeImage,
  imageDiff
}
