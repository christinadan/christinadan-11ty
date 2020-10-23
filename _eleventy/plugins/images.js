let Image = require('@11ty/eleventy-img');
const mockImage = require('../../_mocks/mock-eleventy-img');
let { cropSquare } = require('../../scripts/crop');
const {
  getPathToSrc,
  getImageFormat,
  getUrlPath,
  getOutputDir,
  imgFilenameFormat,
} = require('../../scripts/helpers');

if (process.env.ELEVENTY_ENV === 'dev') {
  cropSquare = (src) => src;
  Image = mockImage;
}

async function responsiveImage(src, alt) {
  if (!alt) {
    // You bet we throw an error on missing alt (alt="" works okay)
    throw new Error(`Missing \`alt\` on imageMulti from: ${src}`);
  }
  const pathToSrc = getPathToSrc(src.includes('/') ? src : this.page.filePathStem);
  const format = getImageFormat(src);
  const stats = await Image(`./src/${pathToSrc}/${src}`, {
    widths: [320, 640, 960, 1280, 1680],
    formats: [format, 'webp'],
    urlPath: getUrlPath(pathToSrc),
    outputDir: getOutputDir(pathToSrc),
    filenameFormat: imgFilenameFormat,
  });

  const lowestSrc = stats[format][0];
  const sizes = '(min-width: 1280px) 42rem, (min-width: 1024px) 67vw, (min-width: 748px) 82vw, (min-width: 640px) 87vw, 92vw';
  const source = `<source type="image/webp" srcset="${stats.webp
    .map((entry) => `${entry.url} ${entry.width}w`)
    .join(', ')}" sizes="${sizes}">`;
  const img = `<img src="${lowestSrc.url}" srcset="${stats[format]
    .map((entry) => `${entry.url} ${entry.width}w`)
    .join(', ')}" 
  sizes="${sizes}"
  width="${lowestSrc.width}"
  height="${lowestSrc.height}"
  loading="lazy"
  decoding="async"
  alt="${alt}">`;

  // Iterate over formats and widths
  return `<picture>${source}${img}</picture>`;
}

async function photoGallery(photos) {
  const photoList = photos.map(async (photo) => {
    const { src, alt } = photo;
    const pathToSrc = getPathToSrc(src.startsWith('/') ? src : this.page.filePathStem);
    const srcPath = `./src/${pathToSrc}/${src}`;
    const format = getImageFormat(src);

    const squareCrop = await cropSquare(srcPath);

    const stats = await Image(squareCrop, {
      widths: [150, 300, 425, 550, 675],
      formats: [format, 'webp'],
      sourceUrl: srcPath,
      urlPath: getUrlPath(pathToSrc),
      outputDir: getOutputDir(pathToSrc),
      filenameFormat: imgFilenameFormat,
    });

    const lowestSrc = stats[format][0];
    const url = photo.url ? photo.url : `/media/${pathToSrc}/${src}`;
    const sizes = '(min-width: 748px) calc(40rem / 3), calc((100vw - 3rem) / 2)';

    const source = `<source type="image/webp" srcset="${stats.webp
      .map((entry) => `${entry.url} ${entry.width}w`)
      .join(', ')}" sizes="${sizes}">`;

    const img = `<img src="${lowestSrc.url}" srcset="${stats[format]
      .map((entry) => `${entry.url} ${entry.width}w`)
      .join(', ')}" 
    sizes="${sizes}"
    width="${lowestSrc.width}"
    height="${lowestSrc.height}"
    loading="lazy"
    decoding="async"
    alt="${alt}">`;

    return `<li class="photo-thumbnail">
    <a class="photo-link" href="${url}">
      <picture>${source}${img}</picture>
    </a>
    </li>`;
  });

  const imgList = await Promise.all(photoList);

  return `<ol class="photo-gallery">${imgList.join('')}</ol>`;
}

module.exports = {
  configFunction: (eleventyConfig) => {
    eleventyConfig.addNunjucksAsyncShortcode('responsiveImage', responsiveImage);
    eleventyConfig.addNunjucksAsyncShortcode('photoGallery', photoGallery);
  },
};
