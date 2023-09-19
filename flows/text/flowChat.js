const { chatGPT } = require("../../api/text/gpt");
const { functionClearChat } = require("../../functions/clearChat");
const { flowGenerateImage } = require("../image/flowGenerateImage");
const { flowChangeName } = require("../settings/flowChangeName");

async function flowChat(id, message, userSettings, sock) {
  try {
    /**
     ** Function: Clear Chat
     */
    if (message === "🗑️") {
      return functionClearChat(id, userSettings, sock);
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
     ** Flow: GPT
     */
    let gptResponse = await chatGPT(id, message, userSettings, sock);

    if(gptResponse.showMessage) {
      return await sock.sendMessage(id, { text: gptResponse.message });
    }

    return;

    
  } catch (error) {
    console.log(error);
  }
}

module.exports = { flowChat };
