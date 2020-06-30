const fs = require("fs");
const PNG = require("pngjs").PNG;
const sharp = require('sharp');
let files = fs.readdirSync("./arts");
let counter = 0;
console.log(files);

(async () => {
  for (file of files) {
    let png = fs.readFileSync(`./arts/${file}`)
    let img = new PNG.sync.read(png);
    let maxY = 0;
    let minY = 999999999;
    let maxX = 0;
    let minX = 999999999;
    for (var y = 0; y < img.height; y++) {
      for (var x = 0; x < img.width; x++) {
        var idx = (img.width * y + x) << 2;

        if (
          (img.data[idx] != 255) &&
          (img.data[idx + 1] != 255) &&
          (img.data[idx + 2] != 255) &&
          img.data[idx + 3] > 120
        ) {
          if (x > maxX) {
            maxX = x;
          }
          if (x < minX) {
            minX = x;
          }
          if (y > maxY) {
            maxY = y;
          }
          if (y < minY) {
            minY = y;
          }
        }
      }
    }

    console.log(`maxY ${maxY}`);
    console.log(`minY ${minY}`);
    console.log(`maxX ${maxX}`);
    console.log(`minX ${minX}`);
    let width = maxX - minX;
    let height = maxY - minY;
    let imgCrop = sharp(`./arts/${file}`);
    let params = {
      left: minX,
      top: minY,
      width: width + 1, 
      height: height + 1,
    };
    let croppedImg = await imgCrop.extract(params).toFile(`./croparts/${file}`);
    counter++;
    console.log(`${counter}/${files.length}`);
  }
})();
