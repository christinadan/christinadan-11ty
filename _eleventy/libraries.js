const markdownIt = require('markdown-it');
const mdLinkAttributes = require('markdown-it-link-attributes');
const mdAnchor = require('markdown-it-anchor');
const mdAttr = require('markdown-it-attrs');

module.exports = {
  mdIt: markdownIt({
    html: true,
  })
    .use(mdLinkAttributes, {
      pattern: /^https{0,1}\:\/\//gi,
      attrs: {
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    })
    .use(mdAnchor, {
      level: [2, 3],
      permalink: true,
      permalinkClass: 'heading-anchor',
      permalinkSymbol: '#',
    })
    .use(mdAttr),
};
