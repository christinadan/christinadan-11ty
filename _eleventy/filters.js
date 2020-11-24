const CleanCSS = require('clean-css');
const { DateTime } = require('luxon');
const { minify } = require('terser');
const slugify = require('slugify');
const sanitizeHTML = require('sanitize-html');
const { mdIt } = require('./libraries');

const filters = {
  cssmin: (code) => new CleanCSS({}).minify(code).styles,
  readableDate: (dateObj) => DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('LLL dd, yyyy'),
  htmlDateString: (dateObj) => DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd'),
  sitemapDate: (dateObj) => {
    const dt = DateTime.fromJSDate(dateObj, { zone: 'utc' });
    if (!dt.isValid) {
      return '';
    }
    return dt.toISO();
  },
  md: (content = '') => mdIt.renderInline(content),
  media: (filename, page) => {
    // Clever way of being able to handle storing media with posts by Max @ https://github.com/maxboeck/mxb
    const path = page.inputPath.split('/');

    if (path.length && path.includes('posts')) {
      const subdir = path[path.length - 2];
      return `/media/posts/${subdir}/${filename}`;
    }

    return filename;
  },
  slugify: (str) => slugify(str, {
    replacement: '-',
    remove: /[*+~.()'"!:@?#]/g,
    lower: true,
  }),
  getWebmentionsForUrl: (webmentions, url) => webmentions.children.filter((entry) => entry['wm-target'] === url),
  size: (mentions) => (!mentions ? 0 : mentions.length),
  webmentionsByType: (mentions, mentionType) => mentions
    .filter((entry) => (Array.isArray(mentionType)
      ? mentionType.includes(entry['wm-property'])
      : !!entry[mentionType]))
    .map((entry) => {
      const { content } = entry;
      if (content['content-type'] === 'text/html') {
        content.value = sanitizeHTML(content.value);
      }
      return entry;
    }),
  readableDateTime: (dateStr, formatStr = "dd LLL yyyy 'at' hh:mma") => DateTime.fromISO(dateStr).toFormat(formatStr),
};

const nunjunksAsyncFilters = {
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
};

module.exports = {
  filters,
  nunjunksAsyncFilters,
};
