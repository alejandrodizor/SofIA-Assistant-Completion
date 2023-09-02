const { changeName } = require("../../controllers/db");

async function flowChangeName(message, userSettings, client) {
  try {
    const emojiLength = "🌳".length;
    const prompt = message.body.substring(emojiLength).trimStart();
    let response = await changeName(message.from, userSettings, prompt);
    if (response == "OK") {
        response = `Perfecto, recordaré que tu nombre es ${prompt} de ahora en adelante.`;
    } else {
      response = "Hubo un error al recordar el nombre.";
    }
    client.sendText(message.from, response).catch((erro) => {
      console.error("Error when sending: ", erro); //return object error
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { flowChangeName };
