function getMessageType(messageObject) {
    if (messageObject.message.conversation) {
      return "chat";
    } else if (messageObject.message.audioMessage) {
      return "audio";
    } else if (messageObject.message.reactionMessage) {
      return "reaction";
    } else {
      return "unknown";
    }
  } 


  module.exports = { getMessageType };