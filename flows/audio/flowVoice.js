const { deleteFile } = require("../../api/audio/converter");
const downloadAudio = require("../../api/audio/downloadMedia");
const { textToSpeech } = require("../../api/audio/textToSpeech");
const transcribeAudio = require("../../api/audio/whisper");
const { chatGPT } = require("../../api/text/gpt");

async function flowVoice(params, userSettings, sock) {
  try {
    /**
     ** Variables
     */
    const id = params.key.remoteJid;

    /**
     ** Downloading audio
     */
    const conversionResult = await downloadAudio(params);

    if (conversionResult.success) {
      /**
       ** Transcribe audio
       */
      transcribeAudio(conversionResult.fileMP3Path).then((response) => {
        if (response.success) {
          let whisperResponse = response.response.text;
          deleteFile(conversionResult.fileOggPath);
          deleteFile(conversionResult.fileMP3Path);
          /*
          const msg = {
            from: message.from,
            body: whisperResponse,
          };*/

          chatGPT(id, whisperResponse, userSettings, sock).then(
            async (response) => {
              if (!response.is_function) {
                if (userSettings.settings.voiceAnnouncements) {
                  /**
                   ** Text to Speech
                   */
                  const responeTextToSpeech = await textToSpeech(
                    response.message,
                    userSettings.settings.language
                  );

                  /**
                   ** Send audio
                   */
                  await sock.sendMessage(id, {
                    audio: {
                      url: responeTextToSpeech.microsoft.audio_resource_url,
                    },
                    ptt: true,
                    mimetype: "audio/mpeg",
                  });
                } else {
                  /**
                   ** Send text
                   */
                  await sock.sendMessage(id, {
                    text: response.message,
                  });
                }
              }
            }
          );
        } else {
        }
      });
    } else {
      console.log("Error converting audio");
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = { flowVoice };
