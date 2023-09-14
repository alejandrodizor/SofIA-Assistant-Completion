const { convertAudio } = require("./converter");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { writeFile } = require("fs/promises");

async function downloadAudio(params) {
  try {
    /**
     ** Variables
     */
    const id = params.key.remoteJid;
    const random = Math.floor(Math.random() * 1000000);
    const fileOggPath = `./temp/audio/${id}-${random}.ogg`;
    const fileMP3Path = `./temp/audio/${id}-${random}.mp3`;

    /**
     ** Downloading audio
     */
    const buffer = await downloadMediaMessage(params, "buffer", {});

    /**
     ** Saving audio
     */
    await writeFile(fileOggPath, buffer);

    /**
     ** Converting audio
     */
    const result = await convertAudio(fileOggPath, fileMP3Path);

    return {
      success: result.success,
      fileOggPath,
      fileMP3Path,
    };
  } catch (error) {
    console.error(`Download Audio Error: ${error.message}`);
    return false;
  }
}


module.exports = downloadAudio;
