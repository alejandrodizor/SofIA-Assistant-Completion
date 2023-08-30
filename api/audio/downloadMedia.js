const fs = require("fs");
const { convertAudio } = require("./converter");

async function downloadAudio(message, client) {
  try {
    const random = Math.floor(Math.random() * 1000000);
    const fileOggPath = `./temp/audio/${message.from}-${random}.ogg`;
    const fileMP3Path = `./temp/audio/${message.from}-${random}.mp3`;

    const base64String = await client.downloadMedia(message.id);

    const base64Data = base64String.split(",")[1];

    const buffer = Buffer.from(base64Data, "base64");

    fs.writeFileSync(fileOggPath, buffer);

    const result = await convertAudio(fileOggPath, fileMP3Path);
    
    return {
      success: result.success,
      fileOggPath,
      fileMP3Path,
    };
    
  } catch (error) {
    console.error(`Error al descargar el archivo MP3: ${error.message}`);
    return false;
  }
}

module.exports = downloadAudio;
