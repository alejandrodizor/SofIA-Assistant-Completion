const axios = require("axios");
const fs = require("fs");

async function textToSpeechEleven(
  inputText,
  urlFile,
  voiceId = "EXAVITQu4vr4xnSDxMaL",
  stability = 0.75,
  similarity_boost = 0.75,
  model_id = "eleven_multilingual_v1"
) {
  try {
    const response = await axios({
      method: "post",
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, // modificamos el URL
      headers: {
        accept: "audio/mpeg",
        "xi-api-key": "15c0067e13fe5710211f190f6aff725c",
        "Content-Type": "application/json",
      },
      data: {
        text: inputText,
        model_id: model_id,
        voice_settings: {
          stability: stability,
          similarity_boost: similarity_boost,
        },
      },
      responseType: "stream",
    });

    const writer = fs.createWriteStream(urlFile);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

module.exports = { textToSpeechEleven };
