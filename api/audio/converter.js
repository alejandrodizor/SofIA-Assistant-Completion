const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

async function convertAudio(inputPath, outputPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);

  return new Promise((resolve, reject) => {
    const outStream = fs.createWriteStream(outputPath);

    outStream.on("finish", () => {
      resolve({ success: true });
    });

    ffmpeg()
      .input(inputPath)
      .audioQuality(96)
      .toFormat("mp3")
      .on("error", (error) => {
        console.log(`Encoding Error: ${error.message}`);
        reject({ success: false, error: error.message });
      })
      .pipe(outStream, { end: true });
  }).catch((error) => {
    console.log(`Error: ${error.message}`);
    return { success: false, error: error.message };
  });
}

function deleteFile(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (error) => {
      if (error) {
        console.log(`Error: ${error.message}`);
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
}

module.exports = { convertAudio, deleteFile };
