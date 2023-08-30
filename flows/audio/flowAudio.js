const { deleteFile } = require("../../api/audio/converter");
const downloadAudio = require("../../api/audio/downloadMedia");
const transcribeAudio = require("../../api/audio/whisper");

async function flowAudio(message, userSettings, client) {
  try {
    /**
     ** Send listening message
     */

    client
      .sendText(message.from, "🔊 Transcribiendo audio...")
      .catch((erro) => {
        console.error("Error when sending: ", erro); //return object error
      });

    /**
     ** Downloading audio
     */

    const conversionResult = await downloadAudio(message, client);

    if (conversionResult.success) {
      transcribeAudio(conversionResult.fileMP3Path).then((response) => {
        if (response.success) {
          whisperResponse = response.response.text;
          deleteFile(conversionResult.fileOggPath);
          deleteFile(conversionResult.fileMP3Path);

          client.sendText(message.from, whisperResponse).catch((error) => {
            console.error("Error when sending: ", error); //return object error
          });

          /**
           *? State: Clear
           */
          client.setChatState(message.from, 2);
        } else {
          console.log("Error converting audio");
        }
      });
    } else {
      console.log("Error converting audio");
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = { flowAudio };
