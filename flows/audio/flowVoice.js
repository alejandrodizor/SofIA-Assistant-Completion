const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { downloadMediaMessage } = require("@adiwajshing/baileys");
const { convertAudio, deleteFile } = require("../../api/utils/converter");
const { chatGPT } = require("../../api/text/gpt");
const authentication = require("../../api/utils/authentication");
const transcribeAudio = require("../../api/audio/whisper");
const { textToSpeech } = require("../../api/audio/textToSpeech");
const { textToSpeechEleven } = require("../../api/audio/elevenLabs");
const { writeFile } = require("fs").promises;

/**
 ** Flow Voice
 * Todo: Add producton and auth whitelist
 * Todo: Validar que si viene de telegram tambien se tome como reenviado
 * Todo: cuando alguien reaccione con un emoji a un mensaje de voz se pueda escribir y al reves
 */

let whisperResponse = "";
let userSettings;

const flowVoice = addKeyword(EVENTS.VOICE_NOTE)
  .addAction(async (ctx, { endFlow, flowDynamic, provider }) => {
    try {
      /**
       ** Authentication
       */

      const auth = await authentication(ctx);
      userSettings = auth.userSettings;
      const isForwarded =
        ctx.message.audioMessage.hasOwnProperty("contextInfo");

      if (!auth.success) {
        return endFlow({
          body: auth.message,
        });
      }

      // Todo: Validar limite de duracion por segundos desde las settings del usuario
      /**
       ** Presence update("composing")
       */

      const jid = ctx.key.remoteJid;
      const refProvider = await provider.getInstance();
      await refProvider.presenceSubscribe(jid);
      await refProvider.sendPresenceUpdate("composing", jid);

      /**
       ** Declaring variables
       */

      const random = Math.floor(Math.random() * 1000000);
      const fileOggPath = `./temp/audio/${ctx.from}-${random}.ogg`;
      const fileMP3Path = `./temp/audio/${ctx.from}-${random}.mp3`;

      const buffer = await downloadMediaMessage(ctx, "buffer");
      await writeFile(fileOggPath, buffer);
      const conversionResult = await convertAudio(fileOggPath, fileMP3Path);

      if (isForwarded) {
        refProvider.sendMessage(jid, { text: "🔊 Procesando audio..." });
      }
      /**
       ** Whisper
       */

      if (conversionResult.success) {
        const responseWhisperData = await transcribeAudio(fileMP3Path);

        if (responseWhisperData.success) {
          whisperResponse = responseWhisperData.response.text;
        } else {
          return endFlow({
            body: "🤖 No pude transcribir el audio , intenta con otro",
          });
        }
      }

      /**
       ** Voice Message
       */
      if (!isForwarded) {
        /**
         ** Send status message
         */

        await refProvider.sendMessage(jid, { text: "🎧 Escuchando audio..." });

        /**
         ** Presence update("recording")
         */
        refProvider.sendPresenceUpdate("recording", jid);

        /**
         ** Chat GPT
         * TODO: Add chatGPT settings (temperature, top_p, frequencyPenalty, presencePenalty, maxTokens)
         */

        const chatGPTresponse = await chatGPT(
          whisperResponse,
          ctx.from,
          userSettings
        );

        /**
         ** textToSpeech
         */

        if (userSettings.settings.apiTextToSpeech === "edenai") {
          const responeTextToSpeech = await textToSpeech(
            chatGPTresponse,
            userSettings.settings.language
          );

          if (responeTextToSpeech.microsoft.status) {
            /**
             ** Send audio
             * TODO: Boton que venga con el audio y que diga "Escribir" y envie el texto
             */

            await refProvider.sendMessage(jid, {
              audio: { url: responeTextToSpeech.microsoft.audio_resource_url },
              mimetype: "audio/mpeg",
            });

            /**
             ** Presence update("available")
             */
            await refProvider.sendPresenceUpdate("available", jid);

            /**
             ** Delete local audio files
             */

            deleteFile(fileOggPath).catch((err) => {
              console.log("Error al eliminar el archivo", err);
            });

            deleteFile(fileMP3Path).catch((err) => {
              console.log("Error al eliminar el archivo", err);
            });

            /**
             *? Return response
             */

            return endFlow();
          }
        } else {
          /**
           ** ElevenLabs textToSpeech
           */

          const fileMP3ResponsePath = `./temp/audio/${ctx.from}-elevenlabs-${random}.mp3`;

          await textToSpeechEleven(
            chatGPTresponse,
            fileMP3ResponsePath,
            userSettings.settings.textToSpeechModel,
            userSettings.settings.speechStability,
            userSettings.settings.speechSimilarityBoost
          )
            .then(async () => {
              /**
               ** Send audio
               */

              await refProvider.sendMessage(jid, {
                audio: { url: fileMP3ResponsePath },
                mimetype: "audio/mpeg",
              });

              /**
               ** Delete local audio files
               */

              deleteFile(fileOggPath).catch((err) => {
                console.log("Error al eliminar el archivo", err);
              });

              deleteFile(fileMP3Path).catch((err) => {
                console.log("Error al eliminar el archivo", err);
              });

              deleteFile(fileMP3ResponsePath).catch((err) => {
                console.log("Error al eliminar el archivo", err);
              });

              /**
               ** Presence update("available")
               */

              await refProvider.sendPresenceUpdate("available", jid);

              /**
               ** Return response
               */

              return endFlow();
            })
            .catch((error) => {
              console.log(error);
              return endFlow({
                body: "😞 Tuve un problema para procesar el audio. Por favor intenta más tarde.",
              });
            });

          return endFlow();
        }

        /**
         ** Presence update("composing")
         */

        await refProvider.sendPresenceUpdate("composing", jid);
      }
    } catch (error) {
      /**
       *! Return error
       */
      console.log(error);
      return endFlow({
        body: "😞 Tuve un problema para procesar el audio. Por favor intenta más tarde.",
      });
    }
  })
  .addAnswer(
    ["¿Qué te gustaría hacer con este audio?"],
    {
      capture: true,
      buttons: [
        { body: "✂️ Resumirlo" },
        { body: "📝 Transcribirlo" },
        { body: "🎧 Escucharlo" },
        { body: "🙅 Nada" },
      ],
    },

    async (ctx, { flowDynamic, endFlow, fallBack, provider }) => {
      try {
        /**
         ** Presence update("composing")
         */

        const jid = ctx.key.remoteJid;
        const refProvider = await provider.getInstance();
        await refProvider.presenceSubscribe(jid);
        await refProvider.sendPresenceUpdate("composing", jid);

        if (ctx.body == "🙅 Nada") {
          return endFlow({
            body: "👌 Vale",
          });
        } else if (ctx.body == "✂️ Resumirlo") {
          flowDynamic({
            body: "✂️ Resumiendo...",
          });

          const resumePrompt = `Quiero que resumas el siguiente texto en los puntos más importantes:\n\n${whisperResponse}`;

          const chatGPTresponse = await chatGPT(
            resumePrompt,
            ctx.from,
            userSettings
          );

          await refProvider.sendPresenceUpdate("paused", jid);

          return endFlow({
            body: chatGPTresponse,
          });
        } else if (ctx.body == "📝 Transcribirlo") {
          return endFlow({
            body: whisperResponse,
          });
        } else if (ctx.body == "🎧 Escucharlo") {
          return endFlow({
            body: "🎧 Escuchando...",
          });
        }

        await refProvider.sendPresenceUpdate("available", jid);
        return fallBack();
      } catch (error) {
        /**
         *! Return error
         */
        console.log(error);
        return endFlow({
          body: "😞 Tuve un problema para procesar el audio. Por favor intenta más tarde.",
        });
      }
    }
  );

module.exports = flowVoice;
