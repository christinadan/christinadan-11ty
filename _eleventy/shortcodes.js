const slugify = require('slugify');
const fs = require('fs');
const Image = require('@11ty/eleventy-img');

const getPathToSrc = (src) => {
  const path = src.split('/');
  const filenameLength = path[path.length - 1].length;

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

module.exports = {
  tagUrl: (tag) => {
    return `/blog/tags/${slugify(tag)}/`;
  },
  categoryUrl: (cat) => {
    return `/blog/category/${slugify(cat)}/`;
  },
  responsiveImage: (src, alt, page) => {
    // if (!alt) {
    //   // You bet we throw an error on missing alt (alt="" works okay)
    //   throw new Error(`Missing \`alt\` on imageMulti from: ${src}`);
    // }

    // // Update this in gulpfile
    // const widths = [320, 640, 960, 1280, 1600, null];
    // const pathToSrc = getPathToSrc(page ? page.filePathStem : src);
    // const srcSet = [];
    // const webpSrcSet = [];

    // widths.forEach((width) => {
    //   const imgPath = `./dist/media/${pathToSrc}`;
    //   const imgExt = getImageFormat(src);
    //   const srcBase = `${src.slice(0, src.length - imgExt.length - 1)}`;
    //   const webpSrc = `${srcBase}.webp`;

    //   if (fs.existsSync(`${imgPath}/${srcBase}-${width}.${imgExt}`)) {
    //     srcSet.push(`/media/${pathToSrc}/${src} ${width}w`);
    //   }

    //   if (fs.existsSync(`${imgPath}/${webpSrcBase}-${width}.webp`)) {
    //     webpSrcSet.push(`/media/${pathToSrc}/${webpSrc} ${width}w`);
    //   }
    // });

    // const sizes =
    //   '(min-width: 1280px) 42rem, (min-width: 1024px) 67vw, (min-width: 748px) 82vw, (min-width: 640px) 87vw, 92vw';
    // const source = `<source type="image/webp" srcset="${srcSet.join(', ')}" sizes="${sizes}">`;
    // const img = `<img src="${lowestSrc.url}" srcset="${webpSrc.join(', ')}" 
    //   sizes="${sizes}"
    //   width="${lowestSrc.width}"
    //   height="${lowestSrc.height}"
    //   loading="lazy"
    //   alt="${alt}">`;
    // // Iterate over formats and widths
    // return `<picture>${source}${img}</picture>`;
  },
  imageMin: async (src, alt, page) => {
    if (!alt) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on imageMin from: ${src}`);
    }

    const pathToSrc = getPathToSrc(page ? page.filePathStem : src);
    const format = getImageFormat(src);
    const stats = await Image(`./src/${pathToSrc}/${src}`, {
      widths: [null],
      formats: [format],
      urlPath: `/media/${pathToSrc}`,
      outputDir: `./dist/media/${pathToSrc}`,
    });

    const props = stats[format].pop();

    return `<img src="${props.url}" width="${props.width}" height="${props.height}" alt="${alt}" loading="lazy">`;
  },
  imageMulti: async (src, alt, page) => {
    if (!alt) {
      // You bet we throw an error on missing alt (alt="" works okay)
      throw new Error(`Missing \`alt\` on imageMulti from: ${src}`);
    }

    const pathToSrc = getPathToSrc(page ? page.filePathStem : src);
    const format = getImageFormat(src);
    const stats = await Image(`./src/${pathToSrc}/${src}`, {
      widths: [320, 640, 960, 1280, 1600, null],
      formats: [format, 'webp'],
      urlPath: `/media/${pathToSrc}`,
      outputDir: `./dist/media/${pathToSrc}`,
    });

    const lowestSrc = stats[format][0];
    const sizes =
      '(min-width: 1280px) 42rem, (min-width: 1024px) 67vw, (min-width: 748px) 82vw, (min-width: 640px) 87vw, 92vw';
    const source = `<source type="image/webp" srcset="${stats['webp']
      .map((entry) => `${entry.url} ${entry.width}w`)
      .join(', ')}" sizes="${sizes}">`;
    const img = `<img src="${lowestSrc.url}" srcset="${stats[format]
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
  photoGallery: async (photos, page) => {
    const photoList = photos.map(async (photo) => {
      const src = photo.src;
      const alt = photo.alt;
      const pathToSrc = getPathToSrc(page ? page.filePathStem : src);
      const format = getImageFormat(src);
      const stats = await Image(`./src/${pathToSrc}/${src}`, {
        widths: [150, 300, 425, 550, 675, null],
        formats: [format],
        urlPath: `/media/${pathToSrc}`,
        outputDir: `./dist/media/${pathToSrc}`,
      });
      const lowestSrc = stats[format][0];
      const highestSrc = stats[format][stats[format].length - 1];
      const url = photo.url ? photo.url : highestSrc.url;
      const sizes = '(min-width: 748px) calc(40rem / 3), calc((100vw - 3rem) / 2)';
      // Height = width because it's a square
      const img = `<img src="${lowestSrc.url}" srcset="${stats[format]
        .map((entry) => `${entry.url} ${entry.width}w`)
        .join(', ')}" 
        sizes="${sizes}"
        width="${lowestSrc.width}"
        height="${lowestSrc.width}"
        loading="lazy"
        alt="${alt}">`;

      return `<li class="photo-thumbnail">
      <a class="photo-link" href="${url}">
        ${img}
      </a>
      </li>`;
    });

    const imgList = await Promise.all(photoList);

    return `<ol class="photo-gallery">${imgList.join('')}</ol>`;
  },
};
