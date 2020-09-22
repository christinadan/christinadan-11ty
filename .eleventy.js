<<<<<<< HEAD
const CleanCSS = require('clean-css');

module.exports = function (eleventyConfig) {
  // Filter adds css minifier
  eleventyConfig.addFilter('cssmin', (code) => {
    return new CleanCSS({}).minify(code).styles;
  });

  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    templateFormats: ['md', 'njk', 'html', 'liquid'],
=======
module.exports = function(eleventyConfig) {
  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],
>>>>>>> Add: eleventy dependency
    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
<<<<<<< HEAD
    pathPrefix: '/',
    passthroughFileCopy: true,
    dir: {
      input: 'src',
      includes: '_includes',
      output: 'dist',
    },
  };
};
=======
    pathPrefix: "/",
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "dist"
    }
  };
};
>>>>>>> Add: eleventy dependency
