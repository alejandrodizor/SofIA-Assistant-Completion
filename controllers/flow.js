const { chatGPT } = require("../api/text/gpt");

function flow(client) {
  client.onMessage((message) => {
    client.setChatState(message.from, 0);

    console.log("mensaje del sender", message);

    if (message.type === "chat") {
      if (message.body === "🗑️") {
        client
          .sendText(message.from, "Se ha limpiado el chat")
          .then((result) => {
            //return object success
          })
          .catch((erro) => {
            console.error("Error when sending: ", erro); //return object error
          });
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

      chatGPT(message.body, client).then((response) => {
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

        client.setChatState(message.from, 2);
      });
    } else {
      client
        .sendText(
          message.from,
          "Todavía no puedo responder ese tipo de mensajes 😓"
        )
        .catch((error) => {
          console.error("Error when sending: ", error);
        });
      client.setChatState(message.from, 2);
    }
  });
}

module.exports = { flow };
