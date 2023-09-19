const { functionClearChat } = require("../functions/clearChat");
const { functionGenerateImage } = require("../functions/generateImage");
const { functionRecordarNombre } = require("../functions/recordarNombre");

const ext = "@s.whatsapp.net";

async function worker(id, message, userSettings, function_name, args, sock) {
  console.log("worker", "id:"+id, "message:"+message, "function:"+function_name, "args:"+args);
  /**
   ** Function: Clear Chat
   */
  if (function_name === "eliminar_chat") {
    return await functionClearChat(id, userSettings, sock, true);
  }
  /**
   ** Function: Generate Image
   */
  if (function_name === "crear_imagen") {
    return await functionGenerateImage(
      id,
      message,
      userSettings,
      sock,
      args,
      true
    );
  }
  /**
   ** Function: Change Name
   */
  if (function_name === "recordar_nombre") {
    return await functionRecordarNombre(
      id,
      message,
      userSettings,
      sock,
      args,
      true
    );
  }
}

module.exports = { worker };
