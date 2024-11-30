import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputFolder = "./public/images";

const images = [
  "pic1.png",
  "pic2.png",
  "pic3.png",
  "pic4.png",
  "pic5.png",
  "pic6.png",
  "pic7.png",
  "pic8.png",
  "pic9.png",
  "pic10.png",
];

images.forEach((image) => {
  const inputPath = path.join(inputFolder, image);

  sharp(inputPath)
    .resize(300, 438)
    .toBuffer()
    .then((data) => {
      fs.writeFile(inputPath, data, (err) => {
        if (err) {
          console.error(`Error overwriting ${image}:`, err);
        } else {
          console.log(`Successfully overwritten ${image}`);
        }
      });
    })
    .catch((err) => {
      console.error(`Error resizing ${image}:`, err);
    });
});
