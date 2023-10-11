const { flowSendDashboard } = require("../flows/settings/flowSendDashboard");
const { functionClearChat } = require("../functions/clearChat");
const { functionGenerateImage } = require("../functions/generateImage");
const { functionRecordarNombre } = require("../functions/recordarNombre");

const ext = "@s.whatsapp.net";

async function worker(id, message, userSettings, function_name, args, sock) {
  console.log(
    "worker",
    "id:" + id,
    "message:" + message,
    "function:" + function_name,
    "args:" + args
  );
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

  /**
   ** Function: Enviar Dashboard
   */
  if (function_name === "enviar_dashboard") {
    return await flowSendDashboard(id, message, userSettings, sock, true);
  }
}

module.exports = { worker };
