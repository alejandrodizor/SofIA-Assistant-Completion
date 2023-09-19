const { clearChat } = require("../controllers/db");

async function functionClearChat(id, userSettings, sock, is_function = false) {
  try {
    let response = "¡Chat eliminado! 👍";
    let success = true;
    
    await clearChat(id, userSettings)
      .then(async () => {
        if (!is_function) {
          await sock.sendMessage(id, {
            text: response,
          });          
        }
      })
      .catch((error) => {
        console.log(error);
        response = "Hubo un error al limpiar el chat.";
        success = false;
      });

    return { success, response, showMessage: true, saveMessage: true };
  } catch (error) {
    console.log(error);
  }
}

module.exports = { functionClearChat };
