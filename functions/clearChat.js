const { clearChat } = require("../controllers/db");

async function functionClearChat(
  message,
  userSettings,
  client,
  is_function = false
) {
  let response = "¡Chat eliminado! 👍";
  await clearChat(message.from, userSettings)
    .then(() => {
      if (!is_function) {
        client.sendText(message.from, response).catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
        });
      }
    })
    .catch((error) => {
      console.log(error);
      response = "Hubo un error al limpiar el chat.";
    });

  return response;
}

module.exports = { functionClearChat };
