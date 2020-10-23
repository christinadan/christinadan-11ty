const path = require('path');

const getPathToSrc = (src) => {
  const sub = src.split('/');
  const filenameLength = sub[sub.length - 1].length;

  return src.slice(1, src.length - filenameLength - 1);
};

const getImageFormat = (src) => {
  const ext = src.split('.');
  const fileExt = ext[ext.length - 1];

  if (fileExt === 'jpg') {
    return 'jpeg';
  }

  return fileExt;
};

const getUrlPath = (pathToSrc) => `/media/${pathToSrc}`;

const getOutputDir = (pathToSrc) => `dist/media/${pathToSrc}`;

const imgFilenameFormat = (id, src, width, format) => {
  const ext = path.extname(src);
  const name = path.basename(src, ext);

  if (width) {
    return `${name}-${width}.${format}`;
  }

  return `${name}.${format}`;
};

module.exports = {
  getPathToSrc,
  getImageFormat,
  getUrlPath,
  getOutputDir,
  imgFilenameFormat,
};
