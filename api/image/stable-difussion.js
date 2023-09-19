require("dotenv").config();


async function generateImage(prompt) {
  const CLIPDROP_API = process.env.CLIPDROP_API;
  try {
    const form = new FormData();
    form.append("prompt", prompt);

    const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: {
        "x-api-key": CLIPDROP_API,
      },
      body: form,
    });

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);

  } catch (error) {
    console.error(`Error al generar la imagen: ${error.message}`);
    return false;
  }
}

module.exports = generateImage;
