const { functionClearChat } = require("../functions/clearChat");

const ext = "@c.us";

async function worker(message, userSettings, function_name, args, client) {
  console.log("worker", function_name, args);
   /**
   ** Function: Clear Chat
   */
  if (function_name === "eliminar_chat") {
    return await functionClearChat(message, userSettings, client, true);
  }
}

module.exports = { worker };
