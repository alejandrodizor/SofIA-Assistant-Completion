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
      return {success:false, response: "Hubo un error al generar la imagen.", showMessage: false, saveMessage: true};
    }

    return {success:true, response, showMessage: false, saveMessage: true};
  } catch (error) {
    console.log(error);
    return {success:false, response: "Hubo un error al generar la imagen.", showMessage: false, saveMessage: true};
}
}

module.exports = { functionGenerateImage };
