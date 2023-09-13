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
      return functionClearChat(message, userSettings, sock);
    }

    /**
     ** Flow: Generate Image
     */
    if (message.startsWith("🎨")) {
      return flowGenerateImage(message, userSettings, sock);
    }

    /**
     ** Flow: Generate Image
     */
    if (message.startsWith("🌳")) {
      return flowChangeName(message, userSettings, sock);
    }

    /**
     ** Flow: GPT
     */

    let gptResponse = await chatGPT(id, message, userSettings, sock);

    console.log("response:", gptResponse);

    return await sock.sendMessage(id, { text: gptResponse.message });

  } catch (error) {
    console.log(error);
  }
}

function flowChat2(message, userSettings, sock) {
  try {
    /**
     ** Function: Clear Chat
     */
    if (message === "🗑️") {
      return functionClearChat(message, userSettings, sock);
    }

    /**
     ** Flow: Generate Image
     */
    if (message.startsWith("🎨")) {
      return flowGenerateImage(message, userSettings, sock);
    }

    /**
     ** Flow: Generate Image
     */
    if (message.startsWith("🌳")) {
      return flowChangeName(message, userSettings, sock);
    }

    /**
     ** Flow: GPT
     */
    chatGPT(message, userSettings, sock).then((response) => {
      if (!response.is_function) {
        sock.sendText(message.from, response.message).catch((error) => {
          console.error("Error when sending: ", error); //return object error
        });
      }

      /**
       *? State: Clear
       */
      sock.setChatState(message.from, 2);
    });

    return;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { flowChat };
