const { changeName } = require("../../controllers/db");

async function flowChangeName(id, message, userSettings, sock) {
  try {
    const emojiLength = "🌳".length;
    const prompt = message.substring(emojiLength).trimStart();
    let response = await changeName(id, userSettings, prompt);
    if (response == "OK") {
      response = `Perfecto, recordaré que tu nombre es ${prompt} de ahora en adelante.`;
    } else {
      response = "Hubo un error al recordar el nombre.";
    }

    await sock.sendMessage(id, {
      text: response,
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { flowChangeName };
