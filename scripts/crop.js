const sharp = require('sharp');
const sizeOf = require('image-size');

// finds the best crop of src and writes the cropped and resized image to dest.
async function cropSquare(src) {
  const size = sizeOf(src);
  const { width, height } = size;
  let sideLength = width;
  let left = 0;
  let top = Math.floor((height - width) / 2);

  if (width > height) {
    sideLength = height;
    left = Math.floor((width - height) / 2);
    top = 0;
  }

  return sharp(src)
    .extract({
      width: sideLength,
      height: sideLength,
      left,
      top,
    })
    .toBuffer();
}

module.exports = {
  cropSquare,
};
