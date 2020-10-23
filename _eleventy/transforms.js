const htmlMinifier = require('html-minifier');

module.exports = {
  htmlmin: (content, outputPath) => {
    if (outputPath && outputPath.endsWith('.html')) {
      const minified = htmlMinifier.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      });

      return minified;
    }

    return content;
  },
};
