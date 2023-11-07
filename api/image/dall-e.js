const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateImage(prompt, style="natural") {
    const image = await openai.images.generate({ model: "dall-e-3", prompt: prompt, response_format: "b64_json"});
    return Buffer.from(image.data[0].b64_json, "base64");
}

module.exports = generateImage;
