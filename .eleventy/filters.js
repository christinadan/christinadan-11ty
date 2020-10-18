const CleanCSS = require('clean-css');
const { DateTime } = require('luxon');
const { minify } = require('terser');
const { mdIt } = require('./libraries');

module.exports = {
  cssmin: (code) => {
    return new CleanCSS({}).minify(code).styles;
  },
  readableDate: (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('LLL dd, yyyy');
  },
  htmlDateString: (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  },
  md: (content = '') => {
    return mdIt.render(content);
  },
  jsmin: async (code, callback) => {
    try {
      const minified = await minify(code);

      callback(null, minified.code);
    } catch (err) {
      console.error('Terser error: ', err);
      // Fail gracefully.
      callback(null, code);
    }
  },
  media: (filename, page) => {
    // Clever way of being able to handle storing media with posts by Max @ https://github.com/maxboeck/mxb
    const path = page.inputPath.split('/');

    if (path.length && path.includes('posts')) {
      const subdir = path[path.length - 2];
      return `/media/${subdir}/${filename}`;
    }

    return filename;
  },
};
