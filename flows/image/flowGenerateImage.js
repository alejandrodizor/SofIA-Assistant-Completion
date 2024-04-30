const generateImage = require("../../api/image/dall-e");


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

     return "Las imagenes están desactivadas por el momento.";
     await sock.sendMessage(id, {
      text: "👩🏼‍🎨 Creando imagen...",
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

    //TODO: quitar esto para activar nuevamente la creacion de imagenes
    //const image = await generateImage(prompt);

    try {

    await sock.sendMessage(id, {
      image: image,
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
