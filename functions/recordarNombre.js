const { changeName } = require("../controllers/db");

async function functionRecordarNombre(
  id,
  message,
  userSettings,
  sock,
  args,
  is_function = false
) {
  try {
    const response = await changeName(id, userSettings, args.name);

    if (response === "Error") {
      return {
        success: false,
        response: "Hubo un error al recordar el nombre.",
        showMessage: true,
        saveMessage: true,
      };
    }

    return {
      success: true,
      response: "Perfecto, recordaré tu nombre de ahora en adelante.",
      showMessage: true,
      saveMessage: true,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      response: "Hubo un error al recordar el nombre.",
      showMessage: true,
      saveMessage: true,
    };
  }
}

module.exports = { functionRecordarNombre };
