const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const transcribeAudio = async (filePath) => {
  if (filePath) {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const model = "whisper-1";

    const formData = new FormData();
    formData.append("model", model);
    formData.append("file", fs.createReadStream(filePath));

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "content-type": `multipart/form-data; boundary=${formData._boundary}`,
          },
        }
      );
      return { success: true, response: response.data };
    } catch (error) {
      console.log(error);
      return { success: false, response: error };
    }
  } else {
    return { success: false, response: "No exist file" };
  }
};

module.exports = transcribeAudio;
