const { flowGenerateImage } = require("../flows/image/flowGenerateImage");

async function functionGenerateImage(
  id,
  message,
  userSettings,
  sock,
  args,
  is_function = false
) {
  try {
    let response = await flowGenerateImage(
      id,
      message,
      userSettings,
      sock,
      args,
      true
    );

    if (response === "Error") {
      return {
        success: false,
        response: "Hubo un error al generar la imagen.",
        showMessage: false,
        saveMessage: true,
      };
    }

    return { success: true, response, showMessage: false, saveMessage: true };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      response: "Hubo un error al generar la imagen.",
      showMessage: false,
      saveMessage: true,
    };
  }
}

module.exports = { functionGenerateImage };
