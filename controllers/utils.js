function getMessageType(messageObject) {
  if (messageObject.message.conversation) {
    return "chat";
  } else if (messageObject.message.extendedTextMessage) {
    return "desktop";
  } else if (messageObject.message.audioMessage) {
    if (
      messageObject.message.audioMessage.contextInfo &&
      messageObject.message.audioMessage.contextInfo.isForwarded
    ) {
      return "audio";
    }
    return "voice";
  } else if (messageObject.message.reactionMessage) {
    return "reaction";
  } else if (messageObject.message.stickerMessage) {
    return "sticker";
  } else if (messageObject.message.imageMessage) {
    return "image";
  } else {
    return "unknown";
  }
}

module.exports = { getMessageType };
