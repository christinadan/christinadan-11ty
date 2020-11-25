const fs = require('fs');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const images = require('./_eleventy/plugins/images');
const collections = require('./_eleventy/collections');
const transforms = require('./_eleventy/transforms');
const shortcodes = require('./_eleventy/shortcodes');
const { mdIt } = require('./_eleventy/libraries');
const { filters, nunjunksAsyncFilters } = require('./_eleventy/filters');

module.exports = function (eleventyConfig) {
  // Filters
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName]);
  });
  Object.keys(nunjunksAsyncFilters).forEach((filterName) => {
    eleventyConfig.addNunjucksAsyncFilter(filterName, nunjunksAsyncFilters[filterName]);
  });
  // Collections
  Object.keys(collections).forEach((collectionName) => {
    eleventyConfig.addCollection(collectionName, collections[collectionName]);
  });
  // Transforms
  Object.keys(transforms).forEach((transformName) => {
    eleventyConfig.addTransform(transformName, transforms[transformName]);
  });
  // Shortcodes
  Object.keys(shortcodes).forEach((shortcodeName) => {
    eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName]);
  });

  // Plugins
  eleventyConfig.addPlugin(images);
  eleventyConfig.addPlugin(pluginRss);

  // Passthrough
  eleventyConfig.addPassthroughCopy('src/assets/img');
  eleventyConfig.addPassthroughCopy('src/assets/static');
  eleventyConfig.addPassthroughCopy('src/robots.txt');
  eleventyConfig.addPassthroughCopy('src/favicon.ico');

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
