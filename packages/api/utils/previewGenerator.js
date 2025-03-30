const { createCanvas } = require("canvas");

async function generatePreviewImage(size, pixels) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);

  pixels.forEach(pixel => {
    ctx.fillStyle = pixel.color;
    ctx.fillRect(pixel.x, pixel.y, 1, 1);
  });

  return canvas.toDataURL();
}

module.exports = generatePreviewImage;
