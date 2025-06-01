const fs = require("fs");
const https = require("https");
const path = require("path");

const soundsDir = path.join(__dirname, "../public/sounds");
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

const sounds = [
  {
    name: "click.mp3",
    url: "https://cdn.freesound.org/previews/242/242501_4414128-lq.mp3",
  },
  {
    name: "success.mp3",
    url: "https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3",
  },
  {
    name: "error.mp3",
    url: "https://cdn.freesound.org/previews/142/142608_1840739-lq.mp3",
  },
  {
    name: "complete.mp3",
    url: "https://cdn.freesound.org/previews/243/243020_4284968-lq.mp3",
  },
];

sounds.forEach((sound) => {
  const filePath = path.join(soundsDir, sound.name);
  const file = fs.createWriteStream(filePath);

  https
    .get(sound.url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`Downloaded: ${sound.name}`);
      });
    })
    .on("error", (err) => {
      fs.unlink(filePath);
      console.error(`Error downloading ${sound.name}: ${err.message}`);
    });
});
