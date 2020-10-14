const CleanCSS = require('clean-css');
const { DateTime } = require('luxon');
const { minify } = require('terser');
const { mdIt } = require('./libraries');

const cssmin = (code) => {
  return new CleanCSS({}).minify(code).styles;
};

const readableDate = (dateObj) => {
  return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('LLL dd, yyyy');
};

const htmlDateString = (dateObj) => {
  return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
};

const md = (content = '') => {
  return mdIt.render(content);
};

const jsmin = async (code, callback) => {
  try {
    const minified = await minify(code);

    callback(null, minified.code);
  } catch (err) {
    console.error('Terser error: ', err);
    // Fail gracefully.
    callback(null, code);
  }
};

module.exports.cssmin = cssmin;
module.exports.readableDate = readableDate;
module.exports.htmlDateString = htmlDateString;
module.exports.md = md;
module.exports.jsmin = jsmin;
