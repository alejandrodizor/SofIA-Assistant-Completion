const { flowAudio } = require("../flows/audio/flowAudio");
const { flowVoice } = require("../flows/audio/flowVoice");
const { flowChat } = require("../flows/text/flowChat");
const authentication = require("./auth");

function flow(client) {
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
      return flowChat(message, auth.userSettings, client);
    } else if (message.type === "ptt") {
      /**
       *? State: Recording
       */
      client.setChatState(message.from, 1);
      /**
       ** FlowVoice
       */
      return flowVoice(message, auth.userSettings, client);
    } else if (message.type === "audio") {
      /**
       *? State: Typing
       */
      client.setChatState(message.from, 0);
      /**
       ** FlowAudio
       */
      return flowAudio(message, auth.userSettings, client);
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
