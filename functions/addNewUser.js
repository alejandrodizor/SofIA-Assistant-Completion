const {addUserToWhiteList} = require("../controllers/db");

async function addNewUser(message) {
  try {
    const number = message.split(" ")[1];
    const name = message.split(" ")[2];

    if(!number || !name) return "❌ Debes ingresar el número y el nombre del usuario";

    const response = await addUserToWhiteList(number, name);

    if (response) {
      return `✅ Usuario ${name} agregado correctamente con el número ${number}`;
    } else {
      return `❌ No se pudo agregar el usuario ${name} con el número ${number}`;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = { addNewUser };
