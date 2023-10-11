const { chatGPT } = require("../../api/text/gpt");
const { functionClearChat } = require("../../functions/clearChat");
const { flowGenerateImage } = require("../image/flowGenerateImage");
const { flowChangeName } = require("../settings/flowChangeName");
const { flowSendDashboard } = require("../settings/flowSendDashboard");

async function flowChat(id, message, userSettings, sock) {
  /**
   ** Function: Clear Chat
   */
  if (message === "🗑️") {
    return functionClearChat(id, userSettings, sock);
  }

  /**
   ** Function: Send Dashboard Link
   */
  if (message === "⚙️") {
    return flowSendDashboard(id, message, userSettings, sock);
  }

  /**
   ** Flow: Generate Image
   */
  if (message.startsWith("🎨")) {
    return flowGenerateImage(id, message, userSettings, sock);
  }

  /**
   ** Flow: Change Name
   */
  if (message.startsWith("🌳")) {
    return flowChangeName(id, message, userSettings, sock);
  }

  /**
   ** Flow: Admin Commands
   */
  if (message.startsWith("@")) {
    if (userSettings.settings.admin === true) {
      return await flowAdmin(message, sock);
    } else {
      return await sock.sendMessage(id, {
        text: "🖐️ No tienes permisos de administrador.",
      });
    }
  }

  /**
   ** Flow: GPT
   */
  let gptResponse = await chatGPT(id, message, userSettings, sock);

  if (gptResponse.showMessage) {
    return await sock.sendMessage(id, { text: gptResponse.message });
  }
}

module.exports = { flowChat };
