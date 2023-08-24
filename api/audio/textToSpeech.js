const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const axios = require('axios');

async function textToSpeech(inputText, language='es-CO', genre='FEMALE', providers='microsoft') {
  const resp = await fetch(
    `https://api.edenai.run/v2/audio/text_to_speech`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODZhYjcyZjQtNzM5OC00NDQ1LWIyOWUtNmJhY2VmMjBlYTA4IiwidHlwZSI6ImFwaV90b2tlbiJ9.litYXbvE8LvvCOhfby4meOB3WP1PQ_edicQEZ5LNKrc'
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

