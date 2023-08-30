const { chatGPT } = require("../../api/text/gpt");
const { functionClearChat } = require("../../functions/clearChat");

function flowChat(message, userSettings, client) {
  try {
  /**
   ** Function: Clear Chat
   */
  if (message.body === "🗑️") {
    return functionClearChat(message, userSettings, client);
  }

  if (message.body === "creador") {
    client
      .sendContactVcard(message.from, "573186312380@c.us", "Alejandro Diaz")
      .catch((error) => {
        console.error("Error when sending: ", error); //return object error
      });
    client.setChatState(message.from, 2);
    return;
  }

  chatGPT(message, userSettings, client).then((response) => {
    client.sendText(message.from, response.message).catch((error) => {
      console.error("Error when sending: ", error); //return object error
    });

    /**
     *? State: Clear
     */
    client.setChatState(message.from, 2);
  });

  return;

  } catch (error) {
    console.log(error);
  }
}

module.exports = { flowChat };
