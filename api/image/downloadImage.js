const { downloadMediaMessage } = require("@whiskeysockets/baileys");

function downloadImage(params) {
  return downloadMediaMessage(params, "buffer", {});
}

module.exports = downloadImage;