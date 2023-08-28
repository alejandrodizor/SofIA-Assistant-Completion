const { chatGPT } = require("../../api/text/gpt");
const { functionClearChat } = require("../../functions/clearChat");


function flowChat(message, userSettings, client) {

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
    if (response.is_function) {
      client
        .sendText(
          message.from,
          `🚀 Ejecutando función: ${response.function_name} con los 
              argumentos ${JSON.stringify(response.arguments)}`
        )
        .catch((error) => {
          console.error("Error when sending: ", error); //return object error
        });
    } else {
      client.sendText(message.from, response.message).catch((error) => {
        console.error("Error when sending: ", error); //return object error
      });
    }
    /**
     *? State: Clear
     */
    client.setChatState(message.from, 2);
  });

  return;
}

module.exports = { flowChat };
