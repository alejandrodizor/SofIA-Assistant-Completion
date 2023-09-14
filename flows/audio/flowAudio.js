const { deleteFile } = require("../../api/audio/converter");
const downloadAudio = require("../../api/audio/downloadMedia");
const transcribeAudio = require("../../api/audio/whisper");

async function flowAudio(params, sock) {
  try {
    /**
     ** Variables
     */
    const id = params.key.remoteJid;
    const message = params.message.conversation;

  

    /**
     ** Downloading audio
     */
    const conversionResult = await downloadAudio(params);

    if (conversionResult.success) {
      /**
       ** Transcribe audio
       **/
      transcribeAudio(conversionResult.fileMP3Path).then(async (response) => {
        if (response.success) {
          whisperResponse = response.response.text;
          deleteFile(conversionResult.fileOggPath);
          deleteFile(conversionResult.fileMP3Path);

          await sock.sendMessage(id, {
            text: whisperResponse,
          });
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
