const { chatGPT } = require("../../api/text/gpt-v");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

async function flowVision(params, userSettings, sock) {
  /**
   ** Variables
   */
  const id = params.key.remoteJid;
  const message = params.message.imageMessage.caption;

  /**
   ** Flow: Vision
   */

  const image = await downloadMediaMessage(params, "buffer", {});
  const buffer = Buffer.from(image, 'utf-8');
  const base64str = buffer.toString('base64');

  let gptResponse = await chatGPT(id, message, userSettings, sock, base64str);


  if (gptResponse.showMessage) {
    return await sock.sendMessage(id, { text: gptResponse.message });
  }
}

module.exports = { flowVision };
