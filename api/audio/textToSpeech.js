const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const axios = require('axios');
const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

async function textToSpeech(inputText, language='es-CO', genre='FEMALE', providers='microsoft') {
  const resp = await fetch(
    `https://api.edenai.run/v2/audio/text_to_speech`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.EDEN_API_KEY}`
      },
      body: JSON.stringify({
        providers: providers,
        language: language,
        text: inputText,
        option: genre,
        settings: {}
      })
    }
  );

  return await resp.json();

}

module.exports = { textToSpeech };

