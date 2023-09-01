const { chatGPT } = require("../../api/text/gpt");
const { functionClearChat } = require("../../functions/clearChat");
const { flowGenerateImage } = require("../image/flowGenerateImage");

function flowChat(message, userSettings, client) {
  try {
    /**
     ** Function: Clear Chat
     */
    if (message.body === "🗑️") {
      return functionClearChat(message, userSettings, client);
    }

    /**
     ** Flow: Generate Image
     */
    if (message.body.startsWith("🎨")) {
      return flowGenerateImage(message, userSettings, client);
    }


    /**
     ** Flow: Generate Image
     */
    if (message.body.startsWith("🌳")) {
      return flowGenerateImage(message, userSettings, client);
    }

    /**
     ** Flow: GPT
     */
    chatGPT(message, userSettings, client).then((response) => {
      if (!response.is_function) {
        client.sendText(message.from, response.message).catch((error) => {
          console.error("Error when sending: ", error); //return object error
        });
      }

      /**
       *? State: Clear
       */
      client.setChatState(message.from, 2);
    });

    return;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { flowChat };
