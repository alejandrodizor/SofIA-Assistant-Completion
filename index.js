const {
  default: makeWASocket,
  useMultiFileAuthState,
} = require("@whiskeysockets/baileys");
const { flow } = require("./controllers/flow");
/**
 ** Debug: true | false
 */
const debug = false;
const sentErrorMessage = true;
const numberErrorMessage = "573186312380@s.whatsapp.net";

(async () => {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const sock = makeWASocket({ auth: state, printQRInTerminal: true });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async (response) => {
    try {
      /**
       ** Debug
       */
      if (debug) {
        console.log(JSON.stringify(response, undefined, 2));
      }

      /**
       ** From User and is Notify and not Status Broadcast
       */
      if (
        !response.messages[0].key.fromMe &&
        response.type === "notify" &&
        response.messages[0].key.remoteJid != "status@broadcast"
      ) {
        /**
         *? State: Available
         */
        sock.sendPresenceUpdate(
          "available",
          response.messages[0].key.remoteJid
        );

        /**
         ** Flow
         **/
        await flow(sock, response);

        /**
         *? State: Viewed
         */
        return sock.readMessages([response.messages[0].key]);
      }
    } catch (error) {
      /**
       ** Send error message to Whatsapp Admin
       **/
      try {
        if (sentErrorMessage) {
          await sock.sendMessage(numberErrorMessage, {
            text:
              "*Error:* " +
              error +
              "\n\n*Request*:\n" +
              JSON.stringify(response, undefined, 2),
          });
        }
      } catch (error) {
        console.log(error);
      }

      console.log(error);
    }
  });
})();
