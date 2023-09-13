const {
    default: makeWASocket,
    useMultiFileAuthState,
  } = require("@whiskeysockets/baileys");
  const { chatGPT } = require("./api/text/gpt");
  const { textToSpeech } = require("./api/audio/textToSpeech");
  const { getMessageType } = require("./controllers/utils");
  
  
  (async () => {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
    const sock = makeWASocket({ auth: state, printQRInTerminal: true });
  
    sock.ev.on("creds.update", saveCreds);
  
    sock.ev.on("messages.upsert", async (response) => {
      try {
        console.log(JSON.stringify(response, undefined, 2));
  
        let params = response.messages[0];
        let id = params.key.remoteJid;
        let message = params.message.conversation;
  
        if (!params.key.fromMe) {
          await sock.sendPresenceUpdate("available", id);
  
          const messageType = getMessageType(params);
  
          if (messageType === "text") {
            if (message === "Reaction") {
              const reactionMessage = {
                react: {
                  text: "💖",
                  key: params.key,
                },
              };
  
              return await sock.sendMessage(id, reactionMessage);
            }
  
            if (message === "Read") {
              return sock.readMessages([params.key]);
            }
  
            await sock.sendPresenceUpdate("composing", id);
  
            let responseGPT = await chatGPT(message);
  
            console.log("response:", responseGPT);
  
            await sock.sendMessage(id, { text: responseGPT });
          } else if (messageType === "audio") {
            await sock.sendPresenceUpdate("recording", id);
  
            let audioResponse = await textToSpeech(
              "Esto es un audio de prueba para ver si todo va bien"
            );
  
            await sock.sendMessage(id, {
              audio: { url: audioResponse.microsoft.audio_resource_url },
              ptt: true,
              mimetype: "audio/mpeg",
            });
          } else if (messageType === "reaction") {
  
            const msg = await getMessageFromStore("573186312380@s.whatsapp.net", "3A20168294F80FBB2B60");
            console.log(msg);
            await sock.sendMessage(id, {
              text: "Esto es un audio de prueba para ver si todo va bien",
            });
          } else {
            await sock.sendMessage(id, {
              text: "Todavía no puedo responder ese tipo de mensajes",
            });
          }
  
          await sock.sendPresenceUpdate("available", id);
          return sock.readMessages([params.key]);
        }
      } catch (error) {
        console.log(error);
      }
    });
  })();
  