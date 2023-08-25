const { chatGPT } = require("../../api/text/gpt");

function flowChat(message, userSettings, client) {
  if (message.body === "🗑️") {

    
    client
      .sendText(message.from, "Se ha limpiado el chat")
      .then((result) => {
        //return object success
      })
      .catch((erro) => {
        console.error("Error when sending: ", erro); //return object error
      });

    /**
     *? State: Clear
     */
    client.setChatState(message.from, 2);
    return;
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

  chatGPT(message.body, message.from, userSettings, client).then((response) => {
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
