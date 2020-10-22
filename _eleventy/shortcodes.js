const slugify = require('slugify');
const Image = require('@11ty/eleventy-img');
const path = require('path');

const getPathToSrc = (src) => {
  const sub = src.split('/');
  const filenameLength = sub[sub.length - 1].length;

  return src.slice(1, src.length - filenameLength - 1);
};

const getImageFormat = (src) => {
  const ext = src.split('.');
  const fileExt = ext[ext.length - 1];

  if (fileExt === 'jpg') {
    return 'jpeg';
  }

  return fileExt;
};

const getUrlPath = (pathToSrc) => `/media/${pathToSrc}`;

const getOutputDir = (pathToSrc) => `./dist/media/${pathToSrc}`;

const imgFilenameFormat = (id, src, width, format) => {
  const ext = path.extname(src);
  const name = path.basename(src, ext);

  if (width) {
    return `${name}-${width}.${format}`;
  }

  return `${name}.${format}`;
};

module.exports = {
  tagUrl: (tag) => `/blog/tags/${slugify(tag)}/`,
  categoryUrl: (cat) => `/blog/category/${slugify(cat)}/`,
  responsiveImage: async (src, alt, page) => {
    if (!alt) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on imageMulti from: ${src}`);
    }

    const pathToSrc = getPathToSrc(page ? page.filePathStem : src);
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
  },
  photoGallery: async (photos, page) => {
    const photoList = photos.map(async (photo) => {
      const { src, alt } = photo;
      const pathToSrc = getPathToSrc(page ? page.filePathStem : src);
      const format = getImageFormat(src);

      const stats = await Image(`./src/${pathToSrc}/${src}`, {
        widths: [150, 300, 425, 550, 675],
        formats: [format, 'webp'],
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
  },
};
