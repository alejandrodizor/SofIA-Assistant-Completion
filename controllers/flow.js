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

    /**
     *? State: Typing
     */
    client.setChatState(message.from, 0);

    if (message.type === "chat") {
      /**
       ** FlowChat
       */
      return flowChat(message, auth.userSettings, client);
    } else {
      client
        .sendText(
          message.from,
          "Todavía no puedo responder ese tipo de mensajes 😓"
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
