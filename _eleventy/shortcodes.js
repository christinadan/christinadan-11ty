const slugify = require('slugify');

const tagUrl = (tag) => `/blog/tags/${slugify(tag)}/`;
const categoryUrl = (cat) => `/blog/category/${slugify(cat)}/`;

module.exports = {
  tagUrl,
  categoryUrl,
};
