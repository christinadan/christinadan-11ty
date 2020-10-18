const fs = require('fs');
const { tagList, categoryList, categories } = require('./.eleventy/collections');
const { cssmin, htmlDateString, md, jsmin, readableDate, media } = require('./.eleventy/filters');
const { mdIt } = require('./.eleventy/libraries');
const { tagUrl, categoryUrl, responsiveImage } = require('./.eleventy/shortcodes');
const { htmlmin } = require('./.eleventy/transforms');

module.exports = function (eleventyConfig) {
  // Passthrough
  eleventyConfig.addPassthroughCopy('src/assets/img');
  eleventyConfig.addPassthroughCopy('src/assets/static');
  eleventyConfig.addPassthroughCopy('src/robots.txt');

  // Watch targets
  eleventyConfig.addWatchTarget('src/assets/js');
  eleventyConfig.addWatchTarget('src/assets/img');
  eleventyConfig.addWatchTarget('.eleventy');

  // Layout alias
  eleventyConfig.addLayoutAlias('base', 'layouts/base.njk');
  eleventyConfig.addLayoutAlias('home', 'layouts/home.njk');
  eleventyConfig.addLayoutAlias('page', 'layouts/page.njk');
  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');

  // Filters
  eleventyConfig.addFilter('cssmin', cssmin);
  eleventyConfig.addFilter('readableDate', readableDate);
  eleventyConfig.addFilter('htmlDateString', htmlDateString);
  eleventyConfig.addFilter('md', md);
  eleventyConfig.addFilter('media', media);
  eleventyConfig.addNunjucksAsyncFilter('jsmin', jsmin);

  // Transforms
  eleventyConfig.addTransform('htmlmin', htmlmin);

  // Shortcodes
  eleventyConfig.addShortcode('tagUrl', tagUrl);
  eleventyConfig.addShortcode('categoryUrl', categoryUrl);
  eleventyConfig.addNunjucksAsyncShortcode('responsiveImage', responsiveImage);

  // Collections
  eleventyConfig.addCollection('tagList', tagList);
  eleventyConfig.addCollection('categoryList', categoryList);
  eleventyConfig.addCollection('categories', categories);

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
