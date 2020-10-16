const htmlMinifier = require('html-minifier');

const htmlmin = (content, outputPath) => {
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
};

module.exports.htmlmin = htmlmin;
