const slugify = require('slugify');
const Image = require('@11ty/eleventy-img');

module.exports = {
  tagUrl: (tag) => {
    return `/blog/tags/${slugify(tag)}/`;
  },
  categoryUrl: (cat) => {
    return `/blog/category/${slugify(cat)}/`;
  },
  responsiveImage: async (src, alt, outputFormat = 'jpeg') => {
    if (!alt) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on img from: ${src}`);
    }

    const path = src.split('/');
    const subdir = path[path.length - 2];

    let stats = await Image('./dist' + src, {
      widths: [320, 640, 960, 1280, 1600],
      formats: [outputFormat, 'webp'],
      urlPath: `/media/${subdir}`,
      outputDir: `./dist/media/${subdir}`,
    });

    const lowestSrc = stats[outputFormat][0];
    const sizes =
      '(min-width: 1280px) 42rem, (min-width: 748px) 75vw, (min-width: 640px) 87vw, 92vw';
    const source = `<source type="image/webp" srcset="${stats['webp']
      .map((entry) => `${entry.url} ${entry.width}w`)
      .join(', ')}" sizes="${sizes}">`;
    const img = `<img src="${lowestSrc.url}" srcset="${stats[outputFormat]
      .map((entry) => `${entry.url} ${entry.width}w`)
      .join(', ')}" 
                      sizes="${sizes}"
                      width="${lowestSrc.width}"
                      height="${lowestSrc.height}"
                      loading="lazy"
                      alt="${alt}">`;
    // Iterate over formats and widths
    return `<picture>${source}${img}</picture>`;
  },
};
