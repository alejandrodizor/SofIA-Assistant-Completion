const { flowGenerateImage } = require("../flows/image/flowGenerateImage");

async function functionGenerateImage(
  message,
  userSettings,
  client,
  args,
  is_function = false
) {
  try {
    let response = await flowGenerateImage(
      message,
      userSettings,
      client,
      args,
      true
    );

    if (response === "Error") {
      return {success:false, response: "Hubo un error al generar la imagen.", showMessage: false};
    }

    return {success:true, response, showMessage: false};
  } catch (error) {
    console.log(error);
    return "Hubo un error al generar la imagen.";
  }
}

module.exports = { functionGenerateImage };
