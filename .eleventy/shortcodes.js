const slugify = require('slugify');

const tagUrl = (tag) => {
  return `/blog/tags/${slugify(tag)}/`;
};

const categoryUrl = (cat) => {
  return `/blog/category/${slugify(cat)}/`;
};

module.exports.tagUrl = tagUrl;
module.exports.categoryUrl = categoryUrl;
