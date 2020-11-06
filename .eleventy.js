const fs = require('fs');
const images = require('./_eleventy/plugins/images');
const {
  tagList, categoryList, categories, doublePagination,
} = require('./_eleventy/collections');
const { mdIt } = require('./_eleventy/libraries');
const { tagUrl, categoryUrl } = require('./_eleventy/shortcodes');
const { htmlmin } = require('./_eleventy/transforms');
const {
  cssmin,
  htmlDateString,
  md,
  jsmin,
  readableDate,
  media,
  sitemapDate,
  slugify,
} = require('./_eleventy/filters');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(images);

  // Passthrough
  eleventyConfig.addPassthroughCopy('src/assets/img');
  eleventyConfig.addPassthroughCopy('src/assets/static');
  eleventyConfig.addPassthroughCopy('src/robots.txt');

  // Watch targets
  eleventyConfig.addWatchTarget('src/assets/js');
  eleventyConfig.addWatchTarget('src/assets/img');
  eleventyConfig.addWatchTarget('src/assets/scss');
  eleventyConfig.addWatchTarget('_eleventy');

  // Layout alias
  eleventyConfig.addLayoutAlias('base', 'layouts/base.njk');
  eleventyConfig.addLayoutAlias('home', 'layouts/home.njk');
  eleventyConfig.addLayoutAlias('page', 'layouts/page.njk');
  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');

  // Filters
  eleventyConfig.addFilter('cssmin', cssmin);
  eleventyConfig.addFilter('readableDate', readableDate);
  eleventyConfig.addFilter('htmlDateString', htmlDateString);
  eleventyConfig.addFilter('sitemapDate', sitemapDate);
  eleventyConfig.addFilter('md', md);
  eleventyConfig.addFilter('media', media);
  eleventyConfig.addFilter('slugify', slugify);
  eleventyConfig.addNunjucksAsyncFilter('jsmin', jsmin);

  // Transforms
  eleventyConfig.addTransform('htmlmin', htmlmin);

  // Shortcodes
  eleventyConfig.addShortcode('tagUrl', tagUrl);
  eleventyConfig.addShortcode('categoryUrl', categoryUrl);

  // Collections
  eleventyConfig.addCollection('tagList', tagList);
  eleventyConfig.addCollection('categoryList', categoryList);
  eleventyConfig.addCollection('categories', categories);
  eleventyConfig.addCollection('tagPagination', (collection) => doublePagination(collection, 'tags'));
  eleventyConfig.addCollection('categoryPagination', (collection) => doublePagination(collection, 'categories'));

  // 404
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: (err, browserSync) => {
        const content404 = fs.readFileSync('dist/404.html');

        browserSync.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content404);
          res.end();
        });
      },
    },
  });

  // Front matter
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    // Optional, default is "---"
    excerpt_separator: '<!-- excerpt -->',
    excerpt_alias: 'excerpt',
  });

  // Allows the dev server to reload when css changes
  // Use .eleventyignore for files you don't want eleventy to track
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.setWatchThrottleWaitTime(300); // in milliseconds

  // Libraries
  eleventyConfig.setLibrary('md', mdIt);

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
