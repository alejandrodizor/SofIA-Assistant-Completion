const { chatGPT } = require("../api/text/gpt");
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

    /*
    client.onAck((ack) => {
       console.log('ACK:  ',ack);
       if (ack === 3) {
         client.sendSeen(message.from);
       }
     });*/

    /**
     ** State: Typing
     */
    client.setChatState(message.from, 0);

    if (message.type === "chat") {
      if (message.body === "🗑️") {
        client.sendText(message.from, 'WPPConnect message with buttons', {
          useTemplateButtons: true, // False for legacy
          buttons: [
            {
              url: 'https://wppconnect.io/',
              text: 'WPPConnect Site'
            },
            {
              phoneNumber: '+55 11 22334455',
              text: 'Call me'
            },
            {
              id: 'your custom id 1',
              text: 'Some text'
            },
            {
              id: 'another id 2',
              text: 'Another text'
            }
          ] // Optional
       });
        /*client
          .sendText(message.from, "Se ha limpiado el chat")
          .then((result) => {
            //return object success
          })
          .catch((erro) => {
            console.error("Error when sending: ", erro); //return object error
          });*/
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

      chatGPT(message.body, message.from, auth.userSettings, client).then((response) => {
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
