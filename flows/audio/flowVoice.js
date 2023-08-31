const { deleteFile } = require("../../api/audio/converter");
const downloadAudio = require("../../api/audio/downloadMedia");
const { textToSpeech } = require("../../api/audio/textToSpeech");
const transcribeAudio = require("../../api/audio/whisper");
const { chatGPT } = require("../../api/text/gpt");

async function flowVoice(message, userSettings, client) {
  try {
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

          const msg = {
            from: message.from,
            body: whisperResponse,
          };

          chatGPT(msg, userSettings, client).then(async (response) => {
            if (!response.is_function) {
              if (userSettings.settings.voiceAnnouncements) {
                const responeTextToSpeech = await textToSpeech(
                  response.message,
                  userSettings.settings.language
                );

                client.sendPttFromBase64(
                  message.from,
                  responeTextToSpeech.microsoft.audio,
                  "Mensaje de SofIA"
                );
              } else {
                client
                  .sendText(message.from, response.message)
                  .catch((error) => {
                    console.error("Error when sending: ", error); //return object error
                  });
              }
            }

            /**
             *? State: Clear
             */
            client.setChatState(message.from, 2);
          });
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
