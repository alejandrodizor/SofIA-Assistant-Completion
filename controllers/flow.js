const { flowAudio } = require("../flows/audio/flowAudio");
const { flowVoice } = require("../flows/audio/flowVoice");
const { flowChat } = require("../flows/text/flowChat");
const authentication = require("./auth");
const { getMessageType } = require("./utils");

async function flow(sock, response) {
  /**
   ** Variables
   */
  const params = response.messages[0];
  const id = params.key.remoteJid;
  const message = params.message.conversation;

  /**
   ** Authentication
   */

  const auth = await authentication(id);

  if (auth.success === false) {
    return await sock.sendMessage(id, {
      text: auth.message,
    });
  }

  /**
   ** Message Type
   */
  const messageType = getMessageType(params);

  /**
   ** Message Type: Chat
   */
  if (messageType === "chat") {
    /**
     *? State: Composing
     */
    sock.sendPresenceUpdate("composing", id);

    /**
     ** Flow Chat
     */
    await flowChat(id, message, auth.userSettings, sock);
  } else if (messageType === "desktop") {
    /**
     *? State: Composing
     */
    sock.sendPresenceUpdate("composing", id);

    /**
     ** Flow Chat Desktop
     */
    await flowChat(
      id,
      params.message.extendedTextMessage.text,
      auth.userSettings,
      sock
    );
  } else if (messageType === "audio") {
    /**
     ** Send listening message
     */
    await sock.sendMessage(id, {
      text: "🔊 Transcribiendo audio...",
    });

    /**
     *? State: Composing
     */
    await sock.sendPresenceUpdate("composing", id);

    /**
     ** Flow: Audio
     */
    await flowAudio(params, sock);
  } else if (messageType === "voice") {
    /**
     *? State: Recorging
     */
    await sock.sendPresenceUpdate("recording", id);
    /**
     ** Flow: Voice
     */
    await flowVoice(params, auth.userSettings, sock);
  } else if (messageType === "sticker") {
    /**
     ** Flow Sticker
     */
    await sock.sendMessage(id, {
      react: {
        text: "💖",
        key: params.key,
      },
    });
  } else {
    /**
     ** Flow: Unknown
     */
    await sock.sendMessage(id, {
      text: "Lo siento, todavía no puedo responder ese tipo de mensajes 😓",
    });
  }

  return await sock.sendPresenceUpdate("available", id);
}

module.exports = { flow };
