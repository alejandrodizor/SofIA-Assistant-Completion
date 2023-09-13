//const { flowAudio } = require("../flows/audio/flowAudio");
//const { flowVoice } = require("../flows/audio/flowVoice");
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
     ** FlowChat
     */
    flowChat(id, message, auth.userSettings, sock);
  }

  return sock.sendPresenceUpdate("composing", id);

}

function flow2(client) {
  client.onMessage(async (message) => {
    /**
     ** Authentication
     */

    let auth = await authentication(message);

    if (auth.success === false) {
      client.sendText(message.from, auth.message);
      return;
    }

    if (message.type === "chat") {
      /**
       *? State: Typing
       */
      client.setChatState(message.from, 0);
      /**
       ** FlowChat
       */
      //return flowChat(message, auth.userSettings, client);
    } else if (message.type === "ptt") {
      /**
       *? State: Recording
       */
      client.setChatState(message.from, 1);
      /**
       ** FlowVoice
       */
      //return flowVoice(message, auth.userSettings, client);
    } else if (message.type === "audio") {
      /**
       *? State: Typing
       */
      client.setChatState(message.from, 0);
      /**
       ** FlowAudio
       */
      // return flowAudio(message, auth.userSettings, client);
    } else {
      client
        .sendText(
          message.from,
          "Lo siento, todavía no puedo responder ese tipo de mensajes 😓"
        )
        .catch((error) => {
          console.error("Error when sending: ", error);
        });

      /**
       *? State: Clear
       */
      client.setChatState(message.from, 2);
    }
  });
}

module.exports = { flow };
