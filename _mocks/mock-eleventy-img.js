const path = require('path');
const sizeOf = require('image-size');

const srcPath = (src) => {
  const sub = src.split('.');
  const srcWithPath = sub[1];
  return srcWithPath.slice(5, path.length);
};

const image = async (src, options) => {
  const result = {};
  const basename = path.basename(src).split('.')[0];

  options.formats.forEach((format) => {
    result[format] = [];

    for (let i = 0; i < options.widths.length; i++) {
      const width = options.widths[i];
      const srcWidth = sizeOf(src).width;

      if (srcWidth > width) {
        result[format].push({
          format,
          width,
          height: (width * 9) / 16,
          url: `${options.urlPath}/${basename}-${width}.${format}`,
          sourceType: `image/${format}`,
          srcset: `${options.urlPath}/${basename}-${width}.${format} ${width}w`,
          outputPath: `${options.outputDir}/${srcPath(src)}-${width}.${format}`,
          size: 783799, // Not currently using
        });
      } else {
        result[format].push({
          format,
          width: srcWidth,
          height: (srcWidth * 9) / 16,
          url: `${options.urlPath}/${basename}.${format}`,
          sourceType: `image/${format}`,
          srcset: `${options.urlPath}/${basename}.${format} ${srcWidth}w`,
          outputPath: `${options.outputDir}/${srcPath(src)}.${format}`,
          size: 783799, // Not currently using
        });

        i = options.widths.length;
      }
    }
  });

  return result;
};

module.exports = image;
