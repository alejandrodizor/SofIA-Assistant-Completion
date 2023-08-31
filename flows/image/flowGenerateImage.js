const generateImage = require("../../api/image/dall-e");

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function flowGenerateImage(
  message,
  userSettings,
  client,
  args = {},
  is_function = false
) {
  try {
    /**
     ** Send working message
     **/
    client.sendText(message.from, "🖼️ Generando imagen...");

    /**
     *? State: Typing
     */
    client.setChatState(message.from, 0);

    /**
     ** Generate image
     **/

    let prompt;

    if (is_function) {
      prompt = args.description;
    } else {
      const emojiLength = "🎨".length;
      prompt = message.body.substring(emojiLength).trimStart();
    }

    const response = await generateImage(prompt);

    client
      .sendImage(
        message.from,
        response,
        capitalizeFirstLetter(prompt),
        capitalizeFirstLetter(prompt)
      )
      .catch((error) => {
        console.error("Error when sending: ", error); //return object error
      });

    /**
     *? State: Clear
     */
    client.setChatState(message.from, 2);

    /**
     ** Return response
     **/

    if (is_function) {
      return "Imagen generada correctamente. 👍";
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = { flowGenerateImage };
