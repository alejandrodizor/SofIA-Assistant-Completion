const { functionClearChat } = require("../functions/clearChat");
const { functionGenerateImage } = require("../functions/generateImage");
const { functionRecordarNombre } = require("../functions/recordarNombre");

const ext = "@c.us";

async function worker(message, userSettings, function_name, args, client) {
  console.log("worker", function_name, args);
   /**
   ** Function: Clear Chat
   */
  if (function_name === "eliminar_chat") {
    return await functionClearChat(message, userSettings, client, true);
  }
   /**
   ** Function: Generate Image
   */
  if (function_name === "crear_imagen") {
    return await functionGenerateImage(message, userSettings, client, args, true);
  }
   /**
   ** Function: Change Name
   */
  if (function_name === "recordar_nombre") {
    return await functionRecordarNombre(message, userSettings, client, args, true);
  }
}

module.exports = { worker };
