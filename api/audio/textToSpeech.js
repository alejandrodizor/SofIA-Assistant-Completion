const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function textToSpeechOpenAI(inputText, model="tts-1",voice = "nova", language = "mx") {
  const mp3 = await openai.audio.speech.create({
    model: model,
    voice: voice,
    input: inputText,
    languaje: language,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  //await fs.promises.writeFile(speechFile, buffer);

  return buffer;
}

//const speechFile = path.resolve("./speech.mp3")

module.exports = { textToSpeechOpenAI };
