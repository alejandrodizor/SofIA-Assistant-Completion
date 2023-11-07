require("dotenv").config();
const axios = require("axios");

async function generateImage(prompt) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.data[0].url;
  } catch (error) {
    console.error(`Error al generar la imagen: ${error.message}`);
    return false;
  }
}

module.exports = generateImage;
