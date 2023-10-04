const generateImage = require("../../api/image/stable-difussion");


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function flowGenerateImage(
  id,
  message,
  userSettings,
  sock,
  args = {},
  is_function = false
) {
  try {
    /**
     ** Send working message
     **/
     await sock.sendMessage(id, {
      text: "🖼️ Generando imagen....",
    });

   /**
     *? State: Composing
     */
    await sock.sendPresenceUpdate("composing", id);

    /**
     ** Generate image
     **/

    let prompt;

    if (is_function) {
      prompt = args.description;
    } else {
      const emojiLength = "🎨".length;
      prompt = message.substring(emojiLength).trimStart();
    }

    const buffer = await generateImage(prompt);

    try {

    await sock.sendMessage(id, {
      image: buffer,
      mimetype: "image/jpeg",
      caption: capitalizeFirstLetter(prompt)
    });

    } catch (error) {
      console.log(error);
    }

    //todo: capitalizeFirstLetter(prompt)

  
    /**
     ** Return response
     **/

    if (is_function) {
      return "Imagen generada correctamente. 👍";
    }
    return; 
  } catch (error) {
    console.log(error);
  }
}

module.exports = { flowGenerateImage };
