const { DateTime } = require('luxon');
const CleanCSS = require('clean-css');
const fs = require('fs');
const htmlMinifier = require('html-minifier');

module.exports = function (eleventyConfig) {
  // Allows the dev server to reload when css changes
  // Use .eleventyignore for files you don't want eleventy to track
  eleventyConfig.setUseGitIgnore(false);

  // Watch targets
  eleventyConfig.addWatchTarget('src/js');

  // Layout alias
  eleventyConfig.addLayoutAlias('base', 'layouts/base.njk');
  eleventyConfig.addLayoutAlias('page', 'layouts/page.njk');

  // Passthrough
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/js');
  eleventyConfig.addPassthroughCopy('src/static');
  eleventyConfig.addPassthroughCopy('src/robots.txt');

  // Filters
  eleventyConfig.addFilter('cssmin', (code) => {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  // HTML
  eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
    if (outputPath && outputPath.endsWith('.html')) {
      let minified = htmlMinifier.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      });

      return minified;
    }

    return content;
  });

  // 404
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: (err, browserSync) => {
        const content_404 = fs.readFileSync('dist/404.html');

        browserSync.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
  });

  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    templateFormats: ['md', 'njk', 'html', 'liquid'],
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
      data: '_data',
    },
  };
};
