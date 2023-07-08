const wppconnect = require("@wppconnect-team/wppconnect");
const { chatGPT } = require("./api/text/gpt");
wppconnect
  .create({
    session: "sofIA-v4",
    statusFind: (statusSession, session) => {
      // return: isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
      console.log("Status Session: ", statusSession);
      // create session wss return "serverClose" case server for close
      console.log("Session name: ", session);
    },
  })
  .then((client) => start(client))
  .catch((error) => console.log(error));

function start(client) {
  client.onMessage((message) => {

    console.log("numero del sender",message.from);
    if (message.body === "🗑️") {
      client
        .sendText(message.from, "Se ha limpiado el chat")
        .then((result) => {
          //return object success
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
        });
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
    });
    


  });
}
