import fs from "fs";
import path from "path";
import sharp from "sharp";

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
  "AirLifter.png",
  "ALERT.png",
  "Arboria.png",
  "AshBlossom.png",
  "Avramax.png",
  "Chimera.png",
  "CONTAIN.png",
  "CrusadiaKrawler.png",
  "CrusadiaPower.png",
  "CrusadiaRevival.png",
  "CrusadiaTestament.png",
  "CrusadiaVanguard.png",
  "DimensionShifter.png",
  "EarthSlicer.png",
  "EMERGENCY.png",
  "Equimax.png",
  "EXTINGUISH.png",
  "FireAttacker.png",
  "FireEngine.png",
  "GhostBelle.png",
  "Guardragon.png",
  "Hiita.png",
  "Hydrant.png",
  "Impulse.png",
  "Leonis.png",
  "Mardark.png",
  "Maximus.png",
  "Megaclops.png",
  "Monitor.png",
  "MountainSmasher.png",
  "NineLives.png",
  "Preventer.png",
  "RAHQ.png",
  "Reclusia.png",
  "Regulex.png",
  "RESCUE.png",
  "Turbulence.png",
  "WLHeart.png",
  "WLMonstrosity.png",
  "WorldLance.png",
  "WorldReassembly.png",
  "xyzDragon.png",
  "REINFORCE.png",
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
