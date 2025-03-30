const { createCanvas } = require("canvas");

async function generatePreviewImage(size, pixels, scale = 20) {
  const canvas = createCanvas(size * scale, size * scale);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);

  pixels.forEach(pixel => {
    ctx.fillStyle = pixel.color;
    ctx.fillRect(pixel.x * scale, pixel.y * scale, scale, scale);
  });

  return canvas.toDataURL();
}

module.exports = generatePreviewImage;
